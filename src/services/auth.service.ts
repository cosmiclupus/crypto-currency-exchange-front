import axios from 'axios';
import { LoginResponse, User } from '../types/auth.type';

const API_URL = 'http://localhost:3001/api';

class AuthService {
  
  // Login function that returns token and userId
  async login(username: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username });
      return response.data;
    } catch (error) {
      throw new Error('Failed to login');
    }
  }

  // Get user profile using userId and token
  async getUserProfile(userId: string, token: string): Promise<User> {
    try {
      const response = await axios.get(`${API_URL}/user/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  }
}

export default new AuthService();