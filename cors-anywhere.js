const express = require('express');
const axios = require('axios');

const app = express();
const port = 5000;

app.get('/currencydata', async (req, res) => {
  try {
    const response = await axios.get('https://www.boi.org.il/currencydata');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
