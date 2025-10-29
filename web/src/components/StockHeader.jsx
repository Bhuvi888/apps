import { useState } from "react";
import { Moon, Sun, TrendingUp } from "lucide-react";

export default function StockHeader() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      {/* Import Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Montserrat:wght@600&family=Inter:wght@500&display=swap"
        rel="stylesheet"
      />

      <header className="fixed top-0 left-0 right-0 z-50 h-[75px] transition-all duration-300">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D152A] to-[#172542]">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute left-0 top-0 w-96 h-full bg-gradient-to-r from-[#C03CFF] via-[#8268FF] to-[#4E78FF] opacity-35 blur-sm"></div>
            <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-[#C03CFF] via-[#8268FF] to-[#4E78FF] opacity-35 blur-sm"></div>
          </div>
        </div>

        {/* Header content */}
        <div className="relative z-10 h-full max-w-[1600px] mx-auto px-6 flex items-center justify-between">
          {/* Brand block */}
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4E78FF] to-[#C03CFF] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" strokeWidth={2} />
            </div>

            {/* Wordmark */}
            <div>
              <div
                className="text-white text-xl font-semibold"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                StockPredict.AI
              </div>
              <div
                className="text-[#AEB7C4] text-[11px] font-normal -mt-1"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                ML-Powered Stock Forecasting
              </div>
            </div>
          </div>

          {/* Utility Area */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center hover:bg-opacity-20 transition-all duration-200"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-white" strokeWidth={1.5} />
              ) : (
                <Moon className="w-5 h-5 text-white" strokeWidth={1.5} />
              )}
            </button>

            {/* Status Indicator */}
            <div className="flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span
                className="text-white text-sm font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                ML Models Ready
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}