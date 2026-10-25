import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchHistoricalRates } from '../services/frankfurterApi.js';
import { getPeriodDateRange } from '../utils/dateUtils.js';

/**
 * Custom Hook para gerenciar a busca da série histórica de cotações para um par de moedas e período.
 *
 * @param {string} baseCurrency Moeda de origem
 * @param {string} targetCurrency Moeda de destino
 * @param {string} periodId Identificador do período ('7d', '15d', '30d', etc.)
 * @returns {{
 *   records: Array<{ date: string, base: string, quote: string, rate: number }>,
 *   dateRange: { from: string, to: string, period: object } | null,
 *   loading: boolean,
 *   error: string | null,
 *   refetch: () => void
 * }}
 */
export function useHistoricalRates(baseCurrency, targetCurrency, periodId) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [triggerCount, setTriggerCount] = useState(0);

  const dateRange = useMemo(() => {
    if (!periodId) return null;
    return getPeriodDateRange(periodId);
  }, [periodId]);

  const refetch = useCallback(() => {
    setTriggerCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!baseCurrency || !targetCurrency || !dateRange) {
      setRecords([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let isMounted = true;

    async function loadHistory() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchHistoricalRates({
          base: baseCurrency,
          quote: targetCurrency,
          from: dateRange.from,
          to: dateRange.to,
          signal: controller.signal,
        });

        if (isMounted) {
          setRecords(data);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) {
          setError(err.message || 'Erro ao carregar série histórica.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [baseCurrency, targetCurrency, dateRange, triggerCount]);

  return { records, dateRange, loading, error, refetch };
}
