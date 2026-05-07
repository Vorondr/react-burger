import type {
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
  Middleware,
  UnknownAction,
} from '@reduxjs/toolkit';
import type { TOrder, TOrdersResponse } from '@utils/types';

type TSocketErrorResponse = {
  success: false;
  message: string;
};

type TSocketActions = {
  connect: ActionCreatorWithoutPayload;
  disconnect: ActionCreatorWithoutPayload;
  connecting: ActionCreatorWithoutPayload;
  connected: ActionCreatorWithoutPayload;
  disconnected: ActionCreatorWithoutPayload;
  error: ActionCreatorWithPayload<string>;
  messageReceived: ActionCreatorWithPayload<TOrdersResponse>;
};

type TCreateSocketMiddlewareParams = {
  actions: TSocketActions;
  getUrl: () => string | null | Promise<string | null>;
  refreshToken?: () => Promise<void>;
  reconnectInterval?: number;
};

const ORDER_STATUSES = ['created', 'pending', 'done'];

const isValidOrder = (order: unknown): order is TOrder => {
  if (!order || typeof order !== 'object') {
    return false;
  }

  const checkedOrder = order as TOrder;

  return (
    typeof checkedOrder._id === 'string' &&
    checkedOrder._id.length > 0 &&
    Array.isArray(checkedOrder.ingredients) &&
    checkedOrder.ingredients.length > 0 &&
    checkedOrder.ingredients.every((id) => typeof id === 'string' && id.length > 0) &&
    typeof checkedOrder.number === 'number' &&
    ORDER_STATUSES.includes(checkedOrder.status) &&
    typeof checkedOrder.createdAt === 'string' &&
    typeof checkedOrder.updatedAt === 'string'
  );
};

const isOrdersResponse = (data: unknown): data is TOrdersResponse => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const checkedData = data as TOrdersResponse;

  return (
    checkedData.success === true &&
    Array.isArray(checkedData.orders) &&
    typeof checkedData.total === 'number' &&
    typeof checkedData.totalToday === 'number'
  );
};

const isInvalidTokenResponse = (data: unknown): data is TSocketErrorResponse => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const checkedData = data as TSocketErrorResponse;

  return (
    checkedData.success === false && checkedData.message === 'Invalid or missing token'
  );
};

const getMessageData = (event: MessageEvent): string | null => {
  if (typeof event.data === 'string') {
    return event.data;
  }

  return null;
};

export const createSocketMiddleware = ({
  actions,
  getUrl,
  refreshToken,
  reconnectInterval = 3000,
}: TCreateSocketMiddlewareParams): Middleware => {
  return (store) => {
    let socket: WebSocket | null = null;
    let isManualClose = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const clearReconnectTimer = (): void => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    const closeSocket = (): void => {
      clearReconnectTimer();

      if (socket) {
        socket.close();
        socket = null;
      }
    };

    const connectSocket = async (): Promise<void> => {
      clearReconnectTimer();

      const url = await getUrl();

      if (!url) {
        store.dispatch(actions.error('Не удалось получить URL для WebSocket'));
        return;
      }

      isManualClose = false;

      closeSocket();

      store.dispatch(actions.connecting());

      socket = new WebSocket(url);

      socket.onopen = (): void => {
        store.dispatch(actions.connected());
      };

      socket.onmessage = (event: MessageEvent): void => {
        const messageData = getMessageData(event);

        if (!messageData) {
          return;
        }

        try {
          const data = JSON.parse(messageData) as unknown;

          if (isInvalidTokenResponse(data) && refreshToken) {
            isManualClose = true;
            closeSocket();

            void refreshToken()
              .then((): Promise<void> => connectSocket())
              .catch((): void => {
                store.dispatch(actions.error('Не удалось обновить токен'));
              });

            return;
          }

          if (!isOrdersResponse(data)) {
            return;
          }

          const validOrders = data.orders.filter(isValidOrder);

          store.dispatch(
            actions.messageReceived({
              ...data,
              orders: validOrders,
            })
          );
        } catch {
          store.dispatch(actions.error('Ошибка обработки данных WebSocket'));
        }
      };

      socket.onerror = (): void => {
        store.dispatch(actions.error('Ошибка WebSocket-соединения'));
      };

      socket.onclose = (): void => {
        store.dispatch(actions.disconnected());

        if (!isManualClose) {
          reconnectTimer = setTimeout((): void => {
            void connectSocket();
          }, reconnectInterval);
        }
      };
    };

    return (next) => {
      return (action: UnknownAction): unknown => {
        if (actions.connect.match(action)) {
          void connectSocket();
        }

        if (actions.disconnect.match(action)) {
          isManualClose = true;
          closeSocket();
          store.dispatch(actions.disconnected());
        }

        return next(action);
      };
    };
  };
};
