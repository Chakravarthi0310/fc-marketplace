import { create } from 'zustand';
import { orderService } from '@/services/order.service';
import { Order, Address } from '@/store/types';
import toast from 'react-hot-toast';

interface OrderState {
    orders: Order[];
    currentOrder: Order | null;
    isLoading: boolean;
    fetchOrders: () => Promise<void>;
    fetchOrderById: (id: string) => Promise<void>;
    createOrder: (deliveryAddress: Address) => Promise<Order>;
    cancelOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
    orders: [],
    currentOrder: null,
    isLoading: false,

    fetchOrders: async () => {
        set({ isLoading: true });
        try {
            const orders = await orderService.getAll();
            set({ orders, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            toast.error('Failed to fetch orders');
        }
    },

    fetchOrderById: async (id) => {
        set({ isLoading: true });
        try {
            const order = await orderService.getById(id);
            set({ currentOrder: order, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            toast.error('Failed to fetch order');
        }
    },

    createOrder: async (deliveryAddress) => {
        set({ isLoading: true });
        try {
            const order = await orderService.create(deliveryAddress);
            set({ currentOrder: order, isLoading: false });
            toast.success('Order created successfully!');
            return order;
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to create order');
            throw error;
        }
    },

    cancelOrder: async (id) => {
        set({ isLoading: true });
        try {
            await orderService.cancel(id);
            set({ isLoading: false });
            toast.success('Order cancelled successfully');
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to cancel order');
            throw error;
        }
    },
}));
