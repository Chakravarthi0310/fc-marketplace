import api from '@/lib/axios';
import { PaymentOrder } from '@/store/types';

export const paymentService = {
    async createOrder(orderId: string): Promise<PaymentOrder> {
        const response = await api.post('/payments/create-order', { orderId });
        return response.data;
    },

    async checkStatus(orderId: string): Promise<any> {
        const response = await api.get(`/payments/status/${orderId}`);
        return response.data;
    },
};
