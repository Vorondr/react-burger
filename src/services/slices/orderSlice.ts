import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { postOrder } from '@utils/ingredients-api';

type TOrderState = {
  orderNumber: number | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderNumber: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const data = await postOrder(ingredientIds);
      return data.order.number;
    } catch (_error) {
      return rejectWithValue('Не удалось оформить заказ');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderNumber = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumber = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка оформления заказа';
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
