import api from '@/lib/axios';
import { Cart } from '@/store/types';

export const cartService = {
    async get(): Promise<Cart> {
        const response = await api.get('/cart');
        return response.data.data;
    },

    async addItem(productId: string, quantity: number): Promise<Cart> {
        const response = await api.post('/cart', { productId, quantity });
        return response.data.data;
    },

    async updateQuantity(productId: string, quantity: number): Promise<Cart> {
        const response = await api.patch(`/cart/${productId}`, { quantity });
        return response.data.data;
    },

    async removeItem(productId: string): Promise<Cart> {
        const response = await api.delete(`/cart/${productId}`);
        return response.data.data;
    },

    async clear(): Promise<void> {
        await api.delete('/cart');
    },
};
