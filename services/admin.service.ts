import axios from '@/lib/axios';

export interface Farmer {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    farmName: string;
    farmAddress: string;
    farmSize: number;
    farmingType: string;
    experience: number;
    verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
}

export interface AdminOrder {
    _id: string;
    orderNumber: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    items: OrderItem[];
    totalAmount: number;
    status: 'PAYMENT_PENDING' | 'PAID' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    deliveryAddress: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    pendingFarmers: number;
    activeProducts: number;
    recentOrders: AdminOrder[];
    pendingFarmersList: Farmer[];
}

const adminService = {
    // Farmer Management
    getAllFarmers: async (page = 1, limit = 10): Promise<any> => {
        const response = await axios.get('/farmers/admin/all', { params: { page, limit } });
        return response.data; // Return full response data which includes { success, data: { docs, total... } }
    },

    getPendingFarmers: async (page = 1, limit = 10): Promise<any> => {
        const response = await axios.get('/farmers/admin/pending', { params: { page, limit } });
        return response.data;
    },

    approveFarmer: async (farmerId: string): Promise<Farmer> => {
        const response = await axios.patch(`/farmers/verify/${farmerId}`, { status: 'APPROVED' });
        return response.data.data;
    },

    rejectFarmer: async (farmerId: string): Promise<Farmer> => {
        const response = await axios.patch(`/farmers/verify/${farmerId}`, { status: 'REJECTED' });
        return response.data.data;
    },

    // Order Management
    getAllOrders: async (status?: string, page = 1, limit = 10): Promise<any> => {
        const params: any = { page, limit };
        if (status) params.status = status;
        const response = await axios.get('/orders/admin/all', { params });
        return response.data;
    },

    updateOrderStatus: async (orderId: string, status: string): Promise<AdminOrder> => {
        const response = await axios.patch(`/orders/${orderId}/status`, { status });
        return response.data.data;
    },

    // Category Management
    getAllCategories: async (): Promise<Category[]> => {
        const response = await axios.get('/categories');
        return response.data.data;
    },

    createCategory: async (data: { name: string; description: string }): Promise<Category> => {
        const response = await axios.post('/categories', data);
        return response.data.data;
    },

    updateCategory: async (categoryId: string, data: { name: string; description: string }): Promise<Category> => {
        const response = await axios.put(`/categories/${categoryId}`, data);
        return response.data.data;
    },

    deleteCategory: async (categoryId: string): Promise<void> => {
        await axios.delete(`/categories/${categoryId}`);
    },

    // Analytics
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await axios.get('/admin/analytics');
        return response.data.data;
    },
};

export default adminService;
