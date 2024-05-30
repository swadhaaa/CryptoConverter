import React, { useState, useEffect } from 'react';
import './App.css';
import currenciesConfig from './currenciesConfig';  

function App() {
  const [currencies, setCurrencies] = useState(currenciesConfig.map(currency => ({
    ...currency,
    value: '',
    rateToUSD: 1  
  })));
  const [fastestAPI, setFastestAPI] = useState({ name: '', time: Infinity });

  useEffect(() => {
    const urls = [
      { url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd', name: 'CoinGecko' },
      { url: 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD', name: 'CryptoCompare' }
    ];

    const fetchStartTime = Date.now();

    Promise.all(urls.map(entry =>
      fetch(entry.url)
        .then(resp => resp.json())
        .then(data => {
          const timeTaken = Date.now() - fetchStartTime;
          return {
            name: entry.name,
            data: data,
            time: timeTaken
          };
        })
    ))
    .then(results => {
      const fastest = results.sort((a, b) => a.time - b.time)[0];
      setFastestAPI({ name: fastest.name, time: fastest.time });

      const ratesData = fastest.data;
      setCurrencies(currencies.map(currency => {
        return {
          ...currency,
          rateToUSD: ratesData[currency.name.toLowerCase()] ? ratesData[currency.name.toLowerCase()].usd : 1 
        };
      }));
    })
    .catch(error => {
      console.error('Error fetching rates:', error);
    });
  }, []);

  const handleValueChange = (index, newValue) => {
    let newCurrencies = [...currencies];
    if (newValue === "") {
      newCurrencies = newCurrencies.map(currency => ({ ...currency, value: '' }));
    } else {
      newCurrencies[index].value = newValue;
      newCurrencies = newCurrencies.map((currency, idx) => {
        if (idx !== index) {
          const baseCurrency = currencies[index];
          const targetCurrency = currencies[idx];
          const convertedValue = (newValue * baseCurrency.rateToUSD) / targetCurrency.rateToUSD;
          return { ...currency, value: convertedValue.toFixed(6) };
        }
        return currency;
      });
    }
    setCurrencies(newCurrencies);
  };

  return (
    <div className="App">
      <h1>Crypto Converter</h1>
      {fastestAPI.name && (
        <p className="api-speed-info">Fastest API: {fastestAPI.name} (Response Time: {fastestAPI.time}ms)</p>
      )}
      {currencies.map((currency, index) => (
        <div className="input-group">
          <label>{currency.name.charAt(0).toUpperCase() + currency.name.slice(1)}</label>
          <input
            key={currency.name}
            type="number"
            placeholder={`Enter amount in ${currency.name}`}
            value={currency.value}
            onChange={(e) => handleValueChange(index, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default App;