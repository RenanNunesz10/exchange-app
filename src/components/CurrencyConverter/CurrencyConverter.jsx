import React from 'react';
import { ArrowLeftRight, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  validateConversionInput,
  calculateConvertedAmount,
  formatCurrencyValue,
  formatExchangeRate,
} from '../../utils/currencyUtils.js';
import { formatIsoDateToBR } from '../../utils/dateUtils.js';
import { FeedbackState } from '../FeedbackState/FeedbackState.jsx';
import styles from './CurrencyConverter.module.css';

/**
 * Componente do Conversor de Moedas.
 *
 * @param {{
 *   currencies: Array<{ code: string, name: string, label: string, symbol: string }>,
 *   baseCurrency: string,
 *   targetCurrency: string,
 *   amount: string,
 *   rateData: { date: string, base: string, quote: string, rate: number } | null,
 *   loading: boolean,
 *   error: string | null,
 *   onBaseChange: (code: string) => void,
 *   onTargetChange: (code: string) => void,
 *   onAmountChange: (value: string) => void,
 *   onSwapCurrencies: () => void,
 *   onRetry: () => void
 * }} props
 */
export function CurrencyConverter({
  currencies = [],
  baseCurrency,
  targetCurrency,
  amount,
  rateData,
  loading,
  error,
  onBaseChange,
  onTargetChange,
  onAmountChange,
  onSwapCurrencies,
  onRetry,
}) {
  const validation = validateConversionInput(amount, baseCurrency, targetCurrency);
  const isInputValid = validation.isValid;
  const convertedValue = isInputValid && rateData ? calculateConvertedAmount(amount, rateData.rate) : null;

  return (
    <section className={styles.card} aria-label="Conversor de Moedas">
      <header className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Conversor de Moedas</h2>
          <p className={styles.cardSubtitle}>
            Consulte a cotação em tempo real e realize a conversão direta
          </p>
        </div>
      </header>

      <div className={styles.formGrid}>
        {/* Campo de Valor */}
        <div className={styles.inputGroup}>
          <label htmlFor="currency-amount" className={styles.label}>
            Valor a converter
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="currency-amount"
              type="text"
              inputMode="decimal"
              className={`${styles.input} ${!isInputValid && amount !== '' ? styles.inputInvalid : ''}`}
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="Ex: 100.00"
              autoComplete="off"
            />
            <span className={styles.inputBadge}>{baseCurrency}</span>
          </div>
        </div>

        {/* Seleção de Moeda de Origem */}
        <div className={styles.inputGroup}>
          <label htmlFor="base-currency" className={styles.label}>
            Moeda de origem (De)
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="base-currency"
              className={styles.select}
              value={baseCurrency}
              onChange={(e) => onBaseChange(e.target.value)}
            >
              {currencies.map((curr) => (
                <option key={`base-${curr.code}`} value={curr.code}>
                  {curr.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botão de Inversão */}
        <div className={styles.swapWrapper}>
          <button
            type="button"
            className={styles.swapButton}
            onClick={onSwapCurrencies}
            title="Inverter moedas de origem e destino"
            aria-label="Inverter moedas"
          >
            <ArrowLeftRight size={18} />
          </button>
        </div>

        {/* Seleção de Moeda de Destino */}
        <div className={styles.inputGroup}>
          <label htmlFor="target-currency" className={styles.label}>
            Moeda de destino (Para)
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="target-currency"
              className={styles.select}
              value={targetCurrency}
              onChange={(e) => onTargetChange(e.target.value)}
            >
              {currencies.map((curr) => (
                <option key={`target-${curr.code}`} value={curr.code}>
                  {curr.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alerta de Validação de Entrada */}
      {!isInputValid && validation.errorMessage && (
        <div className={styles.validationAlert} role="alert">
          <AlertTriangle size={16} />
          <span>{validation.errorMessage}</span>
        </div>
      )}

      {/* Aviso de mesma moeda */}
      {validation.isSameCurrency && (
        <div className={styles.warningAlert} role="status">
          <AlertTriangle size={16} />
          <span>Você selecionou a mesma moeda para origem e destino (taxa 1:1).</span>
        </div>
      )}

      {/* Área de Resultado ou Estados de Feedback */}
      <div className={styles.resultArea}>
        {loading ? (
          <FeedbackState
            type="loading"
            title="Obtendo cotação mais recente..."
            message="Consultando a taxa de câmbio oficial na API Frankfurter."
          />
        ) : error ? (
          <FeedbackState
            type="error"
            title="Não foi possível obter a cotação"
            message={error}
            actionLabel="Recarregar cotação"
            onAction={onRetry}
          />
        ) : isInputValid && rateData ? (
          <div className={styles.conversionBox}>
            <div className={styles.convertedHeader}>
              <span className={styles.convertedLabel}>Resultado da Conversão:</span>
              <div className={styles.effectiveDate}>
                <Calendar size={14} />
                <span>Data efetiva da cotação: {formatIsoDateToBR(rateData.date)}</span>
              </div>
            </div>

            <div className={styles.convertedNumbers}>
              <span className={styles.originalAmount}>
                {formatCurrencyValue(validation.numericAmount, baseCurrency)} =
              </span>
              <span className={styles.convertedAmount}>
                {formatCurrencyValue(convertedValue, targetCurrency)}
              </span>
            </div>

            <div className={styles.rateDetail}>
              <TrendingUp size={16} className={styles.rateIcon} />
              <span>
                Taxa de referência utilizada: <strong>1 {baseCurrency} = {formatExchangeRate(rateData.rate)} {targetCurrency}</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.idleState}>
            <p>Informe um valor válido acima para visualizar a conversão detalhada.</p>
          </div>
        )}
      </div>
    </section>
  );
}
