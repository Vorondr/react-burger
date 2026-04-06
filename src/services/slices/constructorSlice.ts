import {
  createSelector,
  createSlice,
  type PayloadAction,
  nanoid,
} from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/types';

export type TConstructorIngredient = TIngredient & {
  uuid: string;
};

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;

        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          uuid: nanoid(),
        },
      }),
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.uuid !== action.payload
      );
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const movedIngredient = state.ingredients[fromIndex];

      state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedIngredient);
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
  selectors: {
    selectBun: (state): TConstructorState['bun'] => state.bun,
    selectConstructorIngredients: (state): TConstructorState['ingredients'] =>
      state.ingredients,
    selectTotalPrice: createSelector(
      [
        (state: TConstructorState): TConstructorState['bun'] => state.bun,
        (state: TConstructorState): TConstructorState['ingredients'] =>
          state.ingredients,
      ],
      (bun, ingredients): number => {
        const bunPrice = bun ? bun.price * 2 : 0;
        const ingredientsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);

        return bunPrice + ingredientsPrice;
      }
    ),
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  constructorSlice.actions;

export const { selectBun, selectConstructorIngredients, selectTotalPrice } =
  constructorSlice.selectors;

export default constructorSlice.reducer;
