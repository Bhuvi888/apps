import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { ticker } = params;

    // Check if model exists
    const models = await sql`
      SELECT * FROM stock_models 
      WHERE ticker = ${ticker.toUpperCase()}
    `;

    if (models.length === 0) {
      return Response.json({
        exists: false,
        ticker: ticker.toUpperCase(),
      });
    }

    const model = models[0];
    return Response.json({
      exists: true,
      ticker: model.ticker,
      lastTrained: model.last_trained_date,
      mae: parseFloat(model.mae),
      mse: parseFloat(model.mse),
      rmse: parseFloat(model.rmse),
      trainingDuration: model.training_duration_seconds,
    });
  } catch (error) {
    console.error("Error checking model:", error);
    return Response.json({ error: "Failed to check model" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { ticker } = params;
    const body = await request.json();

    // Simulate model training with realistic metrics for Indian stocks
    const trainingDuration = Math.floor(Math.random() * 60) + 30; // 30-90 seconds
    const mae = Math.random() * 40 + 15; // 15-55 for rupee prices
    const mse = Math.random() * 2000 + 500; // 500-2500
    const rmse = Math.sqrt(mse);

    // Insert or update model record
    await sql`
      INSERT INTO stock_models (ticker, mae, mse, rmse, model_path, training_duration_seconds)
      VALUES (${ticker.toUpperCase()}, ${mae}, ${mse}, ${rmse}, ${`/models/${ticker}_model.h5`}, ${trainingDuration})
      ON CONFLICT (ticker) 
      DO UPDATE SET 
        mae = EXCLUDED.mae,
        mse = EXCLUDED.mse,
        rmse = EXCLUDED.rmse,
        last_trained_date = NOW(),
        training_duration_seconds = EXCLUDED.training_duration_seconds,
        updated_at = NOW()
    `;

    // Generate 7-day predictions with rupee prices
    const predictions = [];
    let basePrice = Math.random() * 3000 + 500; // Random base price between ₹500-₹3500

    for (let i = 1; i <= 7; i++) {
      const variation = (Math.random() - 0.5) * 0.05; // ±2.5% daily variation
      const open = basePrice * (1 + variation);
      const close = basePrice * (1 + variation + (Math.random() - 0.5) * 0.02);
      const high = Math.max(open, close) * (1 + Math.random() * 0.025);
      const low = Math.min(open, close) * (1 - Math.random() * 0.025);

      const predictionDate = new Date();
      predictionDate.setDate(predictionDate.getDate() + i);

      predictions.push({
        date: predictionDate.toISOString().split("T")[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
      });

      basePrice = close; // Use close as next day's base
    }

    // Clear existing predictions for this ticker
    await sql`DELETE FROM stock_predictions WHERE ticker = ${ticker.toUpperCase()}`;

    // Insert new predictions
    for (const pred of predictions) {
      await sql`
        INSERT INTO stock_predictions (ticker, prediction_date, open_price, high_price, low_price, close_price)
        VALUES (${ticker.toUpperCase()}, ${pred.date}, ${pred.open}, ${pred.high}, ${pred.low}, ${pred.close})
      `;
    }

    return Response.json({
      success: true,
      ticker: ticker.toUpperCase(),
      mae: parseFloat(mae.toFixed(4)),
      mse: parseFloat(mse.toFixed(4)),
      rmse: parseFloat(rmse.toFixed(4)),
      trainingDuration,
      predictions,
    });
  } catch (error) {
    console.error("Error training model:", error);
    return Response.json({ error: "Failed to train model" }, { status: 500 });
  }
}



