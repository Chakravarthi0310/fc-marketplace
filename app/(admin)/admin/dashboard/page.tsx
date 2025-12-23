'use client';

import { useEffect } from 'react';
import { useAdminStore } from '@/store/slices/adminStore';
import StatsCard from '@/components/admin/StatsCard';
import { Package, DollarSign, Users, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { stats, isLoading, fetchDashboardStats } = useAdminStore();

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Manage your marketplace</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Orders"
                        value={stats?.totalOrders || 0}
                        icon={ShoppingCart}
                        iconColor="text-blue-600"
                        bgColor="bg-blue-100"
                    />
                    <StatsCard
                        title="Total Revenue"
                        value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
                        icon={DollarSign}
                        iconColor="text-green-600"
                        bgColor="bg-green-100"
                    />
                    <StatsCard
                        title="Pending Farmers"
                        value={stats?.pendingFarmers || 0}
                        icon={Users}
                        iconColor="text-orange-600"
                        bgColor="bg-orange-100"
                    />
                    <StatsCard
                        title="Active Products"
                        value={stats?.activeProducts || 0}
                        icon={Package}
                        iconColor="text-purple-600"
                        bgColor="bg-purple-100"
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        href="/admin/farmers"
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Farmer Verification</h3>
                                <p className="text-sm text-gray-600 mt-1">Approve or reject farmers</p>
                            </div>
                            <Users className="w-8 h-8 text-orange-600" />
                        </div>
                    </Link>

                    <Link
                        href="/admin/orders"
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Order Management</h3>
                                <p className="text-sm text-gray-600 mt-1">Monitor and update orders</p>
                            </div>
                            <ShoppingCart className="w-8 h-8 text-blue-600" />
                        </div>
                    </Link>

                    <Link
                        href="/admin/categories"
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Category Management</h3>
                                <p className="text-sm text-gray-600 mt-1">Manage product categories</p>
                            </div>
                            <Package className="w-8 h-8 text-purple-600" />
                        </div>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentOrders.slice(0, 5).map((order) => (
                                    <div key={order._id} className="flex items-center justify-between border-b pb-3">
                                        <div>
                                            <p className="font-medium text-gray-900">{order.orderNumber}</p>
                                            <p className="text-sm text-gray-600">{order.userId.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">₹{order.totalAmount}</p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${order.status === 'DELIVERED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : order.status === 'CANCELLED'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent orders</p>
                        )}
                    </div>

                    {/* Pending Farmers */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Farmer Approvals</h3>
                        {stats?.pendingFarmersList && stats.pendingFarmersList.length > 0 ? (
                            <div className="space-y-3">
                                {stats.pendingFarmersList.slice(0, 5).map((farmer) => (
                                    <div key={farmer._id} className="flex items-center justify-between border-b pb-3">
                                        <div>
                                            <p className="font-medium text-gray-900">{farmer.userId.name}</p>
                                            <p className="text-sm text-gray-600">{farmer.farmName}</p>
                                        </div>
                                        <Link
                                            href="/admin/farmers"
                                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                        >
                                            Review →
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No pending approvals</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
