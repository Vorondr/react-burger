import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useParams } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';
import {
  formatOrderDate,
  getOrderIngredients,
  getOrderPrice,
  getStatusText,
} from '@utils/order-helpers';

import type { TIngredient } from '@utils/types';

import styles from './order-info.module.css';

type TOrderInfoProps = {
  isModal?: boolean;
};

type TIngredientWithCount = TIngredient & {
  count: number;
};

export const OrderInfo = ({ isModal = false }: TOrderInfoProps): React.JSX.Element => {
  const { id } = useParams();
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);

  const feedOrders = useAppSelector((state) => state.feed.orders);
  const profileOrders = useAppSelector((state) => state.profileOrders.orders);

  const order = [...feedOrders, ...profileOrders].find(
    (item) => String(item.number) === id
  );

  if (!order) {
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
        className={`${isModal ? styles.numberModal : styles.numberPage} text text_type_digits-default mb-10`}
      >
        #{order.number}
      </p>

      <h1 className="text text_type_main-medium mb-3">{order.name}</h1>

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
