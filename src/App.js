import React, { useState, useEffect } from "react";
import axios from "axios";
import { isYomTov, isShabbat } from "jewish-holidays";
import CurrencySelector from "./components/CurrencySelector";
import CurrencyChart from "./components/CurrencyChart";
import './App.css'; 

const App = () => {
  const [currencyRates, setCurrencyRates] = useState([]); 
  const [labels, setLabels] = useState([]); 
  const [selectedCurrency, setSelectedCurrency] = useState("USD"); 
  const [selectedPeriod, setSelectedPeriod] = useState("week"); 

  // Filtering out holidays and weekends from the data
  const filterHolidaysAndWeekends = (data) => {
    return data.filter((item) => {
      const date = new Date(item.lastUpdate);
      const isHoliday = isYomTov(date, true); 
      const isWeekend = isShabbat(date); 
      return !isHoliday && !isWeekend; 
    });
  };

  // Function to get the date range based on the selected period
  const getDateRange = (period) => {
    const today = new Date();
    let startDate;
    switch (period) {
      case "week":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7); 
        break;
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()); // one month ago
        break;
      case "half-year":
        startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()); 
        break;
      case "year":
        startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()); 
        break;
      default:
        startDate = new Date(today);
    }
    return startDate;
  };

  // Grouping the data by the selected period (week, month, year)
  const groupDataByPeriod = (data, period) => {
    const startDate = getDateRange(period);
    const groupedData = [];
    const labels = [];

    data.forEach((item) => {
      const date = new Date(item.lastUpdate);
      if (date >= startDate) { 
        let periodKey;
        switch (period) {
          case "week":
            periodKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; 
            break;
          case "month":
            periodKey = `${date.getFullYear()}-${date.getMonth() + 1}`; 
            break;
          case "half-year":
            periodKey = `${date.getMonth() + 1}`; // grouping by half-year
            break;
          case "year":
            periodKey = `${date.getFullYear()}`; // grouping by year
            break;
          default:
            periodKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }
        if (!groupedData.find((entry) => entry.date === periodKey)) { 
          groupedData.push({ date: periodKey, rate: item.rate });
          labels.push(periodKey);
        }
      }
    });

    return { groupedData, labels };
  };

  // Fetching the data from the API
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/currency-rates?currency=${selectedCurrency}&period=${selectedPeriod}`
        );
        const filteredData = filterHolidaysAndWeekends(response.data); // apply filters
        const { groupedData, labels } = groupDataByPeriod(filteredData, selectedPeriod); // group data
        setCurrencyRates(groupedData);
        setLabels(labels);
      } catch (error) {
        console.error("Error fetching data:", error); 
      }
    };

    fetchRates();
  }, [selectedCurrency, selectedPeriod]); 

  // Handle changes in currency selection
  const handleCurrencyChange = (event) => setSelectedCurrency(event.target.value);

  // Handle changes in period selection
  const handlePeriodChange = (event) => setSelectedPeriod(event.target.value);

  return (
    <div className="app-container">
      <h1>Currency Exchange Rates</h1>
      <div className="currency-selector">
        <CurrencySelector
          selectedCurrency={selectedCurrency}
          selectedPeriod={selectedPeriod}
          handleCurrencyChange={handleCurrencyChange}
          handlePeriodChange={handlePeriodChange}
        />
      </div>
      <CurrencyChart currencyRates={currencyRates} labels={labels} />
    </div>
  );
};

export default App;
