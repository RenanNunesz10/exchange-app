import { CURRENCY_NAMES_PT } from '../constants/periods';
import { formatDateToISO } from '../utils/dateUtils';

const API_BASE_URL = 'https://api.frankfurter.dev/v2';

/**
 * Função auxiliar que executa uma requisição GET com fetch + async/await
 * e realiza o tratamento padronizado de erros HTTP e de rede.
 *
 * @param {string} endpoint Caminho relativo na API Frankfurter v2
 * @param {AbortSignal} [signal] Sinal opcional para cancelamento de requisição
 * @returns {Promise<any>} Dados JSON convertidos
 */
async function requestJson(endpoint, signal) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });
  } catch (networkError) {
    if (networkError.name === 'AbortError') {
      throw networkError;
    }
    throw new Error(
      'Não foi possível conectar à API Frankfurter. Verifique sua conexão com a internet e tente novamente.'
    );
  }

  if (!response.ok) {
    let apiMessage = '';
    try {
      const errorBody = await response.json();
      apiMessage = errorBody?.message ? ` (${errorBody.message})` : '';
    } catch {
      // Ignora erro caso o corpo não seja JSON válido
    }

    throw new Error(
      `Falha ao consultar a API Frankfurter [HTTP ${response.status}]${apiMessage}.`
    );
  }

  return response.json();
}

/**
 * Busca a lista de todas as moedas disponíveis na API Frankfurter v2.
 * Endpoint: GET /v2/currencies
 *
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<{ code: string, name: string, label: string, symbol: string, startDate: string, endDate: string }>>}
 */
export async function fetchCurrencies(signal) {
  const data = await requestJson('/currencies', signal);

  if (!Array.isArray(data)) {
    throw new Error('Formato inesperado ao carregar a lista de moedas.');
  }

  return data
    .map((item) => {
      const code = item.iso_code;
      const localizedName = CURRENCY_NAMES_PT[code] || item.name;
      return {
        code,
        name: localizedName,
        originalName: item.name,
        symbol: item.symbol || code,
        label: `${code} — ${localizedName}`,
        startDate: item.start_date,
        endDate: item.end_date,
      };
    })
    .sort((a, b) => a.code.localeCompare(b.code));
}

/**
 * Busca a cotação unitária mais recente entre duas moedas.
 * Endpoint: GET /v2/rate/{base}/{quote}
 *
 * @param {string} base Código ISO da moeda de origem (ex.: 'USD')
 * @param {string} quote Código ISO da moeda de destino (ex.: 'BRL')
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ date: string, base: string, quote: string, rate: number }>}
 */
export async function fetchExchangeRate(base, quote, signal) {
  const normalizedBase = String(base || '').trim().toUpperCase();
  const normalizedQuote = String(quote || '').trim().toUpperCase();

  if (!normalizedBase || !normalizedQuote) {
    throw new Error('Selecione as moedas de origem e de destino para consultar a cotação.');
  }

  if (normalizedBase === normalizedQuote) {
    return {
      date: formatDateToISO(new Date()),
      base: normalizedBase,
      quote: normalizedQuote,
      rate: 1,
    };
  }

  const data = await requestJson(
    `/rate/${encodeURIComponent(normalizedBase)}/${encodeURIComponent(normalizedQuote)}`,
    signal
  );

  if (!data || typeof data.rate !== 'number') {
    throw new Error('A API não retornou uma taxa de câmbio válida para o par selecionado.');
  }

  return {
    date: data.date,
    base: data.base || normalizedBase,
    quote: data.quote || normalizedQuote,
    rate: Number(data.rate),
  };
}

/**
 * Busca a série histórica de cotações de um par de moedas em um intervalo de datas.
 * Endpoint: GET /v2/rates?from=YYYY-MM-DD&to=YYYY-MM-DD&base={base}&quotes={quote}
 *
 * @param {{ base: string, quote: string, from: string, to: string, signal?: AbortSignal }} params
 * @returns {Promise<Array<{ date: string, base: string, quote: string, rate: number }>>}
 */
export async function fetchHistoricalRates({ base, quote, from, to, signal }) {
  const normalizedBase = String(base || '').trim().toUpperCase();
  const normalizedQuote = String(quote || '').trim().toUpperCase();

  if (!normalizedBase || !normalizedQuote) {
    throw new Error('Par de moedas inválido para consulta histórica.');
  }

  if (!from || !to) {
    throw new Error('Intervalo de datas obrigatório para consulta histórica.');
  }

  if (normalizedBase === normalizedQuote) {
    return [
      {
        date: to,
        base: normalizedBase,
        quote: normalizedQuote,
        rate: 1,
      },
    ];
  }

  const queryParams = new URLSearchParams({
    from,
    to,
    base: normalizedBase,
    quotes: normalizedQuote,
  });

  const data = await requestJson(`/rates?${queryParams.toString()}`, signal);

  if (!Array.isArray(data)) {
    throw new Error('Formato inesperado ao carregar o histórico de cotações.');
  }

  return data.map((entry) => ({
    date: entry.date,
    base: entry.base || normalizedBase,
    quote: entry.quote || normalizedQuote,
    rate: Number(entry.rate),
  }));
}
