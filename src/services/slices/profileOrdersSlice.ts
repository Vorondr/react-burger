import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TOrder, TOrdersResponse } from '@utils/types';

type TProfileOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  error: null,
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    profileOrdersConnect: (state) => state,

    profileOrdersDisconnect: (state) => state,

    profileOrdersConnecting: (state) => {
      state.error = null;
    },

    profileOrdersConnected: (state) => {
      state.isConnected = true;
      state.error = null;
    },

    profileOrdersDisconnected: (state) => {
      state.isConnected = false;
    },

    profileOrdersError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnected = false;
    },

    profileOrdersMessageReceived: (state, action: PayloadAction<TOrdersResponse>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },

    profileOrdersClear: (state) => {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
      state.error = null;
      state.isConnected = false;
    },
  },
});

export const {
  profileOrdersConnect,
  profileOrdersDisconnect,
  profileOrdersConnecting,
  profileOrdersConnected,
  profileOrdersDisconnected,
  profileOrdersError,
  profileOrdersMessageReceived,
  profileOrdersClear,
} = profileOrdersSlice.actions;

export default profileOrdersSlice.reducer;
