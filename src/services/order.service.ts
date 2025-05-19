import api, { get, post, remove, createApiService } from './api';
import { Order, OrderMatch, Statistics, OrderBook } from '../types/order.type';

/**
 * Order service for the trading platform
 * Provides methods to create, query, and cancel orders, as well as fetch market data
 */
const orderService = {
  /**
   * Gets all active orders for the current user
   * @returns {Promise<any>} Promise with active orders data
   * @throws {Error} If the request fails
   */
  getActiveOrders: async () => {
    const response = await get('/api/order/active');
    if (!response.success) {
      throw new Error(response.message || 'Failed to get active orders');
    }
    return response.data;
  },
  
  /**
   * Gets the order execution history for the current user
   * @returns {Promise<OrderMatch[]>} Promise with order match history
   * @throws {Error} If the request fails
   */
  getOrderHistory: async () => {
    const response = await get<OrderMatch[]>('/api/order/history');
    if (!response.success) {
      throw new Error(response.message || 'Failed to get history');
    }
    return response.data;
  },
  
  /**
   * Creates a new buy or sell order
   * @param {string} type - Order type ('buy' or 'sell')
   * @param {number} amount - Amount of BTC to trade
   * @param {number} price - Price per BTC in USD
   * @returns {Promise<Order>} Promise with details of the created order
   * @throws {Error} If order creation fails
   */
  createOrder: async (type: string, amount: number, price: number) => {
    const response = await post<{ type: string; amount: number; price: number }, Order>(
      '/api/order', 
      { type, amount, price }
    );
    if (!response.success) {
      throw new Error(response.message || 'Failed to create order');
    }
    return response.data;
  },
  
  /**
   * Cancels an existing order
   * @param {string} orderId - ID of the order to cancel
   * @returns {Promise<void>} Promise that resolves when the order is successfully canceled
   * @throws {Error} If the cancellation fails
   */
  cancelOrder: async (orderId: string) => {
    const response = await remove(`/api/order/${orderId}`);
    if (!response.success) {
      throw new Error(response.message || 'Failed to cancel order');
    }
  },
  
  /**
   * Gets current market statistics (last price, volume, high, low)
   * @returns {Promise<Statistics>} Promise with market statistics
   * @throws {Error} If the request fails
   */
  getStatistics: async () => {
    const response = await get<Statistics>('/api/trade/statistics');
    if (!response.success) {
      throw new Error(response.message || 'Failed to get statistics');
    }
    return response.data;
  },
  
  /**
   * Gets the current order book (bids and asks)
   * @returns {Promise<OrderBook>} Promise with order book data
   * @throws {Error} If the request fails
   */
  getOrderBook: async () => {
    const response = await get<OrderBook>('/api/order/book');
    if (!response.success) {
      throw new Error(response.message || 'Failed to get order book');
    }
    return response.data;
  },
  
  /**
   * Gets recent trades executed across the entire platform
   * @returns {Promise<OrderMatch[]>} Promise with global match data
   * @throws {Error} If the request fails
   */
  getGlobalMatches: async () => {
    const response = await get<OrderMatch[]>('/api/market/matches');
    if (!response.success) {
      throw new Error(response.message || 'Failed to get global matches');
    }
    return response.data;
  },
  
  /**
   * Gets the current user's profile information
   * @returns {Promise<any>} Promise with user profile data
   * @throws {Error} If the request fails
   */
  getUserProfile: async () => {
    const response = await get('/api/user/profile');
    if (!response.success) {
      throw new Error(response.message || 'Failed to get profile');
    }
    return response.data;
  }
};

export default orderService;