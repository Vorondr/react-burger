import { CurrencyIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { feedConnect, feedDisconnect } from '@services/slices/feedSlice';
import {
  profileOrdersConnect,
  profileOrdersDisconnect,
} from '@services/slices/profileOrdersSlice';
import { getOrderByNumberRequest } from '@utils/order-api';
import {
  formatOrderDate,
  getOrderIngredients,
  getOrderPrice,
  getStatusText,
} from '@utils/order-helpers';

import type { TIngredient, TOrder } from '@utils/types';

import styles from './order-info.module.css';

type TOrderInfoProps = {
  isModal?: boolean;
};

type TIngredientWithCount = TIngredient & {
  count: number;
};

export const OrderInfo = ({ isModal = false }: TOrderInfoProps): React.JSX.Element => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const isProfileOrder = location.pathname.startsWith('/profile/orders');

  const ingredients = useAppSelector((state) => state.ingredients.ingredients);

  const feedOrders = useAppSelector((state) => state.feed.orders);
  const isFeedConnected = useAppSelector((state) => state.feed.isConnected);
  const feedError = useAppSelector((state) => state.feed.error);

  const profileOrders = useAppSelector((state) => state.profileOrders.orders);
  const isProfileOrdersConnected = useAppSelector(
    (state) => state.profileOrders.isConnected
  );
  const profileOrdersError = useAppSelector((state) => state.profileOrders.error);

  const orders = isProfileOrder ? profileOrders : feedOrders;
  const isSocketConnected = isProfileOrder ? isProfileOrdersConnected : isFeedConnected;
  const socketError = isProfileOrder ? profileOrdersError : feedError;

  const orderFromStore = useMemo(() => {
    return orders.find((item) => String(item.number) === id);
  }, [orders, id]);

  const [loadedOrder, setLoadedOrder] = useState<TOrder | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [orderError, setOrderError] = useState(false);

  const order = orderFromStore ?? loadedOrder;

  useEffect((): (() => void) | void => {
    if (isModal) {
      return;
    }

    if (isProfileOrder) {
      dispatch(profileOrdersConnect());

      return (): void => {
        dispatch(profileOrdersDisconnect());
      };
    }

    dispatch(feedConnect());

    return (): void => {
      dispatch(feedDisconnect());
    };
  }, [dispatch, isModal, isProfileOrder]);

  useEffect((): (() => void) | void => {
    if (!id || orderFromStore || loadedOrder) {
      return;
    }

    if (!isSocketConnected && !socketError) {
      return;
    }

    const timer = setTimeout((): void => {
      setIsLoadingOrder(true);
      setOrderError(false);

      void getOrderByNumberRequest(id)
        .then((data): void => {
          const foundOrder = data.orders[0];

          if (!foundOrder) {
            setOrderError(true);
            return;
          }

          setLoadedOrder(foundOrder);
        })
        .catch((): void => {
          setOrderError(true);
        })
        .finally((): void => {
          setIsLoadingOrder(false);
        });
    }, 700);

    return (): void => {
      clearTimeout(timer);
    };
  }, [id, orderFromStore, loadedOrder, isSocketConnected, socketError]);

  if (!order && !orderError) {
    return (
      <section className={isModal ? styles.modal : styles.page}>
        <Preloader />
      </section>
    );
  }

  if (isLoadingOrder) {
    return (
      <section className={isModal ? styles.modal : styles.page}>
        <Preloader />
      </section>
    );
  }

  if (!order || orderError) {
    return (
      <section className={isModal ? styles.modal : styles.page}>
        <p className="text text_type_main-medium">Заказ не найден</p>
      </section>
    );
  }

  const orderIngredients = getOrderIngredients(order.ingredients, ingredients);
  const price = getOrderPrice(order.ingredients, ingredients);

  const ingredientsWithCount = orderIngredients.reduce<TIngredientWithCount[]>(
    (acc, ingredient) => {
      const existingIngredient = acc.find((item) => item._id === ingredient._id);

      if (existingIngredient) {
        existingIngredient.count += 1;
      } else {
        acc.push({
          ...ingredient,
          count: 1,
        });
      }

      return acc;
    },
    []
  );

  return (
    <section className={isModal ? styles.modal : styles.page}>
      <p
        className={`${
          isModal ? styles.numberModal : styles.numberPage
        } text text_type_digits-default mb-10`}
      >
        #{order.number}
      </p>

      <h1 className="text text_type_main-medium mb-3">
        {order.name ?? 'Неназванный бургер'}
      </h1>

      <p className={`${styles.status} text text_type_main-default mb-15`}>
        {getStatusText(order.status)}
      </p>

      <h2 className="text text_type_main-medium mb-6">Состав:</h2>

      <ul className={`${styles.list} custom-scroll`}>
        {ingredientsWithCount.map((ingredient) => (
          <li className={styles.item} key={ingredient._id}>
            <div className={styles.image}>
              <img src={ingredient.image_mobile} alt={ingredient.name} />
            </div>

            <p className={`${styles.name} text text_type_main-default`}>
              {ingredient.name}
            </p>

            <div className={styles.price}>
              <p className="text text_type_digits-default">
                {ingredient.count} x {ingredient.price}
              </p>
              <CurrencyIcon type="primary" />
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <p className="text text_type_main-default text_color_inactive">
          {formatOrderDate(order.createdAt)}
        </p>

        <div className={styles.price}>
          <p className="text text_type_digits-default">{price}</p>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </section>
  );
};
