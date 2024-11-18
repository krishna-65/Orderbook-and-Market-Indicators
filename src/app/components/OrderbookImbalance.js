"use client";
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the necessary components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OrderbookImbalance = ({ selectedPair }) => {
  const [imbalance, setImbalance] = useState(0);
  const [loading, setLoading] = useState(true); // Only show loading initially
  const [error, setError] = useState(null);

  // Fetch imbalance data from Binance API
  const fetchImbalance = async () => {
    setLoading(true);
    setError(null); // Reset error on new fetch
    try {
      const response = await axios.get('https://api.binance.com/api/v3/depth', {
        params: { symbol: selectedPair, limit: 10 },
      });
      const totalBids = response.data.bids.reduce((acc, bid) => acc + parseFloat(bid[1]), 0);
      const totalAsks = response.data.asks.reduce((acc, ask) => acc + parseFloat(ask[1]), 0);
      setImbalance(totalBids - totalAsks);
      setLoading(false); // Hide loading once data is fetched
    } catch (err) {
      setLoading(false);
      setError("Failed to fetch orderbook imbalance data");
    }
  };

  useEffect(() => {
    fetchImbalance();
    const interval = setInterval(fetchImbalance, 1000); // Update every second
    return () => clearInterval(interval);
  }, [selectedPair]);

  // Define the chart data and options
  const data = {
    labels: ['Imbalance'],
    datasets: [
      {
        label: 'Orderbook Imbalance',
        data: [imbalance],
        backgroundColor: imbalance > 0 ? 'green' : 'red',
        borderColor: imbalance > 0 ? 'darkgreen' : 'darkred',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `Orderbook Imbalance for ${selectedPair}`,
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Imbalance' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Volume' },
      },
    },
  };

  // Show loading message only when data is being fetched for the first time
  if (loading && !imbalance) {
    return <div className="text-center text-xl text-gray-400">Loading Orderbook Imbalance...</div>;
  }

  // Show error if API call fails
  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  // Render the Bar chart with the current imbalance data
  return <Bar data={data} options={options} />;
};

export default OrderbookImbalance;
