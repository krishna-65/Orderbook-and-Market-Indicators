"use client";
import Orderbook from './OrderBook';
import SpreadIndicator from './SpreadIndicator';
import OrderbookImbalance from './OrderbookImbalance';
import MarketDepthChart from './MarketDepthChart';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const [selectedPair, setSelectedPair] = useState('BTCUSDT');
  const [loading, setLoading] = useState(false);

  const handlePairChange = (e) => {
    setSelectedPair(e.target.value);
  };

  useEffect(() => {
    // Reset loading state when switching pairs
    setLoading(true);
    const fetchData = async () => {
      // Simulate API call to update data when the trading pair changes
      await new Promise((resolve) => setTimeout(resolve, 500)); // Add a short delay
      setLoading(false);
    };

    fetchData();
  }, [selectedPair]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Real-Time Orderbook Visualization</h1>

      {/* Trading Pair Selector */}
      <div className="mb-6 text-center">
        <label className="mr-2 text-lg">Select Trading Pair:</label>
        <select
          value={selectedPair}
          onChange={handlePairChange}
          className="bg-gray-700 text-white p-2 rounded-md"
        >
          <option value="BTCUSDT">BTC-USD</option>
          <option value="ETHUSDT">ETH-USD</option>
          <option value="XRPUSDT">XRP-USD</option>
          {/* Add more trading pairs as needed */}
        </select>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-center text-xl text-gray-400">Loading data...</div>
      ) : (
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
          {/* Orderbook Component */}
          <div className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Orderbook (Top 10)</h2>
            <Orderbook selectedPair={selectedPair} />
          </div>

          {/* Spread Indicator */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Spread Indicator</h2>
            <SpreadIndicator selectedPair={selectedPair} />
          </div>

          {/* Market Depth Chart */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Market Depth Chart</h2>
            <MarketDepthChart selectedPair={selectedPair} />
          </div>

          {/* Orderbook Imbalance */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Orderbook Imbalance</h2>
            <OrderbookImbalance selectedPair={selectedPair} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
