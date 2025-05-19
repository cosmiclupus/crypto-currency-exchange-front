import api, { get, post, remove, createApiService } from './api';

interface GlobalMatch {
  id: string;
  price: number;
  volume: number;
  formattedPrice?: string;
  formattedVolume?: string;
  createdAt: string;
}

interface UserMatch extends GlobalMatch {
  type: 'Buy' | 'Sell';
}

interface Trading24hStats {
  highPrice: number;
  lowPrice: number;
  volume: number;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
}

const globalMatchService = {
  
  // Get recent global matches (for "Global Matches" screen)
  getGlobalMatches: async () => {
    const response = await get<{
      data: {
        matches: GlobalMatch[] 
      }
}>('/api/globalMatch');
    if (!response.success) {
      throw new Error(response.message || 'Failed to get global matches');
    }
    return response;
  },

  // Get user matches (for "My History" screen)
  getUserMatches: async () => {
    const response = await get<{ matches: UserMatch[] }>('/api/globalMatch/user');
    if (!response.success) {
      throw new Error(response.message || 'Failed to get user matches');
    }
    return response;
  },

  // Get 24 hour trading statistics
  get24hStats: async () => {
    const response = await get<Trading24hStats>('/api/globalMatch/stats/24h');
    if (!response.success) {
      throw new Error(response.message || 'Failed to get 24h trading statistics');
    }
    return response;
  },

  // Get a specific match by ID
  getMatchById: async (matchId: string) => {
    const response = await get<GlobalMatch>(`/api/globalMatch/${matchId}`);
    if (!response.success) {
      throw new Error(response.message || 'Failed to get match');
    }
    return response;
  },

  // Get matches related to a specific order
  getOrderMatches: async (orderId: string) => {
    const response = await get<{ matches: GlobalMatch[] }>(`/api/globalMatch/order/${orderId}`);
    if (!response.success) {
      throw new Error(response.message || 'Failed to get order matches');
    }
    return response;
  }
};

const globalMatchBaseEndpoint = '/api/globalMatch';
const globalMatchApiService = createApiService<GlobalMatch>(globalMatchBaseEndpoint);

export default globalMatchService;
export type { GlobalMatch, UserMatch, Trading24hStats };