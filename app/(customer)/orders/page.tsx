'use client';

import { useEffect } from 'react';
import { useOrderStore } from '@/store/slices/orderStore';
import { useAuthStore } from '@/store/slices/authStore';
import { Package, Calendar, MapPin, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
    const { orders, isLoading, fetchOrders } = useOrderStore();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, fetchOrders]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'SHIPPED':
                return 'bg-blue-100 text-blue-800';
            case 'PAID':
                return 'bg-purple-100 text-purple-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                    <Link
                        href="/products"
                        className="text-green-600 hover:text-green-700 font-medium"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {!orders || orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h2>
                        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                        <Link
                            href="/products"
                            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                            >
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Order Placed</p>
                                            <div className="flex items-center gap-1 text-gray-700">
                                                <Calendar className="w-3 h-3" />
                                                <span className="text-sm">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Total Amount</p>
                                            <p className="text-sm font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Order #</p>
                                            <p className="text-sm text-gray-700">{order.orderNumber}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-4 items-center">
                                                    <div className="bg-gray-100 w-12 h-12 rounded flex items-center justify-center text-gray-400">
                                                        <Package className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{item.name}</p>
                                                        <p className="text-sm text-gray-600">
                                                            Qty: {item.quantity} × ₹{item.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Delivery Info */}
                                        <div className="md:w-64 md:border-l md:pl-6">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <h3 className="font-semibold text-sm text-gray-900">Delivery Address</h3>
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>{order.deliveryAddress.street}</p>
                                                <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                                                <p>{order.deliveryAddress.zipCode}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
