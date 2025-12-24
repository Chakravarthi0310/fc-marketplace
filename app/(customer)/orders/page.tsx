'use client';

import { useState, useEffect } from 'react';
import { useOrderStore } from '@/store/slices/orderStore';
import { useAuthStore } from '@/store/slices/authStore';
import { useCartStore } from '@/store/slices/cartStore';
import { Package, Calendar, MapPin, Loader2, ArrowRight, Search, Filter, CheckCircle2, Truck, Clock, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Pagination from '@/components/ui/Pagination';
import toast from 'react-hot-toast';

export default function OrdersPage() {
    const { orders, isLoading, fetchOrders, pagination } = useOrderStore();
    const { addItem } = useCartStore(); // For Buy Again functionality
    const ordersPagination = pagination || { page: 1, totalPages: 1 };

    const { isAuthenticated, user } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, fetchOrders]);

    const handlePageChange = (page: number) => {
        fetchOrders(page);
    };

    const handleBuyAgain = async (items: any[]) => {
        try {
            const promises = items.map(item => addItem(item.productId._id || item.productId, 1));
            await Promise.all(promises);
            toast.success('All items added to cart!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add some items to cart');
        }
    };

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'PAYMENT_PENDING': return 0;
            case 'PAID': return 0; // Still processed as placed
            case 'CONFIRMED': return 1;
            case 'SHIPPED': return 2;
            case 'DELIVERED': return 3;
            case 'CANCELLED': return -1;
            default: return 0;
        }
    };

    const filteredOrders = orders?.filter(order => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    }) || [];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
                    <p className="text-gray-500 font-medium">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Orders</h1>
                            <p className="text-gray-500 mt-2 text-lg">Track, return, or buy things again.</p>
                        </div>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow-emerald-200 hover:scale-105 active:scale-95"
                        >
                            Start Shopping
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                {orders && orders.length > 0 && (
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        {/* Search */}
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search orders by ID or Product..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative md:w-64">
                            <button
                                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'STATUS' ? null : 'STATUS')}
                                className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm"
                            >
                                <span className={statusFilter === 'ALL' ? 'text-gray-600' : 'text-gray-900 font-medium'}>
                                    {statusFilter === 'ALL' ? 'Filter by Status' : statusFilter.replace(/_/g, ' ')}
                                </span>
                                <Filter className="h-4 w-4 text-gray-400" />
                            </button>

                            {activeFilterDropdown === 'STATUS' && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setActiveFilterDropdown(null)} />
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 max-h-60 overflow-y-auto">
                                        {['ALL', 'PAYMENT_PENDING', 'PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setStatusFilter(status);
                                                    setActiveFilterDropdown(null);
                                                }}
                                                className={`w-full text-left px-5 py-2.5 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${statusFilter === status ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600'}`}
                                            >
                                                {status === 'ALL' ? 'All Statuses' : status.replace(/_/g, ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {!filteredOrders || filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-12 h-12 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            {searchQuery || statusFilter !== 'ALL'
                                ? "No matching orders found"
                                : "No orders yet"}
                        </h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                            {searchQuery || statusFilter !== 'ALL'
                                ? "Try adjusting your search or filters to find what you're looking for."
                                : "Looks like you haven't placed an order yet. Explore our fresh collection and start your journey!"}
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200 hover:-translate-y-1"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredOrders.map((order) => {
                            const currentStep = getStatusStep(order.status);
                            const steps = [
                                { label: 'Placed', icon: Clock },
                                { label: 'Confirmed', icon: CheckCircle2 },
                                { label: 'Shipped', icon: Truck },
                                { label: 'Delivered', icon: Package }
                            ];

                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
                                >
                                    {/* Order Header */}
                                    <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100">
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex flex-wrap gap-x-8 gap-y-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Order Placed</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Total</p>
                                                    <p className="text-sm font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Order #</p>
                                                    <p className="text-sm font-mono text-gray-600">{order.orderNumber}</p>
                                                </div>
                                            </div>

                                            {/* Visual Stepper (Desktop) */}
                                            {order.status !== 'CANCELLED' && (
                                                <div className="hidden md:flex items-center flex-1 max-w-md ml-auto justify-end">
                                                    {steps.map((step, idx) => (
                                                        <div key={idx} className="flex items-center">
                                                            <div className={`flex flex-col items-center gap-1 ${idx <= currentStep ? 'text-emerald-600' : 'text-gray-300'}`}>
                                                                <step.icon className={`w-5 h-5 ${idx <= currentStep ? 'fill-emerald-100' : ''}`} />
                                                                <span className="text-[10px] font-bold uppercase tracking-wider">{step.label}</span>
                                                            </div>
                                                            {idx < steps.length - 1 && (
                                                                <div className={`w-12 h-0.5 mx-2 bg-gray-200 ${idx < currentStep ? 'bg-emerald-500' : ''}`} />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Simple Badge (Mobile/Cancelled) */}
                                            <div className={`${order.status !== 'CANCELLED' ? 'md:hidden' : ''}`}>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {order.status.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Content */}
                                    <div className="p-6">
                                        <div className="space-y-6">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-4 sm:gap-6">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                                                        {/* Ideally we'd have images here, using fallback for now */}
                                                        <Package className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 py-1">
                                                        <h3 className="font-semibold text-gray-900 truncate text-lg">{item.name}</h3>
                                                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                                            <p>Qty: {item.quantity}</p>
                                                            <p>Price: ₹{item.price.toLocaleString()}</p>
                                                        </div>
                                                        <p className="mt-2 text-sm font-medium text-emerald-600">
                                                            {order.status === 'DELIVERED' ? 'Delivered successfully' : 'Arriving soon'}
                                                        </p>
                                                    </div>
                                                    <div className="hidden sm:block text-right self-center">
                                                        <Link
                                                            href={`/products/${typeof item.productId === 'object' ? (item.productId as any)._id : item.productId}`}
                                                            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                                                        >
                                                            View Item
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <MapPin className="w-4 h-4" />
                                                <span>
                                                    Delivered to <span className="font-medium text-gray-900">{order.deliveryAddress.city}</span>
                                                </span>
                                            </div>

                                            <div className="flex w-full sm:w-auto gap-3">
                                                <Link
                                                    href={`/orders/${order._id}`}
                                                    className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors text-center text-sm"
                                                >
                                                    Track Package
                                                </Link>
                                                <button
                                                    onClick={() => handleBuyAgain(order.items)}
                                                    className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm text-center text-sm"
                                                >
                                                    Buy Again
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {orders && orders.length > 0 && (
                    <div className="mt-12">
                        <Pagination
                            currentPage={ordersPagination.page}
                            totalPages={ordersPagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
