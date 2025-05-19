import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export async function get<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await api.get(endpoint);
    return {
      data: response.data,
      success: true
    };
  } catch (error: any) {
    return {
      data: {} as T,
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar dados'
    };
  }
}

export async function post<T, R = T>(endpoint: string, data: T): Promise<ApiResponse<R>> {
  try {
    const response = await api.post(endpoint, data);
    return {
      data: response.data,
      success: true
    };
  } catch (error: any) {
    return {
      data: {} as R,
      success: false,
      message: error.response?.data?.message || 'Erro ao enviar dados'
    };
  }
}

export async function put<T, R = T>(endpoint: string, data: T): Promise<ApiResponse<R>> {
  try {
    const response = await api.put(endpoint, data);
    return {
      data: response.data,
      success: true
    };
  } catch (error: any) {
    return {
      data: {} as R,
      success: false,
      message: error.response?.data?.message || 'Erro ao atualizar dados'
    };
  }
}

export async function remove<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await api.delete(endpoint);
    return {
      data: response.data,
      success: true
    };
  } catch (error: any) {
    return {
      data: {} as T,
      success: false,
      message: error.response?.data?.message || 'Erro ao remover dados'
    };
  }
}

export interface ApiService<T> {
  getAll: () => Promise<ApiResponse<T[]>>;
  getOne: (id: string | number) => Promise<ApiResponse<T>>;
  create: <R = T>(data: T) => Promise<ApiResponse<R>>;
  update: <R = T>(id: string | number, data: T) => Promise<ApiResponse<R>>;
  remove: (id: string | number) => Promise<ApiResponse<unknown>>;
}

// Função para criar um serviço de API para um recurso específico
export function createApiService<T>(baseEndpoint: string): ApiService<T> {
  return {
    getAll: () => get<T[]>(baseEndpoint),
    getOne: (id) => get<T>(`${baseEndpoint}/${id}`),
    create: <R = T>(data: T) => post<T, R>(baseEndpoint, data),
    update: <R = T>(id: any, data: T) => put<T, R>(`${baseEndpoint}/${id}`, data),
    remove: (id) => remove(`${baseEndpoint}/${id}`)
  };
}

export default api;