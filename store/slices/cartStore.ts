import { create } from 'zustand';
import { cartService } from '@/services/cart.service';
import { Cart } from '@/store/types';
import toast from 'react-hot-toast';

interface CartState {
    cart: Cart | null;
    isLoading: boolean;
    fetchCart: () => Promise<void>;
    addItem: (productId: string, quantity: number) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    cart: null,
    isLoading: false,

    fetchCart: async () => {
        set({ isLoading: true });
        try {
            const cart = await cartService.get();
            set({ cart, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false });
            if (error.response?.status !== 404) {
                toast.error('Failed to fetch cart');
            }
        }
    },

    addItem: async (productId, quantity) => {
        set({ isLoading: true });
        try {
            const cart = await cartService.addItem(productId, quantity);
            set({ cart, isLoading: false });
            toast.success('Item added to cart');
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to add item');
            throw error;
        }
    },

    updateQuantity: async (productId, quantity) => {
        set({ isLoading: true });
        try {
            const cart = await cartService.updateQuantity(productId, quantity);
            set({ cart, isLoading: false });
            toast.success('Quantity updated');
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to update quantity');
            throw error;
        }
    },

    removeItem: async (productId) => {
        set({ isLoading: true });
        try {
            const cart = await cartService.removeItem(productId);
            set({ cart, isLoading: false });
            toast.success('Item removed from cart');
        } catch (error: any) {
            set({ isLoading: false });
            toast.error('Failed to remove item');
            throw error;
        }
    },

    clearCart: () => {
        set({ cart: null });
    },
}));
