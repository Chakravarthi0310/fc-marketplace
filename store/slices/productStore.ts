import { create } from 'zustand';
import { productService } from '@/services/product.service';
import { Product } from '@/store/types';
import toast from 'react-hot-toast';

interface PaginationMeta {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
}

interface ProductState {
    products: Product[];
    pagination: PaginationMeta;
    selectedProduct: Product | null;
    isLoading: boolean;
    fetchProducts: (query?: any, page?: number, limit?: number) => Promise<void>;
    fetchProductById: (id: string) => Promise<void>;
    setSelectedProduct: (product: Product | null) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    pagination: {
        page: 1,
        limit: 10,
        totalPages: 1,
        total: 0
    },
    selectedProduct: null,
    isLoading: false,

    fetchProducts: async (query = {}, page = 1, limit = 10) => {
        set({ isLoading: true });
        try {
            const response = await productService.getAll(query, page, limit);
            const data: any = response;

            if (data.docs) {
                set({
                    products: data.docs,
                    pagination: {
                        page: data.page,
                        limit: data.limit,
                        totalPages: data.pages,
                        total: data.total
                    },
                    isLoading: false
                });
            } else if (Array.isArray(data)) {
                set({ products: data, isLoading: false });
            } else {
                set({ products: [], isLoading: false });
            }
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
