import api from '@/lib/axios';
import { Product } from '@/store/types';

export const productService = {
    async getAll(query = {}, page = 1, limit = 10): Promise<{ docs: Product[], total: number, page: number, pages: number }> {
        const response = await api.get('/products', {
            params: { ...query, page, limit }
        });
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

    async getUploadUrl(id: string, contentType: string): Promise<{ uploadUrl: string; imageUrl: string }> {
        const response = await api.post(`/products/${id}/image-upload-url`, { contentType });
        return response.data;
    },

    async uploadImage(uploadUrl: string, file: File): Promise<void> {
        await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });
    },
};
