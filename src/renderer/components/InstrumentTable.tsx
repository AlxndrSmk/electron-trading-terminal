import { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectInstrumentSymbols } from '@renderer/store/selectors';
import { InstrumentRow } from './InstrumentRow';

function InstrumentTableBase() {
  const symbols = useSelector(selectInstrumentSymbols);

  const openDetails = useCallback((symbol: string) => {
    void window.electronAPI.openTradeDetails(symbol);
  }, []);

  return (
    <section className="panel table-panel">
      <div className="panel-title">Instruments</div>
      <table className="instrument-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Bid</th>
            <th>Ask</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {symbols.map((symbol) => (
            <InstrumentRow key={symbol} symbol={symbol} onOpenDetails={openDetails} />
          ))}
        </tbody>
      </table>
    </section>
  );
}

export const InstrumentTable = memo(InstrumentTableBase);
