import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState, useMemo, useCallback } from 'react';

import { IngredientCard } from '@components/ingredient-card/ingredient-card.tsx';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details.tsx';
import { Modal } from '@components/modal/modal.tsx';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const buns = useMemo(
    () => ingredients.filter((item) => item.type === 'bun'),
    [ingredients]
  );

  const mains = useMemo(
    () => ingredients.filter((item) => item.type === 'main'),
    [ingredients]
  );

  const sauces = useMemo(
    () => ingredients.filter((item) => item.type === 'sauce'),
    [ingredients]
  );

  type TTab = 'bun' | 'main' | 'sauce';

  const [currentTab, setCurrentTab] = useState<TTab>('bun');

  const bunRef = useRef<HTMLElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const sauceRef = useRef<HTMLElement | null>(null);

  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);

  const handleTabClick = useCallback((tab: TTab): void => {
    setCurrentTab(tab);

    if (tab === 'bun') {
      bunRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    if (tab === 'main') {
      mainRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    if (tab === 'sauce') {
      sauceRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const onCloseModal = useCallback(() => {
    setSelectedIngredient(null);
  }, []);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={currentTab === 'bun'}
            onClick={() => handleTabClick('bun')}
          >
            Булки
          </Tab>
          <Tab
            value="main"
            active={currentTab === 'main'}
            onClick={() => handleTabClick('main')}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={currentTab === 'sauce'}
            onClick={() => handleTabClick('sauce')}
          >
            Соусы
          </Tab>
        </ul>
      </nav>
      <div className={styles.ingredients_container}>
        <section ref={bunRef}>
          <h2 className="text text_type_main-medium mb-6">Булки</h2>
          <ul className={styles.ingredients_grid}>
            {buns.map((item) => (
              <IngredientCard
                key={item._id}
                ingredient={item}
                onClick={() => setSelectedIngredient(item)}
              />
            ))}
          </ul>
        </section>

        <section ref={mainRef}>
          <h2 className="text text_type_main-medium mb-6">Начинки</h2>
          <ul className={styles.ingredients_grid}>
            {mains.map((item) => (
              <IngredientCard
                key={item._id}
                ingredient={item}
                onClick={() => setSelectedIngredient(item)}
              />
            ))}
          </ul>
        </section>

        <section ref={sauceRef}>
          <h2 className="text text_type_main-medium mb-6">Соусы</h2>
          <ul className={styles.ingredients_grid}>
            {sauces.map((item) => (
              <IngredientCard
                key={item._id}
                ingredient={item}
                onClick={() => setSelectedIngredient(item)}
              />
            ))}
          </ul>
        </section>
      </div>
      {selectedIngredient && (
        <Modal onClose={onCloseModal} title="Детали ингредиента">
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </section>
  );
};
