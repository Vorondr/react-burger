import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from './store';

const selectBun = (state: RootState): RootState['constructorBurger']['bun'] =>
  state.constructorBurger.bun;

const selectConstructorIngredients = (
  state: RootState
): RootState['constructorBurger']['ingredients'] => state.constructorBurger.ingredients;

export const makeSelectIngredientCount = (): ((
  state: RootState,
  ingredientId: string
) => number) =>
  createSelector(
    [
      selectBun,
      selectConstructorIngredients,
      (_state: RootState, ingredientId: string): string => ingredientId,
    ],
    (bun, ingredients, ingredientId): number => {
      const bunCount = bun && bun._id === ingredientId ? 2 : 0;
      const ingredientsCount = ingredients.filter(
        (item) => item._id === ingredientId
      ).length;

      return bunCount + ingredientsCount;
    }
  );

export const selectTotalPrice = createSelector(
  [selectBun, selectConstructorIngredients],
  (bun, ingredients): number => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);

    return bunPrice + ingredientsPrice;
  }
);
