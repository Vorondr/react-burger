import { useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { useAppSelector } from '@services/hooks';

import styles from './ingredient.module.css';

export const IngredientPage = (): React.JSX.Element => {
  const { id } = useParams();
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);

  const ingredient = ingredients.find((item) => item._id === id);

  if (!ingredient) {
    return (
      <main className={styles.page}>
        <p className="text text_type_main-medium">Ингредиент не найден</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <h1 className={`${styles.title} text text_type_main-large mb-10`}>
        Детали ингредиента
      </h1>

      <IngredientDetails ingredient={ingredient} />
    </main>
  );
};
