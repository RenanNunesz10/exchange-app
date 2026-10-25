import React, { useState } from 'react';
import {
  DEFAULT_BASE_CURRENCY,
  DEFAULT_TARGET_CURRENCY,
  DEFAULT_AMOUNT,
  DEFAULT_PERIOD,
  HISTORICAL_PERIODS,
} from './constants/periods.js';
import { useCurrencies } from './hooks/useCurrencies.js';
import { useExchangeRate } from './hooks/useExchangeRate.js';
import { useHistoricalRates } from './hooks/useHistoricalRates.js';
import { Header } from './components/Header/Header.jsx';
import { CurrencyConverter } from './components/CurrencyConverter/CurrencyConverter.jsx';
import { PeriodSelector } from './components/PeriodSelector/PeriodSelector.jsx';
import { StatsSummary } from './components/StatsSummary/StatsSummary.jsx';
import { HistoryChart } from './components/HistoryChart/HistoryChart.jsx';
import { RatesTable } from './components/RatesTable/RatesTable.jsx';
import { Footer } from './components/Footer/Footer.jsx';
import { formatIsoDateToBR } from './utils/dateUtils.js';
import styles from './App.module.css';

export function App() {
  // Estado compartilhado (Lifting State Up)
  const [baseCurrency, setBaseCurrency] = useState(DEFAULT_BASE_CURRENCY);
  const [targetCurrency, setTargetCurrency] = useState(DEFAULT_TARGET_CURRENCY);
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [selectedPeriod, setSelectedPeriod] = useState(DEFAULT_PERIOD);

  // Custom Hooks para consumo da API Frankfurter v2
  const {
    currencies,
    loading: currenciesLoading,
    error: currenciesError,
    refetch: refetchCurrencies,
  } = useCurrencies();

  const {
    rateData,
    loading: rateLoading,
    error: rateError,
    refetch: refetchRate,
  } = useExchangeRate(baseCurrency, targetCurrency);

  const {
    records: historicalRecords,
    loading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useHistoricalRates(baseCurrency, targetCurrency, selectedPeriod);

  // Inversão do par de moedas
  const handleSwapCurrencies = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
  };

  // Rótulo do período ativo
  const activePeriodObj = HISTORICAL_PERIODS.find((p) => p.id === selectedPeriod);
  const periodLabel = activePeriodObj ? activePeriodObj.label : selectedPeriod;

  return (
    <div className={styles.appLayout}>
      {/* Cabeçalho */}
      <Header
        lastUpdated={rateData?.date ? formatIsoDateToBR(rateData.date) : undefined}
      />

      <main className={styles.mainContent}>
        {/* Conversor de Moedas */}
        <CurrencyConverter
          currencies={currencies}
          baseCurrency={baseCurrency}
          targetCurrency={targetCurrency}
          amount={amount}
          rateData={rateData}
          loading={rateLoading || currenciesLoading}
          error={rateError || currenciesError}
          onBaseChange={setBaseCurrency}
          onTargetChange={setTargetCurrency}
          onAmountChange={setAmount}
          onSwapCurrencies={handleSwapCurrencies}
          onRetry={() => {
            refetchCurrencies();
            refetchRate();
          }}
        />

        {/* Barra de Seleção de Período Histórico */}
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
          disabled={historyLoading}
        />

        {/* Resumo Estatístico do Período */}
        <StatsSummary
          records={historicalRecords}
          baseCurrency={baseCurrency}
          targetCurrency={targetCurrency}
          loading={historyLoading}
        />

        {/* Gráfico Histórico */}
        <HistoryChart
          records={historicalRecords}
          baseCurrency={baseCurrency}
          targetCurrency={targetCurrency}
          selectedPeriod={selectedPeriod}
          periodLabel={periodLabel}
          loading={historyLoading}
          error={historyError}
          onRetry={refetchHistory}
        />

        {/* Tabela de Dados Históricos, Filtros e Exportação CSV */}
        <RatesTable
          records={historicalRecords}
          baseCurrency={baseCurrency}
          targetCurrency={targetCurrency}
          selectedPeriod={selectedPeriod}
          loading={historyLoading}
          error={historyError}
          onRetry={refetchHistory}
        />
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}

export default App;
