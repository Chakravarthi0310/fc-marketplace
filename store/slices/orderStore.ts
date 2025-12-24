import { create } from 'zustand';
import { orderService } from '@/services/order.service';
import { Order, Address } from '@/store/types';
import toast from 'react-hot-toast';

interface PaginationMeta {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
}

interface OrderState {
    orders: Order[];
    pagination: PaginationMeta;
    currentOrder: Order | null;
    isLoading: boolean;
    fetchOrders: (page?: number, limit?: number) => Promise<void>;
    fetchOrderById: (id: string) => Promise<void>;
    createOrder: (deliveryAddress: Address) => Promise<Order>;
    cancelOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    pagination: {
        page: 1,
        limit: 10,
        totalPages: 1,
        total: 0
    },
    currentOrder: null,
    isLoading: false,

    fetchOrders: async (page = 1, limit = 10) => {
        set({ isLoading: true });
        try {
            const data: any = await orderService.getAll(page, limit);
            // Check if paginated
            if (data.docs) {
                set({
                    orders: data.docs,
                    pagination: {
                        page: data.page,
                        limit: data.limit,
                        totalPages: data.pages,
                        total: data.total
                    },
                    isLoading: false
                });
            } else if (Array.isArray(data)) {
                // Fallback
                set({ orders: data, isLoading: false });
            } else {
                set({ orders: [], isLoading: false });
            }
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
            // Optimistic update or refetch
            const currentOrders = get().orders;
            const updatedOrders = currentOrders.map(o =>
                o._id === id ? { ...o, status: 'CANCELLED' } : o
            );
            set({ orders: updatedOrders as Order[] });
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to cancel order');
            throw error;
        }
    },
}));
