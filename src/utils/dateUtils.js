import { HISTORICAL_PERIODS, DEFAULT_PERIOD } from '../constants/periods';

/**
 * Converte um objeto Date para string no formato ISO de data (YYYY-MM-DD).
 * Utiliza os métodos locais com padStart para evitar deslocamentos de fuso horário.
 *
 * @param {Date} date Objeto Date válido
 * @returns {string} Data formatada como YYYY-MM-DD
 */
export function formatDateToISO(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error('Data inválida fornecida para formatDateToISO.');
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Calcula o intervalo de datas { from, to } (em formato YYYY-MM-DD)
 * para um determinado período histórico ('7d', '15d', '30d', '3m', '6m', '1y', '5y', '10y').
 *
 * @param {string} periodId Identificador do período (ex.: '30d', '1y')
 * @param {Date} [referenceDate=new Date()] Data final de referência (padrão: hoje)
 * @returns {{ from: string, to: string, period: object }}
 */
export function getPeriodDateRange(periodId = DEFAULT_PERIOD, referenceDate = new Date()) {
  const period =
    HISTORICAL_PERIODS.find((item) => item.id === periodId) ||
    HISTORICAL_PERIODS.find((item) => item.id === DEFAULT_PERIOD);

  const endDate = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );
  const startDate = new Date(endDate);

  if (period.unit === 'days') {
    startDate.setDate(startDate.getDate() - period.value);
  } else if (period.unit === 'months') {
    startDate.setMonth(startDate.getMonth() - period.value);
  } else if (period.unit === 'years') {
    startDate.setFullYear(startDate.getFullYear() - period.value);
  }

  return {
    from: formatDateToISO(startDate),
    to: formatDateToISO(endDate),
    period,
  };
}

/**
 * Formata uma string ISO (YYYY-MM-DD) para o padrão brasileiro (DD/MM/AAAA)
 * sem sofrer alterações de fuso horário.
 *
 * @param {string} isoDate String no formato YYYY-MM-DD
 * @returns {string} Data no formato DD/MM/AAAA
 */
export function formatIsoDateToBR(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') {
    return '—';
  }

  const parts = isoDate.split('-');
  if (parts.length !== 3) {
    return isoDate;
  }

  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

/**
 * Formata uma data ISO (YYYY-MM-DD) de forma compacta para o eixo X do gráfico:
 * - Períodos longos ('5y', '10y', '1y'): retorna DD/MM/AA
 * - Períodos curtos ('7d', '15d', '30d', '3m', '6m'): retorna DD/MM
 *
 * @param {string} isoDate String no formato YYYY-MM-DD
 * @param {string} [periodId='30d'] Identificador do período ativo
 * @returns {string} Data curta formatada
 */
export function formatIsoDateForChart(isoDate, periodId = '30d') {
  if (!isoDate || typeof isoDate !== 'string') {
    return '';
  }

  const parts = isoDate.split('-');
  if (parts.length !== 3) {
    return isoDate;
  }

  const [year, month, day] = parts;
  const isLongPeriod = ['1y', '5y', '10y'].includes(periodId);

  if (isLongPeriod) {
    return `${day}/${month}/${year.slice(-2)}`;
  }

  return `${day}/${month}`;
}
