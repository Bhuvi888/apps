import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Brain, Activity, Clock, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export default function ModelTraining({ stock, onTrainingComplete, onBack }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const trainingSteps = [
    { step: "Fetching historical data...", duration: 2000 },
    { step: "Preprocessing data & calculating indicators...", duration: 3000 },
    { step: "Creating LSTM sequences...", duration: 2500 },
    { step: "Building neural network architecture...", duration: 2000 },
    { step: "Training LSTM model...", duration: 8000 },
    { step: "Validating model performance...", duration: 2000 },
    { step: "Generating 7-day predictions...", duration: 1500 },
    { step: "Saving model and results...", duration: 1000 }
  ];

  const trainModelMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/stocks/${stock.symbol}/model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (!response.ok) throw new Error('Training failed');
      return response.json();
    },
    onSuccess: (data) => {
      setIsComplete(true);
      setTimeout(() => {
        onTrainingComplete(data);
      }, 2000);
    },
    onError: (error) => {
      console.error('Training error:', error);
    }
  });

  useEffect(() => {
    // Start training simulation
    let currentProgress = 0;
    let stepIndex = 0;
    
    const runStep = () => {
      if (stepIndex < trainingSteps.length) {
        const step = trainingSteps[stepIndex];
        setCurrentStep(step.step);
        
        const stepProgress = (stepIndex + 1) / trainingSteps.length * 100;
        
        // Animate progress for this step
        const interval = setInterval(() => {
          currentProgress += 0.5;
          if (currentProgress >= stepProgress) {
            currentProgress = stepProgress;
            clearInterval(interval);
            stepIndex++;
            setTimeout(runStep, 100);
          }
          setProgress(currentProgress);
        }, step.duration / (stepProgress - (stepIndex * 100 / trainingSteps.length)) * 0.5);
      } else {
        // Training complete, trigger API call
        trainModelMutation.mutate();
      }
    };

    const timer = setTimeout(runStep, 1000);
    return () => clearTimeout(timer);
  }, [stock, trainModelMutation]);

  return (
    <>
      {/* Import Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Montserrat:wght@400;600;700&family=Inter:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-gradient-to-br from-[#0B1328] to-[#101C34] relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#4B6AFF] rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-white hover:text-[#4B6AFF] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span style={{ fontFamily: "Inter, sans-serif" }}>Back to Search</span>
            </button>
          </div>

          {/* Main Training Interface */}
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="max-w-2xl w-full">
              {/* Stock Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center space-x-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl px-6 py-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#4B6AFF] to-[#8B5CF6] rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-white text-lg font-bold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      {stock.symbol}
                    </div>
                    <div className="text-white text-opacity-80 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      Training LSTM Model
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Training Progress */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl"
              >
                {/* Status Icon */}
                <div className="text-center mb-8">
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto"
                    >
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 bg-[#4B6AFF] bg-opacity-10 rounded-full flex items-center justify-center mx-auto"
                    >
                      <Activity className="w-10 h-10 text-[#4B6AFF]" />
                    </motion.div>
                  )}
                </div>

                {/* Progress Title */}
                <h2 
                  className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {isComplete ? "Training Complete!" : "Training Your Model"}
                </h2>

                <p 
                  className="text-gray-600 dark:text-gray-300 text-center mb-8"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {isComplete 
                    ? "Your LSTM model is ready for predictions" 
                    : "Building neural networks and analyzing historical data..."}
                </p>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Progress
                    </span>
                    <span 
                      className="text-sm font-medium text-[#4B6AFF]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-[#4B6AFF] to-[#8B5CF6] h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Current Step */}
                <div className="text-center">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300"
                  >
                    {!isComplete && <Clock className="w-4 h-4" />}
                    <span 
                      className="text-sm font-medium"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {isComplete ? "Redirecting to results..." : currentStep}
                    </span>
                  </motion.div>
                </div>

                {/* Technical Details */}
                {!isComplete && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <h4 
                      className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Model Architecture
                    </h4>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                      <div>• LSTM Layer: 128 units, return_sequences=False</div>
                      <div>• Dense Output: 4 units (Open, High, Low, Close)</div>
                      <div>• Loss Function: Huber Loss (delta=1.0)</div>
                      <div>• Optimizer: Adam with adaptive learning rate</div>
                      <div>• Lookback Window: 180 days</div>
                      <div>• Features: OHLC + SMA + EMA + RSI + Temporal</div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Training complete animation */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-green-400 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                animate={{
                  x: Math.cos(i * 30 * Math.PI / 180) * 200,
                  y: Math.sin(i * 30 * Math.PI / 180) * 200,
                  opacity: [1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}