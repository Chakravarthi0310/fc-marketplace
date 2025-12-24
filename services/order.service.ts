import api from '@/lib/axios';
import { Order, Address } from '@/store/types';

export const orderService = {
    async create(deliveryAddress: Address): Promise<Order> {
        const response = await api.post('/orders', { deliveryAddress });
        return response.data.data;
    },

    async getAll(page = 1, limit = 10): Promise<{ docs: Order[], total: number, page: number, pages: number }> {
        const response = await api.get('/orders', {
            params: { page, limit }
        });
        return response.data.data; // Response likely { docs: [], total: ... }
    },

    async getById(id: string): Promise<Order> {
        const response = await api.get(`/orders/${id}`);
        return response.data.data;
    },

    async cancel(id: string): Promise<Order> {
        const response = await api.post(`/orders/${id}/cancel`);
        return response.data.data;
    },

    async getFarmerOrders(page = 1, limit = 10): Promise<{ docs: Order[], total: number, page: number, pages: number }> {
        const response = await api.get('/orders/farmer/orders', {
            params: { page, limit }
        });
        return response.data.data;
    },
};
