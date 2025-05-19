// Define the possible trade types: buy or sell
export type TradeType = 'buy' | 'sell';

// Interface for representing a complete trade/transaction
export interface Trade {
  id: string;
  orderId: string;
  userId: string;
  type: TradeType; // 'buy' or 'sell'
  amount: number; // amount of BTC traded
  price: number; // price in USD per BTC unit at the time of trade
  fee: number; // fee charged for the trade (0.5% maker, 0.3% taker)
  total: number; // total value of the trade in USD
  createdAt: string;
}

// Interface for statistics data (internal structure)
export interface StatisticsData {
  lastPrice: number; // last traded price
  btcVolume: number; // total BTC volume in the last 24h
  usdVolume: number; // total USD volume in the last 24h
  high: number; // maximum price in the last 24h
  low: number; // minimum price in the last 24h
  timestamp: string; // timestamp of the statistics
}

// Interface for trading statistics (original format)
// Maintained for compatibility with existing code
export interface TradeStatisticsBase {
  lastPrice: number; // last traded price
  btcVolume: number; // total BTC volume in the last 24h
  usdVolume: number; // total USD volume in the last 24h
  high: number; // maximum price in the last 24h
  low: number; // minimum price in the last 24h
}

// Interface for API response (complete format)
export interface TradeStatistics {
  success: boolean;
  data: {
    statistics: StatisticsData;
  };
  message?: string;
}

// Interface for trade history
export interface TradeHistory {
  trades: Trade[];
  totalPages: number;
  currentPage: number;
  totalTrades: number;
}

// Interface for trade summary by period
export interface TradeSummary {
  period: 'daily' | 'weekly' | 'monthly';
  totalBuyAmount: number; // total BTC bought
  totalSellAmount: number; // total BTC sold
  totalBuyValue: number; // total value in USD of purchases
  totalSellValue: number; // total value in USD of sales
  netAmount: number; // difference between buy and sell (BTC)
  netValue: number; // difference between buy and sell (USD)
  averageBuyPrice: number; // average buy price
  averageSellPrice: number; // average sell price
  totalFees: number; // total fees paid
}

// Helper function to extract the base format from the API response
export function extractTradeStatisticsBase(response: TradeStatistics): TradeStatisticsBase {
  return {
    lastPrice: response.data.statistics.lastPrice,
    btcVolume: response.data.statistics.btcVolume,
    usdVolume: response.data.statistics.usdVolume,
    high: response.data.statistics.high,
    low: response.data.statistics.low
  };
}

// Helper function to adapt the base format to the complete format
export function adaptToTradeStatistics(base: TradeStatisticsBase): TradeStatistics {
  return {
    success: true,
    data: {
      statistics: {
        ...base,
        timestamp: new Date().toISOString()
      }
    }
  };
}