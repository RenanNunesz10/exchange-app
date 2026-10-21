/**
 * Converte uma entrada textual ou numérica em número de ponto flutuante,
 * aceitando tanto ponto quanto vírgula como separador decimal.
 *
 * @param {string|number} rawValue Valor bruto informado pelo usuário
 * @returns {number} Número convertido ou NaN se inválido
 */
export function parseNumericInput(rawValue) {
  if (typeof rawValue === 'number') {
    return rawValue;
  }

  if (typeof rawValue !== 'string') {
    return Number.NaN;
  }

  const trimmed = rawValue.trim().replace(',', '.');
  if (!trimmed) {
    return Number.NaN;
  }

  // Aceita apenas dígitos opcionais com um único ponto decimal
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number.NaN;
  }

  return Number(trimmed);
}

/**
 * Valida os dados de entrada do conversor de moedas de acordo com as regras de negócio:
 * - Moedas de origem e destino devem estar preenchidas
 * - Valor não pode ser vazio, texto inválido, zero ou negativo
 * - Sinaliza aviso caso as moedas selecionadas sejam idênticas
 *
 * @param {string|number} rawAmount Valor informado pelo usuário
 * @param {string} baseCurrency Moeda de origem (ex.: 'USD')
 * @param {string} targetCurrency Moeda de destino (ex.: 'BRL')
 * @returns {{ isValid: boolean, numericAmount: number | null, errorMessage: string | null, isSameCurrency: boolean }}
 */
export function validateConversionInput(rawAmount, baseCurrency, targetCurrency) {
  if (!baseCurrency || !targetCurrency) {
    return {
      isValid: false,
      numericAmount: null,
      errorMessage: 'Selecione as moedas de origem e de destino.',
      isSameCurrency: false,
    };
  }

  const rawString = String(rawAmount ?? '').trim();
  if (rawString === '') {
    return {
      isValid: false,
      numericAmount: null,
      errorMessage: 'Informe um valor numérico para realizar a conversão.',
      isSameCurrency: baseCurrency === targetCurrency,
    };
  }

  const numericAmount = parseNumericInput(rawString);

  if (Number.isNaN(numericAmount) || !Number.isFinite(numericAmount)) {
    return {
      isValid: false,
      numericAmount: null,
      errorMessage: 'Digite apenas números válidos (ex.: 100 ou 250.50).',
      isSameCurrency: baseCurrency === targetCurrency,
    };
  }

  if (numericAmount <= 0) {
    return {
      isValid: false,
      numericAmount: null,
      errorMessage: 'O valor para conversão deve ser maior que zero.',
      isSameCurrency: baseCurrency === targetCurrency,
    };
  }

  return {
    isValid: true,
    numericAmount,
    errorMessage: null,
    isSameCurrency: baseCurrency === targetCurrency,
  };
}

/**
 * Realiza o cálculo da conversão no front-end a partir da taxa obtida na API.
 * Fórmula: valorConvertido = valorEntrada * taxa
 *
 * @param {string|number} amount Valor na moeda de origem
 * @param {number} rate Taxa unitária de câmbio
 * @returns {number | null} Valor convertido ou null se inválido
 */
export function calculateConvertedAmount(amount, rate) {
  const numericAmount = parseNumericInput(amount);
  const numericRate = Number(rate);

  if (
    Number.isNaN(numericAmount) ||
    numericAmount <= 0 ||
    Number.isNaN(numericRate) ||
    numericRate <= 0
  ) {
    return null;
  }

  return Number((numericAmount * numericRate).toFixed(6));
}

/**
 * Calcula estatísticas descritivas do período histórico carregado:
 * cotação mínima, máxima, média e variação percentual entre o início e o fim do período.
 *
 * @param {Array<{ date: string, rate: number }>} records Lista de cotações históricas
 * @returns {{
 *   minRate: number,
 *   minDate: string,
 *   maxRate: number,
 *   maxDate: string,
 *   averageRate: number,
 *   firstRate: number,
 *   lastRate: number,
 *   absoluteChange: number,
 *   percentageChange: number,
 *   count: number
 * } | null}
 */
export function calculatePeriodStats(records) {
  if (!Array.isArray(records) || records.length === 0) {
    return null;
  }

  let minRecord = records[0];
  let maxRecord = records[0];
  let sum = 0;

  for (const record of records) {
    const currentRate = Number(record.rate);
    sum += currentRate;

    if (currentRate < minRecord.rate) {
      minRecord = record;
    }
    if (currentRate > maxRecord.rate) {
      maxRecord = record;
    }
  }

  const firstRate = Number(records[0].rate);
  const lastRate = Number(records[records.length - 1].rate);
  const averageRate = sum / records.length;
  const absoluteChange = lastRate - firstRate;
  const percentageChange = firstRate !== 0 ? (absoluteChange / firstRate) * 100 : 0;

  return {
    minRate: minRecord.rate,
    minDate: minRecord.date,
    maxRate: maxRecord.rate,
    maxDate: maxRecord.date,
    averageRate,
    firstRate,
    lastRate,
    absoluteChange,
    percentageChange,
    count: records.length,
  };
}

/**
 * Formata um valor monetário utilizando Intl.NumberFormat (pt-BR).
 *
 * @param {number} value Valor numérico
 * @param {string} [currencyCode] Código ISO 4217 da moeda (ex.: 'BRL', 'USD')
 * @returns {string}
 */
export function formatCurrencyValue(value, currencyCode) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }

  try {
    if (currencyCode) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    }
  } catch {
    // Fallback caso o código ISO não seja reconhecido pelo navegador
  }

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata uma taxa cambial com precisão configurável (padrão: 4 casas decimais).
 *
 * @param {number} rate Taxa cambial
 * @param {number} [decimals=4] Quantidade de casas decimais
 * @returns {string}
 */
export function formatExchangeRate(rate, decimals = 4) {
  const numericRate = Number(rate);
  if (Number.isNaN(numericRate)) {
    return '—';
  }

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numericRate);
}
