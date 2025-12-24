'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrderStore } from '@/store/slices/orderStore';
import { Package, Calendar, MapPin, Loader2, ArrowLeft, Truck, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function OrderDetailsPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { orders, fetchOrders } = useOrderStore(); // We might need a fetchOrderById but for now fetchOrders ensures we have data
    const [order, setOrder] = useState<any | null>(null);

    useEffect(() => {
        if (!orders || orders.length === 0) {
            fetchOrders();
        }
    }, [orders, fetchOrders]);

    useEffect(() => {
        if (orders) {
            const foundOrder = orders.find(o => o._id === id);
            setOrder(foundOrder || null);
        }
    }, [orders, id]);

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
            </div>
        );
    }

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

    const currentStep = getStatusStep(order.status);
    const steps = [
        { label: 'Order Placed', date: order.createdAt, icon: Clock },
        { label: 'Confirmed', date: null, icon: CheckCircle2 },
        { label: 'Shipped', date: null, icon: Truck },
        { label: 'Delivered', date: null, icon: Package }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/orders" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
                            <p className="text-sm text-gray-500">#{order.orderNumber}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Status Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>
                    <div className="relative">
                        {order.status === 'CANCELLED' ? (
                            <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl">
                                <span className="font-bold">Order Cancelled</span>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-4 relative">
                                        {/* Vertical Line */}
                                        {idx < steps.length - 1 && (
                                            <div className={`absolute left-[19px] top-10 bottom-[-24px] w-0.5 ${idx < currentStep ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                                        )}

                                        {/* Icon */}
                                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 ${idx <= currentStep
                                            ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                                            : 'bg-white border-gray-200 text-gray-300'
                                            }`}>
                                            <step.icon className="w-5 h-5" />
                                        </div>

                                        {/* Text */}
                                        <div className={`pt-2 ${idx <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                                            <p className="font-bold text-sm uppercase tracking-wide">{step.label}</p>
                                            {idx === 0 && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            )}
                                            {idx === currentStep && idx !== 0 && (
                                                <p className="text-xs text-emerald-600 font-medium mt-1">Current Status</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50">
                        <h2 className="text-lg font-bold text-gray-900">Items in Order</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="p-6 flex gap-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    ) : item.productId && typeof item.productId === 'object' && (item.productId as any).images?.[0] ? (
                                        <Image src={(item.productId as any).images[0]} alt={item.name} fill className="object-cover" />
                                    ) : (
                                        <Package className="w-8 h-8 text-emerald-200" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity} × ₹{item.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-medium text-gray-600">Total Amount</span>
                        <span className="font-bold text-xl text-gray-900">₹{order.totalAmount}</span>
                    </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
                    </div>
                    <address className="not-italic text-gray-600 leading-relaxed pl-7 border-l-2 border-gray-100">
                        {order.deliveryAddress.street}<br />
                        {order.deliveryAddress.city}, {order.deliveryAddress.state}<br />
                        <span className="font-medium text-gray-900">{order.deliveryAddress.zipCode}</span>
                    </address>
                </div>
            </div>
        </div>
    );
}
