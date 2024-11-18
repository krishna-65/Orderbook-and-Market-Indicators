"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SpreadIndicator = () => {
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [] });
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(16); // Default font size

  const fetchOrderbook = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.binance.com/api/v3/depth", {
        params: { symbol: selectedPair, limit: 10 },
      });
      setOrderbook(response.data);
    } catch (error) {
      console.error("Error fetching orderbook:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update font size based on screen width
  useEffect(() => {
    const updateFontSize = () => {
      setFontSize(window.innerWidth < 640 ? 14 : 16);
    };

    updateFontSize(); // Initial update
    window.addEventListener("resize", updateFontSize); // Listen to resize events
    return () => window.removeEventListener("resize", updateFontSize); // Cleanup
  }, []);

  useEffect(() => {
    fetchOrderbook();
    const interval = setInterval(fetchOrderbook, 300000); // Fetch every 5 minutes
    return () => clearInterval(interval);
  }, [selectedPair]);

  const chartData = {
    labels: orderbook.asks.map((_, index) => `Level ${index + 1}`),
    datasets: [
      {
        label: "Asks",
        data: orderbook.asks.map((ask) => parseFloat(ask[0])),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Bids",
        data: orderbook.bids.map((bid) => parseFloat(bid[0])),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return (
    <div className="orderbook max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-lg p-4 md:p-6">
      <h3 className="text-center text-lg sm:text-xl md:text-2xl font-semibold mb-4">
        Orderbook (Top 10)
      </h3>

      <div className="mb-4">
        <label htmlFor="pair" className="text-sm font-medium text-gray-300">
          Select Trading Pair:
        </label>
        <select
          id="pair"
          value={selectedPair}
          onChange={(e) => setSelectedPair(e.target.value)}
          className="mt-2 p-2 w-full bg-gray-700 text-white rounded-md focus:outline-none"
        >
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="ETHUSDT">ETH/USDT</option>
          <option value="ADAUSDT">ADA/USDT</option>
          <option value="BNBUSDT">BNB/USDT</option>
        </select>
      </div>

      {loading && (
        <div className="text-center text-base sm:text-lg text-gray-400">
          Loading Orderbook...
        </div>
      )}

      {!loading && (
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
            <h4 className="text-red-500 font-medium mb-2 text-sm sm:text-base md:text-lg">
              Asks
            </h4>
            {orderbook.asks.map((ask, index) => (
              <motion.div
                key={index}
                className="flex justify-between text-xs sm:text-sm md:text-base py-1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <span>{ask[0]}</span>
                <span>{ask[1]}</span>
              </motion.div>
            ))}
          </div>

          <div className="w-full sm:w-1/2">
            <h4 className="text-green-500 font-medium mb-2 text-sm sm:text-base md:text-lg">
              Bids
            </h4>
            {orderbook.bids.map((bid, index) => (
              <motion.div
                key={index}
                className="flex justify-between text-xs sm:text-sm md:text-base py-1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <span>{bid[0]}</span>
                <span>{bid[1]}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: "#ffffff",
                  font: { size: fontSize },
                },
              },
              title: {
                display: true,
                text: `Asks and Bids for ${selectedPair}`,
                color: "#ffffff",
                font: { size: fontSize },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: "#ffffff",
                  font: { size: fontSize - 4 },
                },
              },
              y: {
                ticks: {
                  color: "#ffffff",
                  font: { size: fontSize - 4 },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default SpreadIndicator;
