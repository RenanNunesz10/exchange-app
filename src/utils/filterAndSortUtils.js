import { parseNumericInput } from './currencyUtils.js';

export const INITIAL_TABLE_FILTERS = {
  startDate: '',
  endDate: '',
  minRate: '',
  maxRate: '',
};

/**
 * Verifica se há ao menos um filtro preenchido na tabela.
 *
 * @param {{ startDate: string, endDate: string, minRate: string, maxRate: string }} filters
 * @returns {boolean}
 */
export function hasActiveTableFilters(filters) {
  if (!filters) return false;
  return Boolean(
    String(filters.startDate || '').trim() ||
      String(filters.endDate || '').trim() ||
      String(filters.minRate ?? '').trim() ||
      String(filters.maxRate ?? '').trim()
  );
}

/**
 * Valida a consistência lógica dos filtros aplicados na tabela:
 * - Data inicial não pode ser maior que data final
 * - Cotação mínima e máxima devem ser números positivos válidos
 * - Cotação mínima não pode ser maior que cotação máxima
 *
 * @param {{ startDate: string, endDate: string, minRate: string, maxRate: string }} filters
 * @returns {{ isValid: boolean, errorMessage: string | null }}
 */
export function validateTableFilters(filters) {
  if (!filters) {
    return { isValid: true, errorMessage: null };
  }

  const { startDate, endDate, minRate, maxRate } = filters;

  if (startDate && endDate && startDate > endDate) {
    return {
      isValid: false,
      errorMessage: 'A data inicial não pode ser posterior à data final.',
    };
  }

  const hasMin = String(minRate ?? '').trim() !== '';
  const hasMax = String(maxRate ?? '').trim() !== '';

  const parsedMin = hasMin ? parseNumericInput(minRate) : null;
  const parsedMax = hasMax ? parseNumericInput(maxRate) : null;

  if (hasMin && (Number.isNaN(parsedMin) || parsedMin < 0)) {
    return {
      isValid: false,
      errorMessage: 'Informe um valor numérico válido para a cotação mínima.',
    };
  }

  if (hasMax && (Number.isNaN(parsedMax) || parsedMax < 0)) {
    return {
      isValid: false,
      errorMessage: 'Informe um valor numérico válido para a cotação máxima.',
    };
  }

  if (hasMin && hasMax && parsedMin > parsedMax) {
    return {
      isValid: false,
      errorMessage: 'A cotação mínima não pode ser maior que a cotação máxima.',
    };
  }

  return { isValid: true, errorMessage: null };
}

/**
 * Filtra os registros históricos combinando:
 * - intervalo de datas (startDate e/ou endDate)
 * - faixa de cotação (minRate e/ou maxRate)
 *
 * @param {Array<{ date: string, base: string, quote: string, rate: number }>} records
 * @param {{ startDate: string, endDate: string, minRate: string, maxRate: string }} filters
 * @returns {Array<{ date: string, base: string, quote: string, rate: number }>}
 */
export function filterRateRecords(records, filters = INITIAL_TABLE_FILTERS) {
  if (!Array.isArray(records) || records.length === 0) {
    return [];
  }

  const validation = validateTableFilters(filters);
  if (!validation.isValid) {
    return [];
  }

  const startDate = String(filters?.startDate || '').trim();
  const endDate = String(filters?.endDate || '').trim();
  const rawMinRate = String(filters?.minRate ?? '').trim();
  const rawMaxRate = String(filters?.maxRate ?? '').trim();

  const minRate = rawMinRate !== '' ? parseNumericInput(rawMinRate) : null;
  const maxRate = rawMaxRate !== '' ? parseNumericInput(rawMaxRate) : null;

  return records.filter((item) => {
    if (startDate && item.date < startDate) {
      return false;
    }

    if (endDate && item.date > endDate) {
      return false;
    }

    if (minRate !== null && !Number.isNaN(minRate) && item.rate < minRate) {
      return false;
    }

    if (maxRate !== null && !Number.isNaN(maxRate) && item.rate > maxRate) {
      return false;
    }

    return true;
  });
}

/**
 * Ordena uma lista de registros de cotação por 'date' ou 'rate'
 * em direção 'asc' (crescente) ou 'desc' (decrescente), sem mutar o array original.
 *
 * @param {Array<{ date: string, base: string, quote: string, rate: number }>} records
 * @param {{ field: 'date' | 'rate', direction: 'asc' | 'desc' }} sortConfig
 * @returns {Array<{ date: string, base: string, quote: string, rate: number }>}
 */
export function sortRateRecords(
  records,
  sortConfig = { field: 'date', direction: 'desc' }
) {
  if (!Array.isArray(records) || records.length === 0) {
    return [];
  }

  const field = sortConfig?.field === 'rate' ? 'rate' : 'date';
  const direction = sortConfig?.direction === 'asc' ? 'asc' : 'desc';
  const multiplier = direction === 'asc' ? 1 : -1;

  return [...records].sort((a, b) => {
    if (field === 'rate') {
      const diff = Number(a.rate) - Number(b.rate);
      if (diff !== 0) {
        return diff * multiplier;
      }
      // Desempate por data
      return a.date.localeCompare(b.date) * multiplier;
    }

    return a.date.localeCompare(b.date) * multiplier;
  });
}
