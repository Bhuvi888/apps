import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { ticker } = params;

    // Get predictions for the ticker
    const predictions = await sql`
      SELECT * FROM stock_predictions 
      WHERE ticker = ${ticker.toUpperCase()}
      ORDER BY prediction_date ASC
    `;

    if (predictions.length === 0) {
      return Response.json({ 
        ticker: ticker.toUpperCase(),
        predictions: [],
        message: 'No predictions found. Train a model first.'
      });
    }

    const formattedPredictions = predictions.map(pred => ({
      date: pred.prediction_date,
      open: parseFloat(pred.open_price),
      high: parseFloat(pred.high_price),
      low: parseFloat(pred.low_price),
      close: parseFloat(pred.close_price)
    }));

    return Response.json({
      ticker: ticker.toUpperCase(),
      predictions: formattedPredictions
    });

  } catch (error) {
    console.error('Error fetching predictions:', error);
    return Response.json({ error: 'Failed to fetch predictions' }, { status: 500 });
  }
}


