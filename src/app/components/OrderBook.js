"use client";
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Orderbook = ({ selectedPair = 'BTCUSDT' }) => {
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [] });
  const [loading, setLoading] = useState(true); // Keeps track of loading state
  const prevDataRef = useRef(orderbook);

  const fetchOrderbook = async () => {
    try {
      setLoading(true); // Set loading to true when fetching data
      const response = await axios.get('https://api.binance.com/api/v3/depth', {
        params: { symbol: selectedPair, limit: 10 },
      });
      setOrderbook(response.data);
    } catch (error) {
      console.error("Error fetching orderbook:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchOrderbook();
    const interval = setInterval(fetchOrderbook, 50000); // Fetch every second
    return () => clearInterval(interval);
  }, [selectedPair]);

  // Prevents re-render if orderbook data hasn't changed
  useEffect(() => {
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(orderbook)) {
      prevDataRef.current = orderbook;
    }
  }, [orderbook]);

  return (
    <div className="orderbook p-6 bg-gray-900 text-white rounded-lg shadow-lg max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold mb-4 text-center truncate sm:text-3xl">Orderbook (Top 10) for {selectedPair}</h3>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <motion.div
            className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <span className="text-xl text-gray-400">Loading Orderbook...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Asks */}
          <div>
            <h4 className="text-xl font-medium mb-2 text-red-500 sm:text-2xl">Asks</h4>
            <div className="space-y-2">
              <AnimatePresence>
                {orderbook.asks.map((ask, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between bg-red-100 bg-opacity-10 p-3 rounded-md shadow-md overflow-hidden"
                  >
                    <span className="text-red-500 text-xs sm:text-sm md:text-base truncate">{ask[0]}</span>
                    <span className="text-red-500 text-xs sm:text-sm md:text-base truncate">{ask[1]}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Bids */}
          <div>
            <h4 className="text-xl font-medium mb-2 text-green-500 sm:text-2xl">Bids</h4>
            <div className="space-y-2">
              <AnimatePresence>
                {orderbook.bids.map((bid, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between bg-green-100 bg-opacity-10 p-3 rounded-md shadow-md overflow-hidden"
                  >
                    <span className="text-green-500 text-xs sm:text-sm md:text-base truncate">{bid[0]}</span>
                    <span className="text-green-500 text-xs sm:text-sm md:text-base truncate">{bid[1]}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orderbook;
