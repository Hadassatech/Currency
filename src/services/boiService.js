import axios from "axios";

// קריאה לנתוני המטבעות מ-Bank of Israel
export const fetchCurrencyData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/currencydata');

    const currencies = parseXML(response.data);
    return currencies;
  } catch (error) {
    console.error("Error fetching currency data:", error);
    return [];
  }
};

// פענוח XML
const parseXML = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");
  const currencies = [];
  const supportedCurrencies = [
    "דולר ארצות הברית",
    "לירה בריטניה",
    "כתר שוודיה",
    "פרנק שוויץ",
  ];

  const items = xmlDoc.getElementsByTagName("CURRENCY");
  for (let i = 0; i < items.length; i++) {
    const name = items[i].getElementsByTagName("NAME")[0]?.textContent;
    const rate = items[i].getElementsByTagName("RATE")[0]?.textContent;
    if (supportedCurrencies.includes(name)) {
      currencies.push({ name, rate: parseFloat(rate) });
    }
  }
  return currencies;
};
