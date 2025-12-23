import api from '@/lib/axios';
import { Order, Address, PaymentOrder } from '@/store/types';

export const orderService = {
    async create(deliveryAddress: Address): Promise<Order> {
        const response = await api.post('/orders', { deliveryAddress });
        return response.data;
    },

    async getAll(): Promise<Order[]> {
        const response = await api.get('/orders');
        return response.data;
    },

    async getById(id: string): Promise<Order> {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    async cancel(id: string): Promise<Order> {
        const response = await api.post(`/orders/${id}/cancel`);
        return response.data;
    },

    async getFarmerOrders(): Promise<Order[]> {
        const response = await api.get('/orders/farmer/orders');
        return response.data.data;
    },
};
