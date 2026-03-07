import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';

import styles from './ingredient-card.module.css';

type TBurgerIngredientProps = {
  ingredient: TIngredient;
  onClick: () => void;
};

export const IngredientCard = ({
  ingredient,
  onClick,
}: TBurgerIngredientProps): React.JSX.Element => {
  return (
    <li className={styles.card} onClick={onClick}>
      <div className={styles.counter}>
        <Counter count={1} size="default" />
      </div>

      <img className={styles.image} src={ingredient.image} alt={ingredient.name} />

      <div className={styles.price}>
        <span className="text text_type_digits-default mr-2">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>

      <p className={`${styles.name} text text_type_main-default`}>{ingredient.name}</p>
    </li>
  );
};
