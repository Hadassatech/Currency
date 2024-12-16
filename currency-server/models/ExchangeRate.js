const mongoose = require('mongoose');

const exchangeRateSchema = new mongoose.Schema({
  currency: String,
  rate: Number,
  date: Date,
});

const ExchangeRate = mongoose.model('ExchangeRate', exchangeRateSchema);
module.exports = ExchangeRate;
