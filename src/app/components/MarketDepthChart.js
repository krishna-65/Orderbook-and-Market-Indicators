"use client"; // Make sure the file runs on the client side

// Import necessary modules from Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  BarElement, // Import BarElement
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";

// Register the necessary components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  BarElement, // Register BarElement
  Title,
  Tooltip,
  Legend
);

const MarketDepthChart = ({ selectedPair = "BTCUSDT", chartType = "line" }) => {
  const [depthData, setDepthData] = useState({ bids: [], asks: [] });
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch market depth data from Binance API
  const fetchDepth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://api.binance.com/api/v3/depth", {
        params: { symbol: selectedPair, limit: 10 },
      });
      const bids = response.data.bids.map((bid) => parseFloat(bid[1]));
      const asks = response.data.asks.map((ask) => parseFloat(ask[1]));
      setDepthData({ bids, asks });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Failed to fetch market depth data");
    }
  };

  useEffect(() => {
    fetchDepth();
    const interval = setInterval(fetchDepth, 1000); // Update data every second
    return () => clearInterval(interval); // Clean up interval on unmount
  }, [selectedPair]);

  // Update the chart data whenever depthData changes
  useEffect(() => {
    if (depthData.bids.length && depthData.asks.length) {
      setChartData({
        labels: Array.from({ length: depthData.bids.length }, (_, i) => `Level ${i + 1}`),
        datasets: [
          {
            label: "Bids",
            data: depthData.bids,
            borderColor: "green",
            backgroundColor: "rgba(0, 255, 0, 0.5)",
            fill: chartType === "bar",
          },
          {
            label: "Asks",
            data: depthData.asks,
            borderColor: "red",
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            fill: chartType === "bar",
          },
        ],
      });
    }
  }, [depthData, chartType]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Market Depth (Bids & Asks) for ${selectedPair}`,
      },
    },
    scales: {
      x: {
        type: "category",
        title: { display: true, text: "Price Level" },
      },
      y: {
        type: "linear",
        title: { display: true, text: "Volume" },
      },
    },
  };

  // Show loading message or error if applicable
  if (loading && !chartData) {
    return <div className="text-center text-xl text-gray-400">Loading Market Depth...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  if (!chartData) {
    // Avoid rendering until chartData is ready
    return null;
  }

  // Conditionally render Line or Bar chart based on chartType prop
  return chartType === "bar" ? (
    <Bar data={chartData} options={options} />
  ) : (
    <Line data={chartData} options={options} />
  );
};

export default MarketDepthChart;
