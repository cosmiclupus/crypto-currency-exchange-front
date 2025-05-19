import api from './api';
import { 
  Trade, 
  TradeType, 
  TradeStatistics, 
  TradeSummary 
} from '../types/trade.type';

interface StatisticsResponse {
  success: boolean;
  data: {
    statistics: TradeStatistics;
  };
}
const tradeService = {

/**
* Fetches trade statistics
* Returns data such as last price, volumes and maximum/minimum
*/
 async getStatistics(): Promise<TradeStatistics> {
  const response = await api.get<StatisticsResponse>('/api/trade/statistics');
  const { success, data } = response.data;
  
  if (!success || !data || !data.statistics) {
    throw new Error('Failed to get statistics');
  }
  
  return data.statistics;
},

  /**
  * Searches the logged in user's trade history
  */
  getUserTradeHistory: async (): Promise<Trade[]> => {
    try {
      const response = await api.get<Trade[]>('/api/trade/history/user');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user trade history:', error);
      throw new Error(error.response?.data?.message || 'Failed to get trading history');
    }
  },


  /**
  * Searches all recent trades in the market
  */
  getGlobalTrades: async (): Promise<Trade[]> => {
    try {
      const response = await api.get<Trade[]>('/api/trade/global');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching global trades:', error);
      throw new Error(error.response?.data?.message || 'Failed to get global trades');
    }
  },


  /**
  * Searches for the user's trade summary by period
  * @param period Desired period ('daily', 'weekly', 'monthly')
  */
  getTradeSummary: async (period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<TradeSummary> => {
    try {
      const response = await api.get<TradeSummary>(`/api/trade/summary/${period}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching trade summary:', error);
      throw new Error(error.response?.data?.message || 'Failed to get trade summary');
    }
  },


  /**
  * Fetch details of a specific trade
  * @param tradeId ID of the trade
  */
  getTradeDetails: async (tradeId: string): Promise<Trade> => {
    try {
      const response = await api.get<Trade>(`/api/trade/${tradeId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching trade details:', error);
      throw new Error(error.response?.data?.message || 'Failed to get trade details');
    }
  }
};

export default tradeService;