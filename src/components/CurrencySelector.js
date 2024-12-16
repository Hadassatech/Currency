import React from 'react';

const CurrencySelector = ({ selectedCurrency, selectedPeriod, handleCurrencyChange, handlePeriodChange }) => {
  return (
    <div className="selector-container">
      <div>
        <label htmlFor="currency">Select Currency: </label>
        <select id="currency" value={selectedCurrency} onChange={handleCurrencyChange}>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
          <option value="SEK">SEK</option>
          <option value="CHF">CHF</option>
        </select>
      </div>

      <div>
        <label htmlFor="period">Select Period: </label>
        <select id="period" value={selectedPeriod} onChange={handlePeriodChange}>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="half-year">Half Year</option>
          <option value="year">Year</option>
        </select>
      </div>
    </div>
  );
};

export default CurrencySelector;
