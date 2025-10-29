import { useState, useRef, useEffect } from "react";
import { Search, TrendingUp, Clock, Target, Activity } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";

export default function StockSearch({
  onStockSelect,
  onStartTraining,
  onShowResults,
  selectedStock,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // Search stocks
  const { data: searchResults = [] } = useQuery({
    queryKey: ["stocks", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(
        `/api/stocks/search?q=${encodeURIComponent(searchQuery)}`,
      );
      if (!response.ok) throw new Error("Failed to search stocks");
      return response.json();
    },
    enabled: searchQuery.trim().length > 0,
  });

  // Check model existence for selected stock
  const { data: modelInfo, isLoading: isCheckingModel } = useQuery({
    queryKey: ["model", selectedStock?.symbol],
    queryFn: async () => {
      const response = await fetch(`/api/stocks/${selectedStock.symbol}/model`);
      if (!response.ok) throw new Error("Failed to check model");
      return response.json();
    },
    enabled: !!selectedStock,
  });

  // Get predictions for existing model
  const { data: predictions } = useQuery({
    queryKey: ["predictions", selectedStock?.symbol],
    queryFn: async () => {
      const response = await fetch(
        `/api/stocks/${selectedStock.symbol}/predictions`,
      );
      if (!response.ok) throw new Error("Failed to fetch predictions");
      return response.json();
    },
    enabled: !!selectedStock && modelInfo?.exists,
  });

  useEffect(() => {
    if (predictions && modelInfo?.exists) {
      onShowResults({
        ...modelInfo,
        predictions: predictions.predictions,
      });
    }
  }, [predictions, modelInfo, onShowResults]);

  const handleStockClick = (stock) => {
    onStockSelect(stock);
    setSearchQuery(stock.symbol);
    setIsDropdownOpen(false);
  };

  const handleStartTraining = () => {
    onStartTraining();
  };

  const popularStocks = [
    {
      symbol: "RELIANCE.NS",
      name: "Reliance Industries Limited",
      exchange: "NSE",
      change: "+1.2%",
      price: "₹2,456.30",
    },
    {
      symbol: "TCS.NS",
      name: "Tata Consultancy Services Limited",
      exchange: "NSE",
      change: "+2.8%",
      price: "₹3,487.65",
    },
    {
      symbol: "INFY.NS",
      name: "Infosys Limited",
      exchange: "NSE",
      change: "+1.5%",
      price: "₹1,542.80",
    },
    {
      symbol: "HDFC.NS",
      name: "HDFC Bank Limited",
      exchange: "NSE",
      change: "-0.3%",
      price: "₹1,678.45",
    },
    {
      symbol: "TATAMOTORS.NS",
      name: "Tata Motors Limited",
      exchange: "NSE",
      change: "+3.1%",
      price: "₹487.65",
    },
    {
      symbol: "BHARTIARTL.NS",
      name: "Bharti Airtel Limited",
      exchange: "NSE",
      change: "+0.9%",
      price: "₹912.35",
    },
  ];

  return (
    <>
      {/* Import Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Montserrat:wght@400;600;700&family=Inter:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <section className="w-full bg-gradient-to-br from-[#0B1328] to-[#101C34] relative overflow-hidden pb-[50px]">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute right-0 top-0 w-full h-full opacity-25"
            style={{
              backgroundImage: `radial-gradient(circle at 80% 30%, #4B6AFF 1px, transparent 1px), radial-gradient(circle at 90% 60%, #4B6AFF 1px, transparent 1px), radial-gradient(circle at 70% 80%, #4B6AFF 1px, transparent 1px)`,
              backgroundSize: "60px 60px, 80px 80px, 100px 100px",
              maskImage:
                "linear-gradient(to left, black 0%, black 50%, transparent 85%)",
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-4xl lg:text-5xl font-bold mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              AI-Powered Indian Stock Predictions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white text-opacity-80 text-lg lg:text-xl max-w-2xl mx-auto"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Train LSTM models on NSE historical data and get 7-day price
              forecasts for Indian stocks with real-time accuracy metrics
            </motion.p>
          </div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <div className="relative" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Search Indian stock ticker (e.g., RELIANCE.NS, TCS.NS, INFY.NS)"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#4B6AFF] shadow-lg"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              </div>

              {/* Search Dropdown */}
              <AnimatePresence>
                {isDropdownOpen && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto z-50"
                  >
                    {searchResults.map((stock) => (
                      <button
                        key={stock.symbol}
                        onClick={() => handleStockClick(stock)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {stock.symbol}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {stock.name}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {stock.exchange}
                          </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Selected Stock Card */}
          <AnimatePresence>
            {selectedStock && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto mb-12"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#4B6AFF] to-[#8B5CF6] rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3
                          className="text-2xl font-bold text-gray-900 dark:text-white"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {selectedStock.symbol}
                        </h3>
                        <p
                          className="text-gray-600 dark:text-gray-300"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {selectedStock.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        {selectedStock.exchange}
                      </div>
                    </div>
                  </div>

                  {/* Model Status */}
                  {isCheckingModel ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B6AFF]"></div>
                      <span className="ml-3 text-gray-600 dark:text-gray-300">
                        Checking model status...
                      </span>
                    </div>
                  ) : modelInfo ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Model Exists */}
                      {modelInfo.exists ? (
                        <>
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                              <Target className="w-5 h-5 mr-2 text-green-500" />
                              Model Ready
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">
                                  Last Trained:
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {new Date(
                                    modelInfo.lastTrained,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">
                                  MAE:
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {modelInfo.mae?.toFixed(4)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">
                                  RMSE:
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {modelInfo.rmse?.toFixed(4)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-center">
                            <button
                              onClick={() =>
                                onShowResults({
                                  ...modelInfo,
                                  predictions: predictions.predictions,
                                })
                              }
                              className="w-full bg-gradient-to-r from-[#4B6AFF] to-[#8B5CF6] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#3B56EF] hover:to-[#7B4CE6] transition-all duration-200 mb-3"
                            >
                              <Activity className="w-5 h-5 inline mr-2" />
                              View Predictions
                            </button>
                            <button
                              onClick={handleStartTraining}
                              className="w-full border-2 border-[#4B6AFF] text-[#4B6AFF] dark:text-[#6B7FE8] py-3 px-6 rounded-xl font-semibold hover:bg-[#4B6AFF] hover:text-white transition-all duration-200"
                            >
                              Retrain Model
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                              <Clock className="w-5 h-5 mr-2 text-orange-500" />
                              No Model Found
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300">
                              Train a new LSTM model to get 7-day price
                              predictions for {selectedStock.symbol}. The model
                              will analyze historical data and technical
                              indicators.
                            </p>
                          </div>
                          <div className="flex flex-col justify-center">
                            <button
                              onClick={handleStartTraining}
                              className="w-full bg-gradient-to-r from-[#4B6AFF] to-[#8B5CF6] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#3B56EF] hover:to-[#7B4CE6] transition-all duration-200"
                            >
                              <TrendingUp className="w-5 h-5 inline mr-2" />
                              Train New Model
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Popular Stocks */}
          {!selectedStock && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              <h2
                className="text-white text-2xl font-bold mb-8 text-center"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Popular Indian Stocks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularStocks.map((stock, index) => (
                  <motion.button
                    key={stock.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    onClick={() => handleStockClick(stock)}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left group hover:scale-105"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {stock.symbol}
                      </div>
                      <div
                        className={`text-sm font-medium px-2 py-1 rounded ${
                          stock.change.startsWith("+")
                            ? "text-green-600 bg-green-100 dark:bg-green-900"
                            : "text-red-600 bg-red-100 dark:bg-red-900"
                        }`}
                      >
                        {stock.change}
                      </div>
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      {stock.name}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {stock.price}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {stock.exchange}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
