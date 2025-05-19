/**
 * Represents a match (executed trade) in the exchange
 */
export interface Match {
  id: string;
  buyOrderId: string;
  sellOrderId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  volume: number;
  type: 'buy' | 'sell';
  status: 'completed';
  originOrderUserId: string;
  createdAt: string;
  updatedAt: string;
}