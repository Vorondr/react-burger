import { useEffect } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { feedConnect, feedDisconnect } from '@services/slices/feedSlice';

import type { TOrder } from '@utils/types';

import styles from './feed-page.module.css';

const getStatusColumns = (orders: TOrder[]): TOrder[][] => {
  const firstTwentyOrders = orders.slice(0, 20);

  return [firstTwentyOrders.slice(0, 10), firstTwentyOrders.slice(10, 20)].filter(
    (column) => column.length > 0
  );
};

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const { orders, total, totalToday, error } = useAppSelector((state) => state.feed);

  useEffect((): (() => void) => {
    dispatch(feedConnect());

    return (): void => {
      dispatch(feedDisconnect());
    };
  }, [dispatch]);

  const doneOrders = orders.filter((order) => order.status === 'done');
  const pendingOrders = orders.filter(
    (order) => order.status === 'pending' || order.status === 'created'
  );

  const doneColumns = getStatusColumns(doneOrders);
  const pendingColumns = getStatusColumns(pendingOrders);

  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-large mb-5">Лента заказов</h1>

      {error && (
        <p className="text text_type_main-default text_color_inactive mb-4">{error}</p>
      )}

      <div className={styles.content}>
        <section className={`${styles.orders} custom-scroll`}>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} path="/feed" />
          ))}
        </section>

        <section className={styles.stats}>
          <div className={styles.statuses}>
            <div>
              <h2 className="text text_type_main-medium mb-6">Готовы:</h2>

              <div className={styles.statusColumns}>
                {doneColumns.map((column, columnIndex) => (
                  <ul className={styles.statusList} key={columnIndex}>
                    {column.map((order) => (
                      <li
                        className={`${styles.done} text text_type_digits-default mb-2`}
                        key={order._id}
                      >
                        {order.number}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text text_type_main-medium mb-6">В работе:</h2>

              <div className={styles.statusColumns}>
                {pendingColumns.map((column, columnIndex) => (
                  <ul className={styles.statusList} key={columnIndex}>
                    {column.map((order) => (
                      <li className="text text_type_digits-default mb-2" key={order._id}>
                        {order.number}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>

          <h2 className="text text_type_main-medium mt-15 mb-6">
            Выполнено за все время:
          </h2>
          <p className={`${styles.total} text text_type_digits-large`}>{total}</p>

          <h2 className="text text_type_main-medium mt-15 mb-6">
            Выполнено за сегодня:
          </h2>
          <p className={`${styles.total} text text_type_digits-large`}>{totalToday}</p>
        </section>
      </div>
    </main>
  );
};
