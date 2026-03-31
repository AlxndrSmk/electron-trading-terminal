import { createSelector } from 'reselect';
import { instrumentsSelectors } from './slices/instrumentsSlice';
import type { RootState } from './index';

const selectInstrumentsState = (state: RootState) => state.instruments;
const selectPricesBySymbol = (state: RootState) => state.prices.bySymbol;

export const selectInstrumentSymbols = createSelector(selectInstrumentsState, (instruments) =>
  instrumentsSelectors.selectIds(instruments) as string[],
);

export const selectSelectedSymbol = (state: RootState) => state.ui.selectedSymbol;
export const selectTheme = (state: RootState) => state.ui.theme;

export const makeSelectInstrumentRow = (symbol: string) =>
  createSelector(selectInstrumentsState, selectPricesBySymbol, (instruments, pricesBySymbol) => {
    const instrument = instruments.entities[symbol];
    const price = pricesBySymbol[symbol];
    if (!instrument || !price) {
      return null;
    }

    return {
      symbol: instrument.symbol,
      name: instrument.name,
      bid: price.bid,
      ask: price.ask,
      previousBid: price.previousBid,
      timestamp: price.timestamp,
    };
  });

export const makeSelectSymbolHistory = (symbol: string) =>
  createSelector(selectPricesBySymbol, (pricesBySymbol) => pricesBySymbol[symbol]?.history ?? []);

export const makeSelectSymbolPrice = (symbol: string) =>
  createSelector(selectPricesBySymbol, (pricesBySymbol) => pricesBySymbol[symbol] ?? null);
