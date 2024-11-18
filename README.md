<!-- Market Depth Chart Application -->

This project is a real-time market depth visualization tool for cryptocurrency trading pairs using data from the Binance API. The application provides an interactive user interface built with Next.js, React, and Chart.js, offering both line and bar chart representations for better analysis of market depth.

<!-- Features -->
**Real-Time Data Fetching**: Updates every second to reflect the latest market depth data.
**Interactive Charts**:Line Chart for visualizing trends.
                        Bar Chart for analyzing volume distribution.
**Responsive Design**: Optimized for various devices and screen sizes.
**Dynamic Pair Selection**: Configurable to fetch data for different trading pairs.

 <!-- Components Overview -->

1. **Homepage**:  
   Central component that integrates and displays all features in a user-friendly layout.

2. **MarketDepth**:  
   - Visualizes market depth using Chart.js.  
   - Allows toggling between different chart types (e.g., line, bar).  

3. **Orderbook**:  
   - Displays live bid and ask data.  
   - Easy-to-read layout with potential for sorting and filtering.

4. **OrderbookImbalance**:  
   - Highlights discrepancies between bids and asks.  
   - Useful for identifying trading opportunities.

5. **SpreadIndicator**:  
   - Shows the spread between bid and ask prices.  
   - Provides insights into market liquidity and volatility.



<!-- Tech Stack -->
**Framework**: Next.js (React Framework)
**Data Visualization**: Chart.js (with React-Chart.js-2)
**API**: Binance API
**Styling**: Tailwind CSS 
**Library**:Framer motion
**HTTP Client**: Axios



<!-- Setup and Installation -->

<!-- Prerequisites -->
Node.js (version 16 or higher)
npm  package manager


<!-- Steps to Run Locally -->

**1.Clone the Repository**:

git clone https://github.com/krishna-65/Orderbook-and-Market-Indicators.git
cd market-depth-chart

**2.Install Dependencies**:
npm install


**3.Run the Development Server**:
npm run dev

**4.Open your browser and navigate to**:
http://localhost:3000



<!-- API Integration -->

This project fetches market depth data from the Binance API:
**Endpoint**: https://api.binance.com/api/v3/depth

<!-- Parameters -->
**symbol**: The trading pair (e.g., BTCUSDT).
**limit**: The number of price levels to fetch (default: 10).


<!-- Future Enhancements -->
Implement additional chart types (e.g., candlestick charts).
Include historical market depth data for analysis over time.
Optimize API requests using WebSocket for real-time updates.










