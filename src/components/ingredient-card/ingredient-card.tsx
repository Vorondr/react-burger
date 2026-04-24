import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';
import { makeSelectIngredientCount } from '@services/selectors';

import type { TIngredient } from '@utils/types';

import styles from './ingredient-card.module.css';

type TBurgerIngredientProps = {
  ingredient: TIngredient;
};

export const IngredientCard = ({
  ingredient,
}: TBurgerIngredientProps): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectIngredientCount = useMemo(makeSelectIngredientCount, []);

  const count = useAppSelector((state) => selectIngredientCount(state, ingredient._id));

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'ingredient',
    item: ingredient,
    collect: (monitor): { isDragging: boolean } => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClick = (): void => {
    void navigate(`/ingredients/${ingredient._id}`, {
      state: { background: location },
    });
  };

  return (
    <li
      ref={dragRef}
      className={styles.card}
      onClick={handleClick}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
    >
      {count > 0 && (
        <div className={styles.counter}>
          <Counter count={count} size="default" />
        </div>
      )}

      <img className={styles.image} src={ingredient.image} alt={ingredient.name} />

      <div className={styles.price}>
        <span className="text text_type_digits-default mr-2">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>

      <p className={`${styles.name} text text_type_main-default`}>{ingredient.name}</p>
    </li>
  );
};
