import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/types';

type TIngredientDetailsState = {
  selectedIngredient: TIngredient | null;
};

const initialState: TIngredientDetailsState = {
  selectedIngredient: null,
};

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setSelectedIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.selectedIngredient = action.payload;
    },
    clearSelectedIngredient: (state) => {
      state.selectedIngredient = null;
    },
  },
});

export const { setSelectedIngredient, clearSelectedIngredient } =
  ingredientDetailsSlice.actions;

export default ingredientDetailsSlice.reducer;
