import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import constructorReducer from './slices/constructorSlice';
import ingredientDetailsReducer from './slices/ingredientDetailsSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    constructorBurger: constructorReducer,
    ingredientDetails: ingredientDetailsReducer,
    order: orderReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
