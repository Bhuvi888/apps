export async function GET(request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "";

    // Popular Indian stock tickers with their info
    const stockSymbols = [
      {
        symbol: "RELIANCE.NS",
        name: "Reliance Industries Limited",
        exchange: "NSE",
      },
      {
        symbol: "TCS.NS",
        name: "Tata Consultancy Services Limited",
        exchange: "NSE",
      },
      { symbol: "INFY.NS", name: "Infosys Limited", exchange: "NSE" },
      { symbol: "HDFC.NS", name: "HDFC Bank Limited", exchange: "NSE" },
      { symbol: "ICICIBANK.NS", name: "ICICI Bank Limited", exchange: "NSE" },
      {
        symbol: "BHARTIARTL.NS",
        name: "Bharti Airtel Limited",
        exchange: "NSE",
      },
      { symbol: "HDFCBANK.NS", name: "HDFC Bank Limited", exchange: "NSE" },
      { symbol: "SBIN.NS", name: "State Bank of India", exchange: "NSE" },
      { symbol: "WIPRO.NS", name: "Wipro Limited", exchange: "NSE" },
      { symbol: "TATAMOTORS.NS", name: "Tata Motors Limited", exchange: "NSE" },
      { symbol: "LT.NS", name: "Larsen & Toubro Limited", exchange: "NSE" },
      {
        symbol: "ONGC.NS",
        name: "Oil and Natural Gas Corporation",
        exchange: "NSE",
      },
      { symbol: "TECHM.NS", name: "Tech Mahindra Limited", exchange: "NSE" },
      {
        symbol: "SUNPHARMA.NS",
        name: "Sun Pharmaceutical Industries Limited",
        exchange: "NSE",
      },
      {
        symbol: "ULTRACEMCO.NS",
        name: "UltraTech Cement Limited",
        exchange: "NSE",
      },
      {
        symbol: "POWERGRID.NS",
        name: "Power Grid Corporation of India Limited",
        exchange: "NSE",
      },
      { symbol: "NTPC.NS", name: "NTPC Limited", exchange: "NSE" },
      { symbol: "COALINDIA.NS", name: "Coal India Limited", exchange: "NSE" },
      {
        symbol: "MARUTI.NS",
        name: "Maruti Suzuki India Limited",
        exchange: "NSE",
      },
      { symbol: "TITAN.NS", name: "Titan Company Limited", exchange: "NSE" },
      {
        symbol: "BAJFINANCE.NS",
        name: "Bajaj Finance Limited",
        exchange: "NSE",
      },
      {
        symbol: "M&M.NS",
        name: "Mahindra & Mahindra Limited",
        exchange: "NSE",
      },
      {
        symbol: "HCLTECH.NS",
        name: "HCL Technologies Limited",
        exchange: "NSE",
      },
      {
        symbol: "DRREDDY.NS",
        name: "Dr. Reddys Laboratories Limited",
        exchange: "NSE",
      },
      {
        symbol: "ADANIPORTS.NS",
        name: "Adani Ports and Special Economic Zone Limited",
        exchange: "NSE",
      },
    ];

    // Filter based on query
    const filteredStocks = stockSymbols.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase()),
    );

    return Response.json(filteredStocks.slice(0, 10));
  } catch (error) {
    console.error("Error searching stocks:", error);
    return Response.json({ error: "Failed to search stocks" }, { status: 500 });
  }
}



