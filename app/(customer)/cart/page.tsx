'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/slices/cartStore';
import { useAuthStore } from '@/store/slices/authStore';
import { Trash2, Plus, Minus, ShoppingBag, Loader2, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { cart, isLoading, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

    const handleClear = async () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            await clearCart();
        }
    };

    const handleQuantityChange = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > 50) return;
        try {
            await updateQuantity(productId, newQuantity);
        } catch (error) {
            // Error handled by store
        }
    };

    const handleRemove = async (productId: string) => {
        try {
            await removeItem(productId);
        } catch (error) {
            // Error handled by store
        }
    };

    const handleCheckout = () => {
        router.push('/checkout');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
                    <p className="text-gray-500 font-medium">Loading your cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                            {cart && cart.items.length > 0 && (
                                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                                    {cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'}
                                </span>
                            )}
                        </div>
                        {cart && cart.items.length > 0 && (
                            <button
                                onClick={handleClear}
                                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Clear Cart</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!cart || cart.items.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center max-w-2xl mx-auto mt-8">
                        <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-12 h-12 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 text-lg">
                            Looks like you haven't added anything to your cart yet.
                            <br />Explore our products to find something you like!
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200 hover:-translate-y-1"
                        >
                            Start Shopping
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="flex-1 w-full space-y-4">
                            {cart.items.map((item, index) => (
                                <div
                                    key={item.productId?._id || index}
                                    className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 flex gap-4 sm:gap-6 border border-gray-100 hover:border-emerald-100 transition-colors"
                                >
                                    {/* Product Image */}
                                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                                        {item.productId?.images && item.productId.images.length > 0 ? (
                                            <Image
                                                src={item.productId.images[0]}
                                                alt={item.productId?.name || 'Product'}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <ShoppingBag className="w-8 h-8 opacity-50" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                                                    <Link href={`/products/${item.productId?._id}`} className="hover:text-emerald-600 transition-colors">
                                                        {item.productId?.name || 'Unknown Product'}
                                                    </Link>
                                                </h3>
                                                <p className="text-lg font-bold text-gray-900 shrink-0">
                                                    ₹{((item.productId?.price || 0) * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Unit Price: ₹{item.productId?.price || 0} / {item.productId?.unit || 'unit'}
                                            </p>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                                <button
                                                    onClick={() => item.productId?._id && handleQuantityChange(item.productId._id, item.quantity - 1)}
                                                    className="p-2 hover:bg-white hover:text-emerald-600 rounded-l-lg transition-colors disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-semibold text-gray-900 text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => item.productId?._id && handleQuantityChange(item.productId._id, item.quantity + 1)}
                                                    className="p-2 hover:bg-white hover:text-emerald-600 rounded-r-lg transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => item.productId?._id && handleRemove(item.productId._id)}
                                                className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all flex items-center gap-1 text-sm font-medium"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="hidden sm:inline">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:w-96 w-full flex-shrink-0">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({cart.items.length} items)</span>
                                        <span className="font-medium">₹{cart?.subtotal?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery Charges</span>
                                        <span className="text-emerald-600 font-medium">Free</span>
                                    </div>
                                    <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-baseline">
                                        <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                        <span className="text-2xl font-bold text-emerald-700">₹{cart?.total?.toFixed(2) || '0.00'}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 text-center">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <span>Safe & Secure Checkout</span>
                                    </div>

                                    <Link
                                        href="/products"
                                        className="flex items-center justify-center gap-2 w-full text-gray-600 hover:text-emerald-600 font-medium py-2 transition-colors text-sm"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
