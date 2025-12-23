import api from '@/lib/axios';
import { Cart } from '@/store/types';

export const cartService = {
    async get(): Promise<Cart> {
        const response = await api.get('/cart');
        return response.data;
    },

    async addItem(productId: string, quantity: number): Promise<Cart> {
        const response = await api.post('/cart', { productId, quantity });
        return response.data;
    },

    async updateQuantity(productId: string, quantity: number): Promise<Cart> {
        const response = await api.patch(`/cart/${productId}`, { quantity });
        return response.data;
    },

    async removeItem(productId: string): Promise<Cart> {
        const response = await api.delete(`/cart/${productId}`);
        return response.data;
    },
};
