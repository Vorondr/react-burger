import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TOrder, TOrdersResponse } from '@utils/types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  error: null,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    feedConnect: (state) => state,

    feedDisconnect: (state) => state,

    feedConnecting: (state) => {
      state.error = null;
    },

    feedConnected: (state) => {
      state.isConnected = true;
      state.error = null;
    },

    feedDisconnected: (state) => {
      state.isConnected = false;
    },

    feedError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnected = false;
    },

    feedMessageReceived: (state, action: PayloadAction<TOrdersResponse>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
  },
});

export const {
  feedConnect,
  feedDisconnect,
  feedConnecting,
  feedConnected,
  feedDisconnected,
  feedError,
  feedMessageReceived,
} = feedSlice.actions;

export default feedSlice.reducer;
