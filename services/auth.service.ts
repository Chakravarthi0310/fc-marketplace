import api from '@/lib/axios';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/store/types';

export const authService = {
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },
};
