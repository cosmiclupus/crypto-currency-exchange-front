import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { 
  AuthState, 
  User, 
  LoginResponse 
} from '../../types/auth.type';
import authService from '../../services/auth.service';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null
};

type AuthAction = 
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...initialState
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
};

interface AuthContextProps {
  state: AuthState;
  login: (username: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (token && userId) {
        try {
          const decoded: any = jwtDecode(token);
          
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            return;
          }
          
          const user = await authService.getUserProfile(userId, token);
          
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { 
              token, 
              user 
            } 
          });
          
          if (location.pathname === '/login' && !location.state?.manual) {
            navigate('/orders');
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        }
      }
    };
    
    loadUserFromToken();
  }, [navigate, location.pathname, location.state]);

  const login = async (username: string) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    
    try {
      const loginResponse = await authService.login(username);
      const { token, userId } = loginResponse;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      
      const user = await authService.getUserProfile(userId, token);
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { token, user } 
      });
      
      navigate('/orders');
    } catch (error) {
      let errorMessage = 'Login failed';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: errorMessage 
      });
    }
  };

  const refreshUserProfile = async () => {
    if (state.token && state.user?.id) {
      try {
        const user = await authService.getUserProfile(
          state.user.id,
          state.token
        );
        dispatch({ type: 'UPDATE_USER', payload: user });
      } catch (error) {
        console.error('Failed to refresh user profile:', error);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    dispatch({ type: 'LOGOUT' });
    navigate('/login', { state: { manual: true } });
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  return (
    <AuthContext.Provider value={{ 
      state, 
      login, 
      logout, 
      updateUser, 
      refreshUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}