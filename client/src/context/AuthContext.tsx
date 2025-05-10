import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AuthState, User } from '@/types';
import { loginAdmin } from '@/api/authService'; // Import your actual service

interface AuthAction {
  type: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT' | 'CLEAR_ERROR' | 'LOADING';
  payload?: {
    user?: User;
    token?: string;
    error?: string;
  };
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload?.token || '');
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload?.user || null,
        token: action.payload?.token || null,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload?.error || 'An error occurred',
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextProps {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOADING' });
  
      // Call the actual login service
      const { token, admin } = await loginAdmin(email, password);
  
      const user: User = {
        email: admin.email,
        role: admin.role,
      };
  
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
    } catch (error) {
      console.log(error)
      console.log(error.response?.data?.message)
      // Extract the exact error message from the backend response
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: { error: errorMessage },
      });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};