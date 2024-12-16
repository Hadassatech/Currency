import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CurrencyChart = ({ currencyRates, labels }) => {
  // Preparing chart data from the currency rates and labels
  const chartData = currencyRates.map((item, index) => ({
    date: labels[index],
    rate: item.rate,
  }));

  return (
    <div className="recharts-wrapper">
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="rate" stroke="#2980b9" /> {/* line for rates */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CurrencyChart;
