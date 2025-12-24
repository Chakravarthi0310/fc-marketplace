import { create } from 'zustand';
import adminService, { Farmer, AdminOrder, Category, DashboardStats } from '@/services/admin.service';
import toast from 'react-hot-toast';

interface PaginationMeta {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
}

interface AdminState {
    // State
    farmers: Farmer[];
    orders: AdminOrder[];
    categories: Category[];
    stats: DashboardStats | null;
    isLoading: boolean;
    pagination: {
        farmers: PaginationMeta;
        orders: PaginationMeta;
    };

    // Farmer Actions
    fetchAllFarmers: (page?: number, limit?: number) => Promise<void>;
    fetchPendingFarmers: (page?: number, limit?: number) => Promise<void>;
    approveFarmer: (farmerId: string) => Promise<void>;
    rejectFarmer: (farmerId: string) => Promise<void>;

    // Order Actions
    fetchAllOrders: (status?: string, page?: number, limit?: number) => Promise<void>;
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
    pagination: {
        farmers: { page: 1, limit: 10, totalPages: 1, total: 0 },
        orders: { page: 1, limit: 10, totalPages: 1, total: 0 },
    },

    // Farmer Actions
    fetchAllFarmers: async (page = 1, limit = 10) => {
        set({ isLoading: true });
        try {
            const response = await adminService.getAllFarmers(page, limit);
            // Check if response has pagination structure (docs) or legacy array
            const data = response.data || response;
            const farmers = Array.isArray(data) ? data : data.docs || [];

            // Should be paginated now
            if (!Array.isArray(data) && data.docs) {
                set({
                    farmers: data.docs,
                    pagination: {
                        ...get().pagination,
                        farmers: {
                            page: data.page,
                            limit: data.limit,
                            totalPages: data.pages,
                            total: data.total
                        }
                    },
                    isLoading: false
                });
            } else {
                set({ farmers, isLoading: false });
            }
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to fetch farmers');
            throw error;
        }
    },

    fetchPendingFarmers: async (page = 1, limit = 10) => {
        set({ isLoading: true });
        try {
            const response = await adminService.getPendingFarmers(page, limit);
            const data = response.data || response;
            if (!Array.isArray(data) && data.docs) {
                set({
                    farmers: data.docs,
                    pagination: {
                        ...get().pagination,
                        farmers: {
                            page: data.page,
                            limit: data.limit,
                            totalPages: data.pages,
                            total: data.total
                        }
                    },
                    isLoading: false
                });
            } else {
                set({ farmers: Array.isArray(data) ? data : [], isLoading: false });
            }
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
    fetchAllOrders: async (status, page = 1, limit = 10) => {
        set({ isLoading: true });
        try {
            const response = await adminService.getAllOrders(status, page, limit);
            const data = response.data || response;
            if (!Array.isArray(data) && data.docs) {
                set({
                    orders: data.docs,
                    pagination: {
                        ...get().pagination,
                        orders: {
                            page: data.page,
                            limit: data.limit,
                            totalPages: data.pages,
                            total: data.total
                        }
                    },
                    isLoading: false
                });
            } else {
                set({ orders: Array.isArray(data) ? data : [], isLoading: false });
            }
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
