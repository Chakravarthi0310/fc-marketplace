import api from '@/lib/axios';
import { Product } from '@/store/types';

export const productService = {
    async getAll(): Promise<Product[]> {
        const response = await api.get('/products');
        return response.data;
    },

    async getById(id: string): Promise<Product> {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    async create(data: Partial<Product>): Promise<Product> {
        const response = await api.post('/products', data);
        return response.data;
    },

    async update(id: string, data: Partial<Product>): Promise<Product> {
        const response = await api.patch(`/products/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/products/${id}`);
    },
};
