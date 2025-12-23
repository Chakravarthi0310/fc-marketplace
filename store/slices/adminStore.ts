import { create } from 'zustand';
import adminService, { Farmer, AdminOrder, Category, DashboardStats } from '@/services/admin.service';
import toast from 'react-hot-toast';

interface AdminState {
    // State
    farmers: Farmer[];
    orders: AdminOrder[];
    categories: Category[];
    stats: DashboardStats | null;
    isLoading: boolean;

    // Farmer Actions
    fetchAllFarmers: () => Promise<void>;
    fetchPendingFarmers: () => Promise<void>;
    approveFarmer: (farmerId: string) => Promise<void>;
    rejectFarmer: (farmerId: string) => Promise<void>;

    // Order Actions
    fetchAllOrders: (status?: string) => Promise<void>;
    updateOrderStatus: (orderId: string, status: string) => Promise<void>;

    // Category Actions
    fetchCategories: () => Promise<void>;
    createCategory: (data: { name: string; description: string }) => Promise<void>;
    updateCategory: (categoryId: string, data: { name: string; description: string }) => Promise<void>;
    deleteCategory: (categoryId: string) => Promise<void>;

    // Analytics Actions
    fetchDashboardStats: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
    // Initial State
    farmers: [],
    orders: [],
    categories: [],
    stats: null,
    isLoading: false,

    // Farmer Actions
    fetchAllFarmers: async () => {
        set({ isLoading: true });
        try {
            const farmers = await adminService.getAllFarmers();
            set({ farmers, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to fetch farmers');
            throw error;
        }
    },

    fetchPendingFarmers: async () => {
        set({ isLoading: true });
        try {
            const farmers = await adminService.getPendingFarmers();
            set({ farmers, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to fetch pending farmers');
            throw error;
        }
    },

    approveFarmer: async (farmerId: string) => {
        set({ isLoading: true });
        try {
            await adminService.approveFarmer(farmerId);
            // Refresh farmers list
            await get().fetchAllFarmers();
            toast.success('Farmer approved successfully');
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to approve farmer');
            throw error;
        }
    },

    rejectFarmer: async (farmerId: string) => {
        set({ isLoading: true });
        try {
            await adminService.rejectFarmer(farmerId);
            // Refresh farmers list
            await get().fetchAllFarmers();
            toast.success('Farmer rejected');
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to reject farmer');
            throw error;
        }
    },

    // Order Actions
    fetchAllOrders: async (status?: string) => {
        set({ isLoading: true });
        try {
            const orders = await adminService.getAllOrders(status);
            set({ orders, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to fetch orders');
            throw error;
        }
    },

    updateOrderStatus: async (orderId: string, status: string) => {
        set({ isLoading: true });
        try {
            await adminService.updateOrderStatus(orderId, status);
            // Refresh orders list
            await get().fetchAllOrders();
            toast.success('Order status updated');
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to update order status');
            throw error;
        }
    },

    // Category Actions
    fetchCategories: async () => {
        set({ isLoading: true });
        try {
            const categories = await adminService.getAllCategories();
            set({ categories, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to fetch categories');
            throw error;
        }
    },

    createCategory: async (data: { name: string; description: string }) => {
        set({ isLoading: true });
        try {
            await adminService.createCategory(data);
            // Refresh categories list
            await get().fetchCategories();
            toast.success('Category created successfully');
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to create category');
            throw error;
        }
    },

    updateCategory: async (categoryId: string, data: { name: string; description: string }) => {
        set({ isLoading: true });
        try {
            await adminService.updateCategory(categoryId, data);
            // Refresh categories list
            await get().fetchCategories();
            toast.success('Category updated successfully');
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to update category');
            throw error;
        }
    },

    deleteCategory: async (categoryId: string) => {
        set({ isLoading: true });
        try {
            await adminService.deleteCategory(categoryId);
            // Refresh categories list
            await get().fetchCategories();
            toast.success('Category deleted successfully');
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to delete category');
            throw error;
        }
    },

    // Analytics Actions
    fetchDashboardStats: async () => {
        set({ isLoading: true });
        try {
            const stats = await adminService.getDashboardStats();
            set({ stats, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to fetch dashboard stats');
            throw error;
        }
    },
}));
