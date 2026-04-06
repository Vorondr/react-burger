import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchIngredients } from '@services/slices/ingredientsSlice';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.ingredients);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p className="text text_type_main-medium">Ошибка: {error}</p>;
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main}`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </main>
    </div>
  );
};
