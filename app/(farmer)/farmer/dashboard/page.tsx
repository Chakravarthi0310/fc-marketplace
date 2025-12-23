'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/slices/authStore';
import { productService } from '@/services/product.service';
import { orderService } from '@/services/order.service';
import { Plus, Package, Edit, Trash2, AlertCircle, Clock, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

type TabType = 'products' | 'orders';

export default function FarmerDashboard() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [farmerProfile, setFarmerProfile] = useState<any>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('products');

    useEffect(() => {
        fetchFarmerProfile();
    }, []);

    useEffect(() => {
        if (farmerProfile?.verificationStatus === 'APPROVED') {
            fetchMyProducts();
            fetchMyOrders();
        } else {
            setIsLoading(false);
        }
    }, [farmerProfile]);

    const fetchFarmerProfile = async () => {
        try {
            const { data } = await api.get('/farmers');
            setFarmerProfile(data.data);
        } catch (error: any) {
            // No profile exists
            if (error.response?.status === 404) {
                setFarmerProfile(null);
            } else {
                toast.error('Failed to fetch farmer profile');
            }
        } finally {
            setProfileLoading(false);
        }
    };

    const fetchMyProducts = async () => {
        try {
            const allProducts = await productService.getAll();
            console.log('All products:', allProducts);
            console.log('Farmer profile ID:', farmerProfile?._id);

            // Filter products by current farmer's farmerId (convert to string for comparison)
            const myProducts = allProducts.filter((p: any) => {
                console.log('Product farmerId:', p.farmerId, 'Farmer ID:', farmerProfile?._id);
                return p.farmerId?.toString() === farmerProfile?._id?.toString();
            });

            console.log('My products:', myProducts);
            setProducts(myProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMyOrders = async () => {
        try {
            const farmerOrders = await orderService.getFarmerOrders();
            setOrders(farmerOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders');
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

    // Show loading state
    if (profileLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    // No farmer profile - redirect to create profile
    if (!farmerProfile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Farmer Profile</h2>
                    <p className="text-gray-600 mb-6">
                        You need to create a farmer profile before you can list products.
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
                    <Clock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Pending Approval</h2>
                    <p className="text-gray-600 mb-4">
                        Your farmer profile is currently under review by our admin team.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                        <p className="text-sm text-blue-800">
                            <strong>Farm Name:</strong> {farmerProfile.farmName}
                            <br />
                            <strong>Phone:</strong> {farmerProfile.phone}
                            <br />
                            <strong>Address:</strong> {farmerProfile.address}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        You'll be able to list products once your profile is approved.
                    </p>
                </div>
            </div>
        );
    }

    // Rejected
    if (farmerProfile.verificationStatus === 'REJECTED') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Rejected</h2>
                    <p className="text-gray-600 mb-4">
                        Unfortunately, your farmer profile was not approved.
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left mb-4">
                        <p className="text-sm text-red-800">
                            Please contact support for more information or to resubmit your application.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Approved - show dashboard
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
                            <p className="text-gray-600 mt-1">Manage your products and orders</p>
                        </div>
                        {activeTab === 'products' && (
                            <button
                                onClick={() => router.push('/farmer/products/create')}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
                            >
                                <Plus className="w-5 h-5" />
                                Add Product
                            </button>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 border-b">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition ${activeTab === 'products'
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Package className="w-5 h-5" />
                            Products ({products.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition ${activeTab === 'orders'
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Orders ({orders.length})
                        </button>
                    </div>
                </div>
            </div>


            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === 'products' ? (
                    /* Products Grid */
                    isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Loading...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h2>
                            <p className="text-gray-600 mb-6">Start by adding your first product</p>
                            <button
                                onClick={() => router.push('/farmer/products/create')}
                                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
                            >
                                <Plus className="w-5 h-5" />
                                Add Product
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    {/* Product Image */}
                                    <div className="relative h-48 bg-gray-200">
                                        {product.images && product.images.length > 0 ? (
                                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Package className="w-12 h-12" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg text-gray-900 mb-1">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                                                <span className="text-gray-500 text-sm">/{product.unit}</span>
                                            </div>
                                            <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => router.push(`/farmer/products/edit/${product._id}`)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    /* Orders View */
                    orders.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
                            <p className="text-gray-600">Orders containing your products will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order: any) => (
                                <div key={order._id} className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">Order #{order._id.slice(-8)}</h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="border-t pt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Your Items:</p>
                                        {order.items?.filter((item: any) =>
                                            item.farmerId?.toString() === farmerProfile?._id?.toString()
                                        ).map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between text-sm py-2">
                                                <span className="text-gray-600">
                                                    {item.name} × {item.quantity}
                                                </span>
                                                <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t mt-4 pt-4 flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total Amount</span>
                                        <span className="text-lg font-bold text-gray-900">₹{order.totalAmount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
