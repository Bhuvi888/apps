import { motion } from "motion/react";
import {
  ArrowLeft,
  TrendingUp,
  RotateCcw,
  Target,
  Clock,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PredictionResults({
  stock,
  modelData,
  onBack,
  onRetrain,
}) {
  // Format predictions for chart
  const chartData =
    modelData?.predictions?.map((pred, index) => ({
      day: `Day ${index + 1}`,
      date: new Date(pred.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      open: pred.open,
      high: pred.high,
      low: pred.low,
      close: pred.close,
    })) || [];

  const formatCurrency = (value) => {
    return `₹${value.toFixed(2)}`;
  };

  const formatMetric = (value) => {
    return value?.toFixed(4) || "N/A";
  };

  const getPerformanceColor = (mae) => {
    if (mae < 30) return "text-green-600";
    if (mae < 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceLabel = (mae) => {
    if (mae < 30) return "Excellent";
    if (mae < 50) return "Good";
    return "Fair";
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Import Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Montserrat:wght@400;600;700&family=Inter:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0D152A] to-[#172542] px-6 py-4">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-white hover:text-[#4B6AFF] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span style={{ fontFamily: "Inter, sans-serif" }}>
                Back to Search
              </span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-4 py-2">
                <Target className="w-4 h-4 text-green-400" />
                <span
                  className="text-white text-sm font-medium"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Model Active
                </span>
              </div>

              <button
                onClick={onRetrain}
                className="flex items-center space-x-2 bg-[#4B6AFF] hover:bg-[#3B56EF] text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span style={{ fontFamily: "Inter, sans-serif" }}>Retrain</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          {/* Stock Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#4B6AFF] to-[#8B5CF6] rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {stock.symbol} Predictions
                </h1>
                <p
                  className="text-gray-600 dark:text-gray-300"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  7-day forecast • {stock.name}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Chart Section - Takes 2/3 width */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="xl:col-span-2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-xl font-bold text-gray-900 dark:text-white"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Price Forecast
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span style={{ fontFamily: "Inter, sans-serif" }}>
                      Generated {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="date"
                        stroke="#6B7280"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                        }}
                      />
                      <YAxis
                        stroke="#6B7280"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                        }}
                        tickFormatter={formatCurrency}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="open"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                        name="Open"
                      />
                      <Line
                        type="monotone"
                        dataKey="high"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                        name="High"
                      />
                      <Line
                        type="monotone"
                        dataKey="low"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                        name="Low"
                      />
                      <Line
                        type="monotone"
                        dataKey="close"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 5 }}
                        name="Close"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Metrics Sidebar - Takes 1/3 width */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Model Performance */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3
                  className="text-lg font-bold text-gray-900 dark:text-white mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Model Performance
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-gray-600 dark:text-gray-300"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Accuracy
                    </span>
                    <span
                      className={`font-bold ${getPerformanceColor(modelData?.mae || 0)}`}
                    >
                      {getPerformanceLabel(modelData?.mae || 0)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        MAE:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {formatMetric(modelData?.mae)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        MSE:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {formatMetric(modelData?.mse)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        RMSE:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {formatMetric(modelData?.rmse)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Training Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3
                  className="text-lg font-bold text-gray-900 dark:text-white mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Training Details
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      Duration:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {modelData?.trainingDuration || 0}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      Last Trained:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      Architecture:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      LSTM
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3
                  className="text-lg font-bold text-gray-900 dark:text-white mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Key Insights
                </h3>

                {modelData?.predictions && modelData.predictions.length > 0 && (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Predicted Trend
                      </div>
                      <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        {modelData.predictions[modelData.predictions.length - 1]
                          ?.close > modelData.predictions[0]?.close
                          ? "📈 Upward trend expected"
                          : "📉 Downward trend expected"}
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg">
                      <div className="text-sm font-medium text-purple-900 dark:text-purple-100">
                        Price Range
                      </div>
                      <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                        {formatCurrency(
                          Math.min(...modelData.predictions.map((p) => p.low)),
                        )}{" "}
                        -{" "}
                        {formatCurrency(
                          Math.max(...modelData.predictions.map((p) => p.high)),
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Predictions Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3
                className="text-xl font-bold text-gray-900 dark:text-white mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Detailed Predictions
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th
                        className="text-left py-3 text-gray-600 dark:text-gray-300 font-medium"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Date
                      </th>
                      <th
                        className="text-right py-3 text-gray-600 dark:text-gray-300 font-medium"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Open
                      </th>
                      <th
                        className="text-right py-3 text-gray-600 dark:text-gray-300 font-medium"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        High
                      </th>
                      <th
                        className="text-right py-3 text-gray-600 dark:text-gray-300 font-medium"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Low
                      </th>
                      <th
                        className="text-right py-3 text-gray-600 dark:text-gray-300 font-medium"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Close
                      </th>
                      <th
                        className="text-right py-3 text-gray-600 dark:text-gray-300 font-medium"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelData?.predictions?.map((pred, index) => {
                      const change =
                        index > 0
                          ? ((pred.close -
                              modelData.predictions[index - 1].close) /
                              modelData.predictions[index - 1].close) *
                            100
                          : 0;

                      return (
                        <tr
                          key={index}
                          className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td
                            className="py-4 text-gray-900 dark:text-white font-medium"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {new Date(pred.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td
                            className="py-4 text-right text-gray-900 dark:text-white"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {formatCurrency(pred.open)}
                          </td>
                          <td
                            className="py-4 text-right text-gray-900 dark:text-white"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {formatCurrency(pred.high)}
                          </td>
                          <td
                            className="py-4 text-right text-gray-900 dark:text-white"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {formatCurrency(pred.low)}
                          </td>
                          <td
                            className="py-4 text-right text-gray-900 dark:text-white font-medium"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {formatCurrency(pred.close)}
                          </td>
                          <td
                            className={`py-4 text-right font-medium ${
                              change > 0
                                ? "text-green-600"
                                : change < 0
                                  ? "text-red-600"
                                  : "text-gray-500"
                            }`}
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {index > 0
                              ? `${change > 0 ? "+" : ""}${change.toFixed(2)}%`
                              : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
