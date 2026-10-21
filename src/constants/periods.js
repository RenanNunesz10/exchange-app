/**
 * Períodos históricos obrigatórios definidos no escopo do projeto.
 * Cada item possui:
 * - id: identificador único usado no estado da aplicação
 * - label: texto completo exibido em títulos e tooltips
 * - shortLabel: rótulo compacto para botões seletores
 * - value: quantidade a subtrair da data de referência
 * - unit: unidade de tempo ('days' | 'months' | 'years')
 */
export const HISTORICAL_PERIODS = [
  { id: '7d', label: '7 dias', shortLabel: '7D', value: 7, unit: 'days' },
  { id: '15d', label: '15 dias', shortLabel: '15D', value: 15, unit: 'days' },
  { id: '30d', label: '30 dias', shortLabel: '30D', value: 30, unit: 'days' },
  { id: '3m', label: '3 meses', shortLabel: '3M', value: 3, unit: 'months' },
  { id: '6m', label: '6 meses', shortLabel: '6M', value: 6, unit: 'months' },
  { id: '1y', label: '1 ano', shortLabel: '1A', value: 1, unit: 'years' },
  { id: '5y', label: '5 anos', shortLabel: '5A', value: 5, unit: 'years' },
  { id: '10y', label: '10 anos', shortLabel: '10A', value: 10, unit: 'years' },
];

export const DEFAULT_BASE_CURRENCY = 'USD';
export const DEFAULT_TARGET_CURRENCY = 'BRL';
export const DEFAULT_AMOUNT = '100';
export const DEFAULT_PERIOD = '30d';

/**
 * Traduções amigáveis em português para as moedas mais negociadas,
 * complementando os nomes oficiais em inglês vindos da API Frankfurter.
 */
export const CURRENCY_NAMES_PT = {
  AUD: 'Dólar Australiano',
  BRL: 'Real Brasileiro',
  CAD: 'Dólar Canadense',
  CHF: 'Franco Suíço',
  CNY: 'Yuan Chinês',
  CZK: 'Coroa Tcheca',
  DKK: 'Coroa Dinamarquesa',
  EUR: 'Euro',
  GBP: 'Libra Esterlina',
  HKD: 'Dólar de Hong Kong',
  HUF: 'Forint Húngaro',
  IDR: 'Rupia Indonésia',
  ILS: 'Novo Shekel Israelense',
  INR: 'Rupia Indiana',
  ISK: 'Coroa Islandesa',
  JPY: 'Iene Japonês',
  KRW: 'Won Sul-Coreano',
  MXN: 'Peso Mexicano',
  MYR: 'Ringgit Malaio',
  NOK: 'Coroa Norueguesa',
  NZD: 'Dólar Neozelandês',
  PHP: 'Peso Filipino',
  PLN: 'Zloty Polonês',
  RON: 'Leu Romeno',
  SEK: 'Coroa Sueca',
  SGD: 'Dólar de Singapura',
  THB: 'Baht Tailandês',
  TRY: 'Lira Turca',
  USD: 'Dólar Americano',
  ZAR: 'Rand Sul-Africano',
  ARS: 'Peso Argentino',
  CLP: 'Peso Chileno',
  COP: 'Peso Colombiano',
};
