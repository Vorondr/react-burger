import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';
import {
  formatOrderDate,
  getOrderIngredients,
  getOrderPrice,
  getStatusText,
} from '@utils/order-helpers';

import type { TOrder } from '@utils/types';

import styles from './order-card.module.css';

type TOrderCardProps = {
  order: TOrder;
  path: string;
  showStatus?: boolean;
};

export const OrderCard = ({
  order,
  path,
  showStatus = false,
}: TOrderCardProps): React.JSX.Element => {
  const location = useLocation();
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);

  const orderIngredients = getOrderIngredients(order.ingredients, ingredients);
  const price = getOrderPrice(order.ingredients, ingredients);

  const visibleIngredients = orderIngredients.slice(0, 6);
  const hiddenCount = orderIngredients.length - visibleIngredients.length;

  return (
    <Link
      to={`${path}/${order.number}`}
      state={{ background: location }}
      className={styles.card}
    >
      <div className={styles.header}>
        <p className="text text_type_digits-default">#{order.number}</p>
        <p className="text text_type_main-default text_color_inactive">
          {formatOrderDate(order.createdAt)}
        </p>
      </div>

      <h2 className={`${styles.title} text text_type_main-medium`}>
        {order.name ?? 'Неназванный бургер'}
      </h2>

      {showStatus && (
        <p className={`${styles.status} text text_type_main-default`}>
          {getStatusText(order.status)}
        </p>
      )}

      <div className={styles.footer}>
        <ul className={styles.ingredients}>
          {visibleIngredients.map((ingredient, index) => (
            <li
              className={styles.ingredient}
              key={`${ingredient._id}-${index}`}
              style={{ zIndex: visibleIngredients.length - index }}
            >
              <img src={ingredient.image_mobile} alt={ingredient.name} />

              {index === 5 && hiddenCount > 0 && (
                <span className={`${styles.counter} text text_type_main-default`}>
                  +{hiddenCount}
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className={styles.price}>
          <p className="text text_type_digits-default">{price}</p>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </Link>
  );
};
