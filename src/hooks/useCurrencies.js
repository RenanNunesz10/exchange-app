import { useState, useEffect, useCallback } from 'react';
import { fetchCurrencies } from '../services/frankfurterApi.js';

/**
 * Custom Hook para carregar a lista de moedas disponíveis na API Frankfurter v2.
 *
 * @returns {{
 *   currencies: Array<{ code: string, name: string, originalName: string, symbol: string, label: string, startDate: string, endDate: string }>,
 *   loading: boolean,
 *   error: string | null,
 *   refetch: () => void
 * }}
 */
export function useCurrencies() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [triggerCount, setTriggerCount] = useState(0);

  const refetch = useCallback(() => {
    setTriggerCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function loadCurrencies() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchCurrencies(controller.signal);
        if (isMounted) {
          setCurrencies(data);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) {
          setError(err.message || 'Falha ao carregar lista de moedas.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCurrencies();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [triggerCount]);

  return { currencies, loading, error, refetch };
}
