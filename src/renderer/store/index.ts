import { configureStore } from '@reduxjs/toolkit';
import { instrumentsReducer } from './slices/instrumentsSlice';
import { pricesReducer } from './slices/pricesSlice';
import { uiReducer } from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    instruments: instrumentsReducer,
    prices: pricesReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
