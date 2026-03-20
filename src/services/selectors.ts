import { createSelector } from '@reduxjs/toolkit';

import { selectBun, selectConstructorIngredients } from './slices/constructorSlice';

import type { RootState } from './store';

const selectBunFromRoot = (state: RootState): ReturnType<typeof selectBun> =>
  selectBun(state);

const selectIngredientsFromRoot = (
  state: RootState
): ReturnType<typeof selectConstructorIngredients> =>
  selectConstructorIngredients(state);

export const makeSelectIngredientCount = (): ((
  state: RootState,
  ingredientId: string
) => number) =>
  createSelector(
    [
      selectBunFromRoot,
      selectIngredientsFromRoot,
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
