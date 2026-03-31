import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectSymbolPrice } from '@renderer/store/selectors';
import { PriceChart } from './PriceChart';

interface DetailWindowProps {
  symbol: string;
}

export function DetailWindow({ symbol }: DetailWindowProps) {
  const selectPrice = useMemo(() => makeSelectSymbolPrice(symbol), [symbol]);
  const price = useSelector(selectPrice);

  return (
    <main className="layout detail-layout">
      <header className="topbar">
        <h1>Trade Details - {symbol}</h1>
      </header>
      <section className="panel detail-metrics">
        <div className="metric">
          <span>Bid</span>
          <strong>{price ? price.bid.toFixed(price.bid > 1 ? 2 : 5) : '--'}</strong>
        </div>
        <div className="metric">
          <span>Ask</span>
          <strong>{price ? price.ask.toFixed(price.ask > 1 ? 2 : 5) : '--'}</strong>
        </div>
        <div className="metric">
          <span>Spread</span>
          <strong>{price ? (price.ask - price.bid).toFixed(price.ask > 1 ? 4 : 6) : '--'}</strong>
        </div>
        <div className="metric">
          <span>Last Update</span>
          <strong>{price ? new Date(price.timestamp).toLocaleTimeString() : '--'}</strong>
        </div>
      </section>
      <PriceChart symbol={symbol} title={`${symbol} Detail Chart`} />
    </main>
  );
}
