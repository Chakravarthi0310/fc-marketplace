'use client';

import React, { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/slices/adminStore';
import { Package, ChevronDown, CreditCard, ClipboardCheck, Truck, CheckCircle, Search, Calendar, Filter } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';

type OrderStatus = 'ALL' | 'PAYMENT_PENDING' | 'PAID' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export default function OrdersPage() {
    const { orders, isLoading, fetchAllOrders, updateOrderStatus, pagination } = useAdminStore();
    const ordersPagination = pagination?.orders || { page: 1, totalPages: 1 };

    const handlePageChange = (page: number) => {
        fetchAllOrders(statusFilter === 'ALL' ? undefined : statusFilter, page);
    };
    const [statusFilter, setStatusFilter] = useState<OrderStatus>('ALL');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [activeActionId, setActiveActionId] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState('ALL');

    const [activeFilterDropdown, setActiveFilterDropdown] = useState<'STATUS' | 'DATE' | null>(null);

    useEffect(() => {
        const filter = statusFilter === 'ALL' ? undefined : statusFilter;
        fetchAllOrders(filter);
    }, [statusFilter, fetchAllOrders]);

    const filteredOrders = orders?.filter(order => {
        // Search Filter
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            (order.orderNumber?.toLowerCase() || '').includes(query) ||
            (order.userId?.name?.toLowerCase() || '').includes(query) ||
            (order.userId?.email?.toLowerCase() || '').includes(query);

        if (!matchesSearch) return false;

        // Date Filter
        if (dateRange === 'ALL') return true;

        const orderDate = new Date(order.createdAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateRange === 'TODAY') {
            return orderDate >= today;
        }

        if (dateRange === 'YESTERDAY') {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const tomorrow = new Date(today); // Today 00:00 is technically "tomorrow" relative to yesterday's full day if we want strict, but usually "Yesterday" implies the day before today.
            // Let's do strictly > yesterday 00:00 and < today 00:00
            const yesterdayStart = new Date(yesterday);
            return orderDate >= yesterdayStart && orderDate < today;
        }

        if (dateRange === 'LAST_7_DAYS') {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return orderDate >= sevenDaysAgo;
        }

        if (dateRange === 'LAST_30_DAYS') {
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return orderDate >= thirtyDaysAgo;
        }

        return true;
    });

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        if (confirm(`Update order status to ${newStatus}?`)) {
            await updateOrderStatus(orderId, newStatus);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'SHIPPED':
                return 'bg-blue-100 text-blue-800';
            case 'CONFIRMED':
                return 'bg-purple-100 text-purple-800';
            case 'PAID':
                return 'bg-indigo-100 text-indigo-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-600 mt-2">Monitor and manage all orders</p>
                </div>

                {/* Mobile Filter Toggle */}
                <div className="md:hidden mb-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 p-3 rounded-lg text-gray-700 font-medium shadow-sm active:bg-gray-50 transition-colors"
                    >
                        <Filter className="w-5 h-5" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                {/* Filters Section */}
                <div className={`mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100 ${showFilters ? 'block' : 'hidden md:block'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Order #, Name or Email"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Status Filter Custom Dropdown */}
                        <div className="relative">
                            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Status</label>
                            <div className="relative">
                                <button
                                    onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'STATUS' ? null : 'STATUS')}
                                    className="w-full flex items-center justify-between pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                >
                                    <div className="flex items-center">
                                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <span className={statusFilter === 'ALL' ? 'text-gray-500' : 'text-gray-900 font-medium'}>
                                            {statusFilter === 'ALL' ? 'All Statuses' : statusFilter}
                                        </span>
                                    </div>
                                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${activeFilterDropdown === 'STATUS' ? 'rotate-180' : ''}`} />
                                </button>

                                {activeFilterDropdown === 'STATUS' && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setActiveFilterDropdown(null)} />
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-20 max-h-60 overflow-y-auto py-1">
                                            {['ALL', 'PAYMENT_PENDING', 'PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => {
                                                        setStatusFilter(status as OrderStatus);
                                                        setActiveFilterDropdown(null);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${statusFilter === status ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'}`}
                                                >
                                                    {status === 'ALL' ? 'All Statuses' : status}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Date Filter Custom Dropdown */}
                        <div className="relative">
                            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Time Period</label>
                            <div className="relative">
                                <button
                                    onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'DATE' ? null : 'DATE')}
                                    className="w-full flex items-center justify-between pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                >
                                    <div className="flex items-center">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <span className={dateRange === 'ALL' ? 'text-gray-500' : 'text-gray-900 font-medium'}>
                                            {dateRange === 'ALL' ? 'All Time' :
                                                dateRange === 'TODAY' ? 'Today' :
                                                    dateRange === 'YESTERDAY' ? 'Yesterday' :
                                                        dateRange.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                        </span>
                                    </div>
                                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${activeFilterDropdown === 'DATE' ? 'rotate-180' : ''}`} />
                                </button>

                                {activeFilterDropdown === 'DATE' && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setActiveFilterDropdown(null)} />
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1">
                                            {[
                                                { label: 'All Time', value: 'ALL' },
                                                { label: 'Today', value: 'TODAY' },
                                                { label: 'Yesterday', value: 'YESTERDAY' },
                                                { label: 'Last 7 Days', value: 'LAST_7_DAYS' },
                                                { label: 'Last 30 Days', value: 'LAST_30_DAYS' }
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setDateRange(option.value);
                                                        setActiveFilterDropdown(null);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${dateRange === option.value ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'}`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Table View (Hidden on mobile) */}
                <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {!filteredOrders || filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center p-4">
                                                <Search className="h-8 w-8 text-gray-300 mb-2" />
                                                <p>No orders found matching your filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <React.Fragment key={order._id}>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Package className="h-5 w-5 text-gray-400 mr-2" />
                                                        <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{order.userId.name}</div>
                                                    <div className="text-sm text-gray-500">{order.userId.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                                            className="text-xs font-medium text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md transition-colors"
                                                        >
                                                            Details
                                                        </button>
                                                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => setActiveActionId(activeActionId === order._id ? null : order._id)}
                                                                    className="flex items-center gap-1 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md px-3 py-1.5 transition-colors shadow-sm"
                                                                >
                                                                    Actions
                                                                    <ChevronDown className="h-3 w-3 text-gray-400" />
                                                                </button>

                                                                {activeActionId === order._id && (
                                                                    <>
                                                                        <div
                                                                            className="fixed inset-0 z-40"
                                                                            onClick={() => setActiveActionId(null)}
                                                                        />
                                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 overflow-hidden">
                                                                            {order.status === 'PAYMENT_PENDING' && (
                                                                                <button
                                                                                    onClick={() => {
                                                                                        handleStatusUpdate(order._id, 'PAID');
                                                                                        setActiveActionId(null);
                                                                                    }}
                                                                                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors flex items-center gap-2"
                                                                                >
                                                                                    <CreditCard className="w-4 h-4" />
                                                                                    Mark as Paid
                                                                                </button>
                                                                            )}
                                                                            {order.status === 'PAID' && (
                                                                                <button
                                                                                    onClick={() => {
                                                                                        handleStatusUpdate(order._id, 'CONFIRMED');
                                                                                        setActiveActionId(null);
                                                                                    }}
                                                                                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors flex items-center gap-2"
                                                                                >
                                                                                    <ClipboardCheck className="w-4 h-4" />
                                                                                    Confirm Order
                                                                                </button>
                                                                            )}
                                                                            {order.status === 'CONFIRMED' && (
                                                                                <button
                                                                                    onClick={() => {
                                                                                        handleStatusUpdate(order._id, 'SHIPPED');
                                                                                        setActiveActionId(null);
                                                                                    }}
                                                                                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                                                                                >
                                                                                    <Truck className="w-4 h-4" />
                                                                                    Mark Shipped
                                                                                </button>
                                                                            )}
                                                                            {order.status === 'SHIPPED' && (
                                                                                <button
                                                                                    onClick={() => {
                                                                                        handleStatusUpdate(order._id, 'DELIVERED');
                                                                                        setActiveActionId(null);
                                                                                    }}
                                                                                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors flex items-center gap-2"
                                                                                >
                                                                                    <CheckCircle className="w-4 h-4" />
                                                                                    Mark Delivered
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedOrder === order._id && (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-4 bg-gray-50">
                                                        <div className="space-y-4">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                                                                <div className="space-y-2">
                                                                    {order.items.map((item, idx) => (
                                                                        <div key={idx} className="flex justify-between text-sm">
                                                                            <span>{item.name} x {item.quantity} {item.unit}</span>
                                                                            <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                                                                <p className="text-sm text-gray-600">
                                                                    {order.deliveryAddress.street}, {order.deliveryAddress.city}<br />
                                                                    {order.deliveryAddress.state} - {order.deliveryAddress.pincode}<br />
                                                                    Phone: {order.deliveryAddress.phone}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {!filteredOrders || filteredOrders.length === 0 ? (
                        <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-gray-100">
                            <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No orders found</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Package className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium text-gray-900">{order.orderNumber}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="border-t border-gray-50 py-3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Customer</span>
                                        <span className="text-gray-900 font-medium">{order.userId.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Total</span>
                                        <span className="text-gray-900 font-bold">₹{order.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-50">
                                    <button
                                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                        className="flex-1 text-center py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg"
                                    >
                                        {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                                    </button>
                                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                                        <div className="relative flex-1">
                                            <button
                                                onClick={() => setActiveActionId(activeActionId === order._id ? null : order._id)}
                                                className="w-full flex items-center justify-center gap-1 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg"
                                            >
                                                Actions <ChevronDown className="h-3 w-3" />
                                            </button>
                                            {activeActionId === order._id && (
                                                <>
                                                    <div className="fixed inset-0 z-40" onClick={() => setActiveActionId(null)} />
                                                    <div className="absolute bottom-full right-0 mb-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                                                        {order.status === 'PAYMENT_PENDING' && (
                                                            <button onClick={() => { handleStatusUpdate(order._id, 'PAID'); setActiveActionId(null); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Mark Paid</button>
                                                        )}
                                                        {order.status === 'PAID' && (
                                                            <button onClick={() => { handleStatusUpdate(order._id, 'CONFIRMED'); setActiveActionId(null); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><ClipboardCheck className="w-4 h-4" /> Confirm</button>
                                                        )}
                                                        {order.status === 'CONFIRMED' && (
                                                            <button onClick={() => { handleStatusUpdate(order._id, 'SHIPPED'); setActiveActionId(null); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Truck className="w-4 h-4" /> Ship</button>
                                                        )}
                                                        {order.status === 'SHIPPED' && (
                                                            <button onClick={() => { handleStatusUpdate(order._id, 'DELIVERED'); setActiveActionId(null); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Deliver</button>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Expanded Mobile Details */}
                                {expandedOrder === order._id && (
                                    <div className="mt-3 pt-3 border-t border-gray-100 bg-gray-50 -mx-4 px-4 pb-4 rounded-b-lg">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wide">Items</h4>
                                                <div className="space-y-2">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-sm bg-white p-2 rounded border border-gray-200">
                                                            <span className="text-gray-700">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                                            <span className="font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wide">Delivery</h4>
                                                <div className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-600">
                                                    <p>{order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
                                                    <p>{order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
                                                    <p className="mt-1 font-medium text-gray-900 flex items-center gap-1"><span className="text-gray-400">📞</span> {order.deliveryAddress.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <Pagination
                    currentPage={ordersPagination.page}
                    totalPages={ordersPagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
