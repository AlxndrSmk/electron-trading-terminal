import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode } from '@shared/types';

interface UIState {
  selectedSymbol: string;
  theme: ThemeMode;
}

const initialState: UIState = {
  selectedSymbol: 'BTC-USD',
  theme: 'dark',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedSymbol(state, action: PayloadAction<string>) {
      state.selectedSymbol = action.payload;
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
  },
});

export const { setSelectedSymbol, setTheme, toggleTheme } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
