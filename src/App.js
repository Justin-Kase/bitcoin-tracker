import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChanges, setPriceChanges] = useState({});
  const [error, setError] = useState(null);

  // Fetch Bitcoin price and percentage changes
  const fetchBitcoinData = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart', {
        params: {
          vs_currency: 'usd',
          days: '5', // Fetch data for the last 5 years
        },
      });

      const prices = response.data.prices; // Array of price data
      const currentPrice = prices[prices.length - 1][1];
      setCurrentPrice(currentPrice);

      // Calculate percentage changes
      const calculateChange = (timeframe) => {
        const timeframeIndex = {
          '1 minute': 1,
          '5 minutes': 5,
          '30 minutes': 30,
          '24 hours': 24 * 60,
          '7 days': 7 * 24 * 60,
          '1 month': 30 * 24 * 60,
          '3 months': 90 * 24 * 60,
          '1 year': 365 * 24 * 60,
          '5 years': 5 * 365 * 24 * 60,
        }[timeframe];

        const oldPrice = prices[Math.max(0, prices.length - timeframeIndex)][1];
        return ((currentPrice - oldPrice) / oldPrice) * 100;
      };

      setPriceChanges({
        '1 minute': calculateChange('1 minute'),
        '5 minutes': calculateChange('5 minutes'),
        '30 minutes': calculateChange('30 minutes'),
        '24 hours': calculateChange('24 hours'),
        '7 days': calculateChange('7 days'),
        '1 month': calculateChange('1 month'),
        '3 months': calculateChange('3 months'),
        '1 year': calculateChange('1 year'),
        '5 years': calculateChange('5 years'),
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching Bitcoin data:', err);
      setError('Failed to fetch data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchBitcoinData();
    const interval = setInterval(fetchBitcoinData, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Bitcoin Price Tracker</h1>

      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="card">
            <div className="card-body text-center">
              <h2>Current Price: ${currentPrice ? currentPrice.toFixed(2) : 'Loading...'}</h2>
            </div>
          </div>

          <div className="mt-4">
            <h4>Percentage Changes:</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Timeframe</th>
                  <th>Change (%)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(priceChanges).map(([timeframe, change]) => (
                  <tr key={timeframe}>
                    <td>{timeframe}</td>
                    <td>{change ? change.toFixed(2) : 'Loading...'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
