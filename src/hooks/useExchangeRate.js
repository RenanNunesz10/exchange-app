import { useState, useEffect, useCallback } from 'react';
import { fetchExchangeRate } from '../services/frankfurterApi.js';

/**
 * Custom Hook para buscar a cotação unitária mais recente entre duas moedas.
 *
 * @param {string} baseCurrency Moeda de origem (ex.: 'USD')
 * @param {string} targetCurrency Moeda de destino (ex.: 'BRL')
 * @returns {{
 *   rateData: { date: string, base: string, quote: string, rate: number } | null,
 *   loading: boolean,
 *   error: string | null,
 *   refetch: () => void
 * }}
 */
export function useExchangeRate(baseCurrency, targetCurrency) {
  const [rateData, setRateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [triggerCount, setTriggerCount] = useState(0);

  const refetch = useCallback(() => {
    setTriggerCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!baseCurrency || !targetCurrency) {
      setRateData(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let isMounted = true;

    async function loadRate() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchExchangeRate(baseCurrency, targetCurrency, controller.signal);
        if (isMounted) {
          setRateData(data);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) {
          setError(err.message || 'Erro ao consultar a taxa de câmbio.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRate();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [baseCurrency, targetCurrency, triggerCount]);

  return { rateData, loading, error, refetch };
}
