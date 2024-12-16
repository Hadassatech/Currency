require('dotenv').config(); // Load environment variables from .env file

const express = require('express'); 
const axios = require('axios'); 
const fs = require('fs'); 
const cors = require('cors'); 
const app = express();
const port = process.env.PORT || 5000;  // Use environment variable or default to 5000

app.use(cors()); 
app.use(express.json()); 
const xml2js = require('xml2js'); 

// Function to fetch and save data
const fetchAndSaveData = async () => {
  try {
    console.info("Fetching data from Bank of Israel...");

    const apiUrl = process.env.API_URL; // Get the API URL from the environment variable

    // Making a GET request to fetch currency data from Bank of Israel
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Node.js', // User-Agent header for the request
        'Accept': 'application/xml', // Accept XML response format from the API
      },
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch currency data: Status code ${response.status}`);
    }

    const xmlData = response.data;

    // Use xml2js to parse XML data into JSON
    const parser = new xml2js.Parser({ explicitArray: false });
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        throw new Error(`Failed to parse XML: ${err.message}`);
      }

      // Extract relevant data (e.g., dates and values)
      const observations = [];
      const series = result['message:StructureSpecificData']['message:DataSet']['Series'];
      const obsArray = series['Obs']; 
      obsArray.forEach((obs) => {
        observations.push({
          date: obs['$']['TIME_PERIOD'], 
          value: parseFloat(obs['$']['OBS_VALUE']), 
        });
      });

      // Save the extracted data to a JSON file
      const jsonFilePath = './currency-data.json';
      fs.writeFileSync(jsonFilePath, JSON.stringify(observations, null, 2), 'utf-8');

      console.info(`Data saved successfully to ${jsonFilePath}`);
    });
  } catch (error) {
    console.error('Error fetching data from Bank of Israel:', error.message);
  }
};

// Initial call to fetch and save data
fetchAndSaveData();

// Function to fetch data from Bank of Israel and log it
const fetchDataFromBankIsrael = async () => {
  try {
    console.info("Fetching data from Bank of Israel...");
  
    const apiUrl = process.env.API_URL; // Get the API URL from the environment variable
  
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Node.js',
        'Accept': 'application/json', 
      },
    });
  
    // Handle unsuccessful status code
    if (response.status !== 200) {
      throw new Error(`Failed to fetch currency data: Status code ${response.status}`);
    }
  
    // Print the full response data for debugging
    console.log("Response data from API:", JSON.stringify(response.data, null, 2));
  
  } catch (error) {
    console.error('Error fetching data from Bank of Israel:', error.message);
  }
};

// Initial call to fetch data from the Bank of Israel
fetchDataFromBankIsrael();

// Function to read data from a saved JSON file
const getDataFromJSON = () => {
  try {
    const rawData = fs.readFileSync('currencyRates.json'); 
    return JSON.parse(rawData); 
  } catch (error) {
    console.error('Error reading currencyRates.json:', error.message); 
    return [];
  }
};

// API route to get currency rates based on currency and period query parameters
app.get('/api/currency-rates', (req, res) => {
  const { currency, period } = req.query;
  
  // Validate query parameters
  if (!currency || !period) {
    return res.status(400).json({ error: 'Currency and period are required' });
  }

  const today = new Date();
  let startDate;

  // Determine start date based on the period
  switch (period) {
    case 'week':
      startDate = new Date(today.setDate(today.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(today.setMonth(today.getMonth() - 1));
      break;
    case 'half-year':
      startDate = new Date(today.setMonth(today.getMonth() - 6));
      break;
    case 'year':
      startDate = new Date(today.setFullYear(today.getFullYear() - 1));
      break;
    default:
      return res.status(400).json({ error: 'Invalid period' });
  }

  try {
    // Get data from JSON file
    const data = getDataFromJSON(); 
    const filteredData = data.filter(item => item.currency === currency && new Date(item.lastUpdate) >= startDate);
    res.json(filteredData); 
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    res.status(500).json({ error: 'Failed to fetch currency rates' }); 
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
