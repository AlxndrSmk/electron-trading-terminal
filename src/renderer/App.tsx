import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useMockFeed } from './hooks/useMockFeed';
import { useAppDispatch } from './hooks/useAppDispatch';
import { InstrumentTable } from './components/InstrumentTable';
import { PriceChart } from './components/PriceChart';
import { DetailWindow } from './components/DetailWindow';
import { selectSelectedSymbol, selectTheme } from './store/selectors';
import { setSelectedSymbol, setTheme, toggleTheme } from './store/slices/uiSlice';

function useWindowQuery() {
  return useMemo(() => new URLSearchParams(window.location.search), []);
}

export default function App() {
  const dispatch = useAppDispatch();
  const query = useWindowQuery();
  const selectedSymbol = useSelector(selectSelectedSymbol);
  const theme = useSelector(selectTheme);
  const isDetailsWindow = query.get('window') === 'details';
  const detailSymbolFromQuery = query.get('symbol');

  useMockFeed();

  useEffect(() => {
    void window.electronAPI.getSelection().then((symbol) => {
      dispatch(setSelectedSymbol(symbol));
    });
    const unsubscribe = window.electronAPI.onSelectionUpdated((symbol) => {
      dispatch(setSelectedSymbol(symbol));
    });
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    void window.electronAPI.getTheme().then((nextTheme) => {
      dispatch(setTheme(nextTheme));
    });
    const unsubscribe = window.electronAPI.onThemeUpdated((nextTheme) => {
      dispatch(setTheme(nextTheme));
    });
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (detailSymbolFromQuery) {
      dispatch(setSelectedSymbol(detailSymbolFromQuery));
    }
  }, [detailSymbolFromQuery, dispatch]);

  if (isDetailsWindow) {
    return <DetailWindow symbol={selectedSymbol} />;
  }

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    window.electronAPI.setTheme(nextTheme);
  };

  return (
    <main className="layout">
      <header className="topbar">
        <h1>Electron Trading Terminal</h1>
        <div className="topbar-controls">
          <span className="selected-label">Selected: {selectedSymbol}</span>
          <button type="button" onClick={handleToggleTheme}>
            Theme: {theme}
          </button>
        </div>
      </header>
      <div className="grid">
        <InstrumentTable />
        <PriceChart symbol={selectedSymbol} />
      </div>
    </main>
  );
}
