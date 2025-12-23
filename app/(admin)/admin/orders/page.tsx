'use client';

import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/slices/adminStore';
import { Package, ChevronDown } from 'lucide-react';

type OrderStatus = 'ALL' | 'PAYMENT_PENDING' | 'PAID' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export default function OrdersPage() {
    const { orders, isLoading, fetchAllOrders, updateOrderStatus } = useAdminStore();
    const [statusFilter, setStatusFilter] = useState<OrderStatus>('ALL');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        const filter = statusFilter === 'ALL' ? undefined : statusFilter;
        fetchAllOrders(filter);
    }, [statusFilter, fetchAllOrders]);

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
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-600 mt-2">Monitor and manage all orders</p>
                </div>

                {/* Status Filter */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as OrderStatus)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                        <option value="ALL">All Orders</option>
                        <option value="PAYMENT_PENDING">Payment Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {!orders || orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <>
                                        <tr key={order._id} className="hover:bg-gray-50">
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
                                                        className="text-emerald-600 hover:text-emerald-900"
                                                    >
                                                        Details
                                                    </button>
                                                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                                                        <select
                                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                            className="text-xs border border-gray-300 rounded px-2 py-1"
                                                            defaultValue=""
                                                        >
                                                            <option value="" disabled>
                                                                Update Status
                                                            </option>
                                                            {order.status === 'PAYMENT_PENDING' && <option value="PAID">Mark as Paid</option>}
                                                            {order.status === 'PAID' && <option value="CONFIRMED">Confirm</option>}
                                                            {order.status === 'CONFIRMED' && <option value="SHIPPED">Ship</option>}
                                                            {order.status === 'SHIPPED' && <option value="DELIVERED">Deliver</option>}
                                                        </select>
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
                                                                        <span>
                                                                            {item.name} x {item.quantity} {item.unit}
                                                                        </span>
                                                                        <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                                                            <p className="text-sm text-gray-600">
                                                                {order.deliveryAddress.street}, {order.deliveryAddress.city}
                                                                <br />
                                                                {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                                                                <br />
                                                                Phone: {order.deliveryAddress.phone}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
