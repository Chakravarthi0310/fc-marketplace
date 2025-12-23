import { create } from 'zustand';
import { productService } from '@/services/product.service';
import { Product } from '@/store/types';
import toast from 'react-hot-toast';

interface ProductState {
    products: Product[];
    selectedProduct: Product | null;
    isLoading: boolean;
    fetchProducts: () => Promise<void>;
    fetchProductById: (id: string) => Promise<void>;
    setSelectedProduct: (product: Product | null) => void;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    selectedProduct: null,
    isLoading: false,

    fetchProducts: async () => {
        set({ isLoading: true });
        try {
            const products = await productService.getAll();
            set({ products, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            toast.error('Failed to fetch products');
        }
    },

    fetchProductById: async (id) => {
        set({ isLoading: true });
        try {
            const product = await productService.getById(id);
            set({ selectedProduct: product, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            toast.error('Failed to fetch product');
        }
    },

    setSelectedProduct: (product) => {
        set({ selectedProduct: product });
    },
}));
