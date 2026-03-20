import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState, useMemo, useCallback } from 'react';

import { IngredientCard } from '@components/ingredient-card/ingredient-card.tsx';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details.tsx';
import { Modal } from '@components/modal/modal.tsx';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  clearSelectedIngredient,
  setSelectedIngredient,
} from '@services/slices/ingredientDetailsSlice';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

type TTab = 'bun' | 'main' | 'sauce';

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const selectedIngredient = useAppSelector(
    (state) => state.ingredientDetails.selectedIngredient
  );

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

  const [currentTab, setCurrentTab] = useState<TTab>('bun');

  const containerRef = useRef<HTMLDivElement | null>(null);

  const bunRef = useRef<HTMLElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const sauceRef = useRef<HTMLElement | null>(null);

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

  const handleScroll = useCallback((): void => {
    const container = containerRef.current;

    if (!container || !bunRef.current || !mainRef.current || !sauceRef.current) {
      return;
    }

    const containerTop = container.getBoundingClientRect().top;

    const distances = [
      {
        tab: 'bun' as TTab,
        distance: Math.abs(bunRef.current.getBoundingClientRect().top - containerTop),
      },
      {
        tab: 'main' as TTab,
        distance: Math.abs(mainRef.current.getBoundingClientRect().top - containerTop),
      },
      {
        tab: 'sauce' as TTab,
        distance: Math.abs(sauceRef.current.getBoundingClientRect().top - containerTop),
      },
    ];

    const closestTab = distances.reduce((prev, current) =>
      current.distance < prev.distance ? current : prev
    );

    setCurrentTab(closestTab.tab);
  }, []);

  const onCloseModal = useCallback(() => {
    dispatch(clearSelectedIngredient());
  }, [dispatch]);

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

      <div
        ref={containerRef}
        className={styles.ingredients_container}
        onScroll={handleScroll}
      >
        <section ref={bunRef}>
          <h2 className="text text_type_main-medium mb-6">Булки</h2>
          <ul className={styles.ingredients_grid}>
            {buns.map((item) => (
              <IngredientCard
                key={item._id}
                ingredient={item}
                onClick={() => dispatch(setSelectedIngredient(item))}
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
                onClick={() => dispatch(setSelectedIngredient(item))}
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
                onClick={() => dispatch(setSelectedIngredient(item))}
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
