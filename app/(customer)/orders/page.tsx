'use client';

import { useState, useEffect } from 'react';
import { useOrderStore } from '@/store/slices/orderStore';
import { useAuthStore } from '@/store/slices/authStore';
import { Package, Calendar, MapPin, Loader2, ArrowRight, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import Pagination from '@/components/ui/Pagination';

export default function OrdersPage() {
    const { orders, isLoading, fetchOrders, pagination } = useOrderStore();
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
            case 'SHIPPED':
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'PAID':
            case 'CONFIRMED':
                return 'bg-purple-100 text-purple-800 border border-purple-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border border-red-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
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
                <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-gray-500 mt-1">Track and manage your recent purchases</p>
                    </div>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                        Continue Shopping
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>

                {/* Filters */}
                {orders && orders.length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by Order # or Product Name"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="relative md:w-64">
                                <button
                                    onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'STATUS' ? null : 'STATUS')}
                                    className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                >
                                    <span className={statusFilter === 'ALL' ? 'text-gray-700' : 'text-gray-900 font-medium'}>
                                        {statusFilter === 'ALL' ? 'All Statuses' : statusFilter.replace(/_/g, ' ')}
                                    </span>
                                    <Filter className="h-4 w-4 text-gray-400" />
                                </button>

                                {activeFilterDropdown === 'STATUS' && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setActiveFilterDropdown(null)} />
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1 max-h-60 overflow-y-auto">
                                            {['ALL', 'PAYMENT_PENDING', 'PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => {
                                                        setStatusFilter(status);
                                                        setActiveFilterDropdown(null);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${statusFilter === status ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'}`}
                                                >
                                                    {status === 'ALL' ? 'All Statuses' : status.replace(/_/g, ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {!filteredOrders || filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {searchQuery || statusFilter !== 'ALL'
                                ? "We couldn't find any orders matching your filters. Try adjusting your search."
                                : "You haven't placed any orders yet. Start shopping to get fresh produce delivered!"}
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
                            >
                                {/* Order Header - Responsive Grid */}
                                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order Placed</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total</p>
                                                <p className="text-sm font-bold text-gray-900 mt-0.5">₹{order.totalAmount.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order #</p>
                                                <p className="text-sm font-medium text-gray-700 mt-0.5 font-mono">{order.orderNumber}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Content */}
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-8">
                                        {/* Items */}
                                        <div className="flex-1 space-y-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                                    <div className="bg-emerald-50 w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center text-emerald-600">
                                                        <Package className="w-8 h-8 opacity-75" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 truncate pr-4">{item.name}</h3>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Quantity: <span className="font-medium text-gray-900">{item.quantity}</span>
                                                            <span className="mx-2 text-gray-300">|</span>
                                                            Price: <span className="font-medium text-gray-900">₹{item.price.toLocaleString()}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Delivery Info - Card style for contrast */}
                                        <div className="lg:w-80 bg-gray-50 rounded-xl p-5 h-fit border border-gray-100">
                                            <div className="flex items-center gap-2 mb-3 text-gray-900">
                                                <MapPin className="w-5 h-5 text-emerald-600" />
                                                <h3 className="font-semibold">Delivery Details</h3>
                                            </div>
                                            <address className="text-sm text-gray-600 not-italic leading-relaxed">
                                                <span className="block font-medium text-gray-900 mb-1">{user?.name}</span>
                                                {order.deliveryAddress.street}<br />
                                                {order.deliveryAddress.city}, {order.deliveryAddress.state}<br />
                                                <span className="text-gray-900 font-medium">{order.deliveryAddress.zipCode}</span>
                                            </address>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {orders && orders.length > 0 && (
                    <Pagination
                        currentPage={ordersPagination.page}
                        totalPages={ordersPagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}
