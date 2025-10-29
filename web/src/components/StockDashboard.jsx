import { useState } from "react";
import StockHeader from "./StockHeader";
import StockSearch from "./StockSearch";
import ModelTraining from "./ModelTraining";
import PredictionResults from "./PredictionResults";

export default function StockDashboard() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [currentView, setCurrentView] = useState('search'); // 'search', 'training', 'results'
  const [modelData, setModelData] = useState(null);

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
    setCurrentView('search');
    setModelData(null);
  };

  const handleStartTraining = () => {
    setCurrentView('training');
  };

  const handleTrainingComplete = (data) => {
    setModelData(data);
    setCurrentView('results');
  };

  const handleShowResults = (data) => {
    setModelData(data);
    setCurrentView('results');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedStock(null);
    setModelData(null);
  };

  return (
    <div className="min-h-screen">
      <StockHeader />
      
      <main className="pt-[75px]">
        {currentView === 'search' && (
          <StockSearch 
            onStockSelect={handleStockSelect}
            onStartTraining={handleStartTraining}
            onShowResults={handleShowResults}
            selectedStock={selectedStock}
          />
        )}
        
        {currentView === 'training' && (
          <ModelTraining
            stock={selectedStock}
            onTrainingComplete={handleTrainingComplete}
            onBack={handleBackToSearch}
          />
        )}
        
        {currentView === 'results' && (
          <PredictionResults
            stock={selectedStock}
            modelData={modelData}
            onBack={handleBackToSearch}
            onRetrain={handleStartTraining}
          />
        )}
      </main>
    </div>
  );
}