import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [bitcoin, setBitcoin] = useState('');
  const [ethereum, setEthereum] = useState('');
  const [usd, setUsd] = useState('');
  const [rates, setRates] = useState({ btcToUsd: 0, ethToUsd: 0, ethToBtc: 0 });

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd')
      .then(response => response.json())
      .then(data => {
        const btcToUsd = data.bitcoin.usd;
        const ethToUsd = data.ethereum.usd;
        const ethToBtc = ethToUsd / btcToUsd;
        setRates({ btcToUsd, ethToUsd, ethToBtc });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleBitcoinChange = (value) => {
    setBitcoin(value);
    setEthereum((value * rates.ethToBtc).toFixed(6));
    setUsd((value * rates.btcToUsd).toFixed(2));
  };

  const handleEthereumChange = (value) => {
    setEthereum(value);
    setBitcoin((value / rates.ethToBtc).toFixed(6));
    setUsd((value * rates.ethToUsd).toFixed(2));
  };

  const handleUsdChange = (value) => {
    setUsd(value);
    setBitcoin((value / rates.btcToUsd).toFixed(6));
    setEthereum((value / rates.ethToUsd).toFixed(6));
  };

  return (
    <div className="App">
      <h1>Crypto Converter</h1>
      <input
        type="number"
        placeholder="Bitcoin amount"
        value={bitcoin}
        onChange={(e) => handleBitcoinChange(e.target.value)}
      />
      <input
        type="number"
        placeholder="Ethereum amount"
        value={ethereum}
        onChange={(e) => handleEthereumChange(e.target.value)}
      />
      <input
        type="number"
        placeholder="USD amount"
        value={usd}
        onChange={(e) => handleUsdChange(e.target.value)}
      />
    </div>
  );
}

export default App;
