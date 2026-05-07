import { useEffect } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  profileOrdersConnect,
  profileOrdersDisconnect,
} from '@services/slices/profileOrdersSlice';

import styles from './profile-orders-page.module.css';

export const ProfileOrdersPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const { orders, error } = useAppSelector((state) => state.profileOrders);

  useEffect((): (() => void) => {
    dispatch(profileOrdersConnect());

    return (): void => {
      dispatch(profileOrdersDisconnect());
    };
  }, [dispatch]);

  return (
    <section className={`${styles.orders} custom-scroll`}>
      {error && (
        <p className="text text_type_main-default text_color_inactive mb-4">{error}</p>
      )}

      {orders.map((order) => (
        <OrderCard key={order._id} order={order} path="/profile/orders" showStatus />
      ))}
    </section>
  );
};
