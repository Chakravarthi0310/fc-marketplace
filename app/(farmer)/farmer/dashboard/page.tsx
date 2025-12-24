'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/slices/authStore';
import { productService } from '@/services/product.service';
import { orderService } from '@/services/order.service';
import { reviewService } from '@/services/review.service';
import { Plus, Package, ShoppingBag, Search, AlertCircle, Clock, CheckCircle, XCircle, LogOut, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import StatsOverview from '@/components/farmer/StatsOverview';
import ProductCard from '@/components/farmer/ProductCard';
import OrderCard from '@/components/farmer/OrderCard';
import FarmerReviewList from '@/components/farmer/FarmerReviewList';
import Pagination from '@/components/ui/Pagination';
import { Product } from '@/store/types';

type TabType = 'products' | 'orders' | 'reviews';

export default function FarmerDashboard() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [farmerProfile, setFarmerProfile] = useState<any>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('products');
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination State
    const [productsPagination, setProductsPagination] = useState({ page: 1, totalPages: 1 });
    const [ordersPagination, setOrdersPagination] = useState({ page: 1, totalPages: 1 });
    const [reviewsPagination, setReviewsPagination] = useState({ page: 1, totalPages: 1 });

    useEffect(() => {
        fetchFarmerProfile();
    }, []);


    useEffect(() => {
        if (farmerProfile?.verificationStatus === 'APPROVED') {
            fetchMyProducts();
            fetchMyOrders();
            fetchMyReviews();
        } else {
            setIsLoading(false);
        }
    }, [farmerProfile]);

    const fetchFarmerProfile = async () => {
        try {
            const { data } = await api.get('/farmers');
            setFarmerProfile(data.data);
        } catch (error: any) {
            if (error.response?.status === 404) {
                setFarmerProfile(null);
            } else {
                toast.error('Failed to fetch farmer profile');
            }
        } finally {
            setProfileLoading(false);
        }
    };

    const fetchMyProducts = async (page = 1) => {
        try {
            if (!farmerProfile?._id) return;
            const response: any = await productService.getAll({ farmerId: farmerProfile._id }, page, 8); // Limit 8 for grid
            setProducts(response.docs || []);
            setProductsPagination({
                page: response.page,
                totalPages: response.pages || response.totalPages
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMyOrders = async (page = 1) => {
        try {
            const response: any = await orderService.getFarmerOrders(page, 10);
            setOrders(response.docs || []);
            setOrdersPagination({
                page: response.page,
                totalPages: response.pages || response.totalPages
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders');
        }
    };

    const fetchMyReviews = async (page = 1) => {
        try {
            const response: any = await reviewService.getFarmerReviews(page, 10);
            setReviews(response.docs || []);
            setReviewsPagination({
                page: response.page,
                totalPages: response.pages || response.totalPages
            });
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to fetch reviews');
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await productService.delete(productId);
            toast.success('Product deleted successfully');
            fetchMyProducts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    };

    // Filter products based on search
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Initial Loading State
    if (profileLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    // No farmer profile - redirect to create profile
    if (!farmerProfile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Become a Seller</h2>
                    <p className="text-gray-600 mb-6">
                        Create your farmer profile to start selling your fresh produce directly to customers.
                    </p>
                    <button
                        onClick={() => router.push('/farmer/profile/create')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
                    >
                        Create Farmer Profile
                    </button>
                </div>
            </div>
        );
    }

    // Pending approval
    if (farmerProfile.verificationStatus === 'PENDING') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Under Review</h2>
                    <p className="text-gray-600 mb-4">
                        Your profile is currently being reviewed by our admin team. This usually takes 24-48 hours.
                    </p>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> You'll be notified via email once your account is approved.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Rejected
    if (farmerProfile.verificationStatus === 'REJECTED') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Status</h2>
                    <p className="text-gray-600 mb-4">
                        Unfortunately, your farmer profile was not approved at this time.
                    </p>
                    <button className="text-green-600 hover:text-green-700 font-medium">
                        Contact Support
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header Section */}
            <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center justify-between md:justify-start gap-4">
                            <div className="flex items-center gap-4">
                                <a href="/" className="flex items-center gap-2 group">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent group-hover:from-green-700 group-hover:to-emerald-700 transition-all duration-200">
                                        Farmcart
                                    </span>
                                </a>
                                <div className="h-6 w-[1px] bg-gray-200 hidden md:block"></div>
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                                    <p className="text-gray-500 text-xs mt-0.5">Welcome back, {farmerProfile.farmName}</p>
                                </div>
                            </div>
                            {/* Mobile Logout - Visible only on small screens next to title */}
                            <button
                                onClick={logout}
                                className="md:hidden text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition"
                                title="Logout"
                            >
                                <LogOut className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Desktop Logout */}
                            <button
                                onClick={logout}
                                className="hidden md:flex items-center gap-2 text-gray-500 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                            >
                                Logout
                            </button>

                            {activeTab === 'products' && (
                                <button
                                    onClick={() => router.push('/farmer/products/create')}
                                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg transition font-medium shadow-sm hover:shadow active:scale-95 duration-200 text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Product
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-6 mt-4 border-b-0 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors duration-200 flex items-center gap-2 ${activeTab === 'products'
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Package className="w-4 h-4" />
                            Products
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                {products.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors duration-200 flex items-center gap-2 ${activeTab === 'orders'
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Orders
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                {orders.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors duration-200 flex items-center gap-2 ${activeTab === 'reviews'
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Star className="w-4 h-4" />
                            Reviews
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                {reviews.length}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Overview */}
                <StatsOverview products={products} orders={orders} farmerId={farmerProfile?._id} />

                {activeTab === 'products' ? (
                    <div className="space-y-6">
                        {/* Search Bar */}
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition outline-none"
                            />
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    {searchQuery ? 'No products found' : 'No products listed yet'}
                                </h3>
                                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                    {searchQuery
                                        ? `We couldn't find any products matching "${searchQuery}"`
                                        : "Start building your catalog by adding your first product from the farm."
                                    }
                                </p>
                                {!searchQuery && (
                                    <button
                                        onClick={() => router.push('/farmer/products/create')}
                                        className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add your first product
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        onEdit={(id) => router.push(`/farmer/products/edit/${id}`)}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                        {filteredProducts.length > 0 && (
                            <Pagination
                                currentPage={productsPagination.page}
                                totalPages={productsPagination.totalPages}
                                onPageChange={(page) => fetchMyProducts(page)}
                            />
                        )}
                    </div>
                ) : activeTab === 'orders' ? (
                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No orders received yet</h3>
                                <p className="text-gray-500 mb-6">
                                    Orders will appear here once customers start buying your products.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <OrderCard
                                        key={order._id}
                                        order={order}
                                        farmerId={farmerProfile?._id}
                                    />
                                ))}
                            </div>
                        )}
                        {orders.length > 0 && (
                            <Pagination
                                currentPage={ordersPagination.page}
                                totalPages={ordersPagination.totalPages}
                                onPageChange={(page) => fetchMyOrders(page)}
                            />
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <FarmerReviewList reviews={reviews} />
                        {reviews.length > 0 && (
                            <Pagination
                                currentPage={reviewsPagination.page}
                                totalPages={reviewsPagination.totalPages}
                                onPageChange={(page) => fetchMyReviews(page)}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
