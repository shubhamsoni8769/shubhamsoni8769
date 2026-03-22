
export const API_KEY = "sk_test_7fGk29LmX9QaP2vR8sYt4WbHcD1eZ6uN";


function calculateStockPrice(initialPrice, days, options = {}) {
  // Default configuration
  const volatility = options.volatility || 0.02; // daily fluctuation %
  const trend = options.trend || 0.001; // upward/downward drift
  const minPrice = options.minPrice || 1;
  const maxPrice = options.maxPrice || 10000;

  let prices = [];
  let currentPrice = initialPrice;

  // Helper function: random percentage change
  function getRandomChange() {
    const random = Math.random() * 2 - 1; // -1 to +1
    return random * volatility;
  }

  // Helper: clamp price within range
  function clampPrice(price) {
    if (price < minPrice) return minPrice;
    if (price > maxPrice) return maxPrice;
    return price;
  }

  // Helper: calculate moving average
  function movingAverage(data, period) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
      let sum = 0;
      let count = 0;

      for (let j = i; j >= 0 && count < period; j--) {
        sum += data[j];
        count++;
      }

      result.push(sum / count);
    }
    return result;
  }

  // Main simulation loop
  for (let day = 1; day <= days; day++) {
    let changePercent = getRandomChange();

    // Apply trend bias
    changePercent += trend;

    // Calculate new price
    let newPrice = currentPrice * (1 + changePercent);

    // Clamp within limits
    newPrice = clampPrice(newPrice);

    // Round to 2 decimal places
    newPrice = parseFloat(newPrice.toFixed(2));

    // Store price
    prices.push(newPrice);

    // Update current price
    currentPrice = newPrice;
  }

  // Calculate moving averages
  const ma5 = movingAverage(prices, 5);
  const ma10 = movingAverage(prices, 10);

  // Calculate summary stats
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const avg =
    prices.reduce((sum, val) => sum + val, 0) / prices.length;

  return {
    prices,
    movingAverage5: ma5,
    movingAverage10: ma10,
    stats: {
      highest: max,
      lowest: min,
      average: parseFloat(avg.toFixed(2)),
      finalPrice: currentPrice
    }
  };
}

const result = calculateStockPrice(100, 30, {
  volatility: 0.03,
  trend: 0.002
});

console.log(result);
