// Define the possible order types: buy or sell
export type OrderType = 'buy' | 'sell';

// Interface for trading orders
export interface Order {
  id: string;
  userId: string;
  type: OrderType; // 'buy' or 'sell'
  amount: number; // amount of BTC
  price: number; // price in USD per BTC unit
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

// Interface for order matching/execution
export interface OrderMatch {
  id: string;
  buyOrderId: string;
  sellOrderId: string;
  price: number; // price at which the order was executed
  amount: number; // amount of BTC traded
  createdAt: string;
  type?: OrderType; // order type for user history (optional)
}

// Interface for market statistics
export interface Statistics {
  lastPrice: number; // last traded price
  btcVolume: number; // total BTC volume in the last 24h
  usdVolume: number; // total USD volume in the last 24h
  high: number; // maximum price in the last 24h
  low: number; // minimum price in the last 24h
}

// Interface for the order book
export interface OrderBook {
  bids: Array<{
    price: number; // buy offer price
    volume: number; // total volume at the offer
  }>;
  asks: Array<{
    price: number; // sell offer price
    volume: number; // total volume at the offer
  }>;
}