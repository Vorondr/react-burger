import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { getIngredients } from '@utils/ingredients-api';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getIngredients()
      .then((data) => {
        setIngredients(data);
      })
      .catch((err) => {
        console.error(err);
        throw new Error('Ошибка при получении данных');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients ingredients={ingredients} />
        <BurgerConstructor ingredients={ingredients} />
      </main>
    </div>
  );
};

export default App;
