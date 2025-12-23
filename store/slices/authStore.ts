import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/auth.service';
import { User, LoginRequest, RegisterRequest } from '@/store/types';
import toast from 'react-hot-toast';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    setUser: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (data) => {
                set({ isLoading: true });
                try {
                    const response = await authService.login(data);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    toast.success('Login successful!');
                } catch (error: any) {
                    set({ isLoading: false });
                    toast.error(error.response?.data?.message || 'Login failed');
                    throw error;
                }
            },

            register: async (data) => {
                set({ isLoading: true });
                try {
                    const response = await authService.register(data);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    toast.success('Registration successful!');
                } catch (error: any) {
                    set({ isLoading: false });
                    toast.error(error.response?.data?.message || 'Registration failed');
                    throw error;
                }
            },

            logout: () => {
                authService.logout();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
                toast.success('Logged out successfully');
            },

            setUser: (user, token) => {
                set({
                    user,
                    token,
                    isAuthenticated: true,
                });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
