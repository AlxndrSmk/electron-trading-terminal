import { memo, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectInstrumentRow, selectSelectedSymbol } from '@renderer/store/selectors';
import { useAppDispatch } from '@renderer/hooks/useAppDispatch';
import { setSelectedSymbol } from '@renderer/store/slices/uiSlice';

interface InstrumentRowProps {
  symbol: string;
  onOpenDetails: (symbol: string) => void;
}

function InstrumentRowBase({ symbol, onOpenDetails }: InstrumentRowProps) {
  const dispatch = useAppDispatch();
  const selectedSymbol = useSelector(selectSelectedSymbol);
  const selectRow = useMemo(() => makeSelectInstrumentRow(symbol), [symbol]);
  const row = useSelector(selectRow);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (!row || row.previousBid == null || row.previousBid === row.bid) {
      return;
    }
    setFlash(row.bid > row.previousBid ? 'up' : 'down');
    const timeout = window.setTimeout(() => setFlash(null), 220);
    return () => window.clearTimeout(timeout);
  }, [row]);

  if (!row) {
    return (
      <tr>
        <td>{symbol}</td>
        <td colSpan={4}>Waiting for first tick...</td>
      </tr>
    );
  }

  const isSelected = selectedSymbol === row.symbol;
  const rowClassName = [
    'instrument-row',
    isSelected ? 'selected' : '',
    flash === 'up' ? 'flash-up' : '',
    flash === 'down' ? 'flash-down' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    dispatch(setSelectedSymbol(row.symbol));
    window.electronAPI.publishSelection(row.symbol);
    onOpenDetails(row.symbol);
  };

  return (
    <tr className={rowClassName} onClick={handleClick}>
      <td>{row.symbol}</td>
      <td>{row.name}</td>
      <td>{row.bid.toFixed(row.bid > 1 ? 2 : 5)}</td>
      <td>{row.ask.toFixed(row.ask > 1 ? 2 : 5)}</td>
      <td>{new Date(row.timestamp).toLocaleTimeString()}</td>
    </tr>
  );
}

export const InstrumentRow = memo(InstrumentRowBase);
