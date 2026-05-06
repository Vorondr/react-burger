import { configureStore } from '@reduxjs/toolkit';

import { getAccessToken, setTokens } from '@utils/auth';
import { refreshTokenRequest } from '@utils/auth-api';

import { createSocketMiddleware } from './middleware/socketMiddleware';
import authReducer from './slices/authSlice';
import constructorReducer from './slices/constructorSlice';
import feedReducer, {
  feedConnect,
  feedConnected,
  feedConnecting,
  feedDisconnect,
  feedDisconnected,
  feedError,
  feedMessageReceived,
} from './slices/feedSlice';
import ingredientDetailsReducer from './slices/ingredientDetailsSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';
import profileOrdersReducer, {
  profileOrdersConnect,
  profileOrdersConnected,
  profileOrdersConnecting,
  profileOrdersDisconnect,
  profileOrdersDisconnected,
  profileOrdersError,
  profileOrdersMessageReceived,
} from './slices/profileOrdersSlice';

const FEED_WS_URL = 'wss://new-stellarburgers.education-services.ru/orders/all';
const PROFILE_ORDERS_WS_URL = 'wss://new-stellarburgers.education-services.ru/orders';

const getCleanAccessToken = (): string | null => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return null;
  }

  return accessToken.replace('Bearer ', '');
};

const feedMiddleware = createSocketMiddleware({
  actions: {
    connect: feedConnect,
    disconnect: feedDisconnect,
    connecting: feedConnecting,
    connected: feedConnected,
    disconnected: feedDisconnected,
    error: feedError,
    messageReceived: feedMessageReceived,
  },
  getUrl: () => FEED_WS_URL,
});

const profileOrdersMiddleware = createSocketMiddleware({
  actions: {
    connect: profileOrdersConnect,
    disconnect: profileOrdersDisconnect,
    connecting: profileOrdersConnecting,
    connected: profileOrdersConnected,
    disconnected: profileOrdersDisconnected,
    error: profileOrdersError,
    messageReceived: profileOrdersMessageReceived,
  },
  getUrl: () => {
    const token = getCleanAccessToken();

    if (!token) {
      return null;
    }

    return `${PROFILE_ORDERS_WS_URL}?token=${token}`;
  },
  refreshToken: async () => {
    const refreshData = await refreshTokenRequest();
    setTokens(refreshData.accessToken, refreshData.refreshToken);
  },
});

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    constructorBurger: constructorReducer,
    ingredientDetails: ingredientDetailsReducer,
    order: orderReducer,
    auth: authReducer,
    feed: feedReducer,
    profileOrders: profileOrdersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware, profileOrdersMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
