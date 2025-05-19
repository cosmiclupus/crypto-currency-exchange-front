import { get } from './api';

interface MatchHistoryResponse {
  success: boolean;
  data: {
    matches: Array<{
      id: string;
      price: number;
      volume: number;
      type: 'buy' | 'sell';
      timestamp: string;
      formattedPrice: string;
      formattedVolume: string;
    }>;
    total: number;
  };
  message?: string;
}

// Service for matches
const matchService = {
  /**
   * Get user's match history
   * @param userId User ID (optional, may be read from authentication context)
   * @returns Promise with the history of user matches
   */
  getMatchHistory: async (userId?: string) => {
   
    const response = await get<MatchHistoryResponse>('/api/match/history');
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to retrieve match history');
    }
    return response;
  }
};

export default matchService;