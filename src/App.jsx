import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currencies, setCurrencies] = useState([
    { name: 'bitcoin', value: '', rateToUSD: 1, rateToETH: 1 },
    { name: 'ethereum', value: '', rateToUSD: 1, rateToBTC: 1 },
    { name: 'usd', value: '', rateToBTC: 1, rateToETH: 1 }
  ]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        const data = await response.json();
        setCurrencies([
          { name: 'bitcoin', value: currencies[0].value, rateToUSD: data.bitcoin.usd, rateToETH: data.ethereum.usd / data.bitcoin.usd },
          { name: 'ethereum', value: currencies[1].value, rateToUSD: data.ethereum.usd, rateToBTC: data.bitcoin.usd / data.ethereum.usd },
          { name: 'usd', value: currencies[2].value, rateToBTC: 1 / data.bitcoin.usd, rateToETH: 1 / data.ethereum.usd }
        ]);
      } catch (error) {
        console.error('Error fetching rates:', error);
      }
    };
    fetchRates();
  }, []);

  const handleValueChange = (index, newValue) => {
    let newCurrencies = [...currencies];
    newCurrencies[index].value = newValue;

    if (index === 0) { 
      newCurrencies[1].value = (newValue * newCurrencies[0].rateToETH).toFixed(6); 
      newCurrencies[2].value = (newValue * newCurrencies[0].rateToUSD).toFixed(2); 
    } else if (index === 1) { 
      newCurrencies[0].value = (newValue * newCurrencies[1].rateToBTC).toFixed(6); 
      newCurrencies[2].value = (newValue * newCurrencies[1].rateToUSD).toFixed(2); 
    } else if (index === 2) { 
      newCurrencies[0].value = (newValue * newCurrencies[2].rateToBTC).toFixed(6); 
      newCurrencies[1].value = (newValue * newCurrencies[2].rateToETH).toFixed(6); 
    }

    setCurrencies(newCurrencies);
  };

  const title = "Crypto Converter";

  return (
    <div className="App">
      <h1>
        {title.split("").map((char, index) => (
          <span key={index} className="animated-letter" style={{ animationDelay: `${index * 0.1}s` }}>
            {char}
          </span>
        ))}
      </h1>
      {currencies.map((currency, index) => (
        <input
          key={currency.name}
          type="number"
          placeholder={`${currency.name.charAt(0).toUpperCase() + currency.name.slice(1)} amount`}
          value={currency.value}
          onChange={(e) => handleValueChange(index, e.target.value)}
        />
      ))}
    </div>
  );
}

export default App;