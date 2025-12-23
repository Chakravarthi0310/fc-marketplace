'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/slices/cartStore';
import { useAuthStore } from '@/store/slices/authStore';
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';
import Image from 'next/image';

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
                <Loader2 className="w-12 h-12 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    {cart && cart.items.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
                        >
                            <Trash2 className="w-5 h-5" />
                            Clear Cart
                        </button>
                    )}
                </div>

                {!cart || cart.items.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add some products to get started</p>
                        <a
                            href="/products"
                            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
                        >
                            Browse Products
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item, index) => (
                                <div
                                    key={item.productId?._id || index}
                                    className="bg-white rounded-xl shadow-sm p-6 flex gap-4"
                                >
                                    {/* Product Image */}
                                    <div className="relative w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                                        {item.productId?.images && item.productId.images.length > 0 ? (
                                            <Image
                                                src={item.productId.images[0]}
                                                alt={item.productId?.name || 'Product'}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                            {item.productId?.name || 'Product'}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-2">
                                            ₹{item.productId?.price || 0} / {item.productId?.unit || 'unit'}
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center border border-gray-300 rounded-lg">
                                                <button
                                                    onClick={() => item.productId?._id && handleQuantityChange(item.productId._id, item.quantity - 1)}
                                                    className="p-2 hover:bg-gray-100 transition"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="px-4 font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => item.productId?._id && handleQuantityChange(item.productId._id, item.quantity + 1)}
                                                    className="p-2 hover:bg-gray-100 transition"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => item.productId?._id && handleRemove(item.productId._id)}
                                                className="text-red-600 hover:text-red-700 p-2"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Item Total */}
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-gray-900">
                                            ₹{((item.productId?.price || 0) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{cart?.subtotal?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>₹{cart?.total?.toFixed(2) || '0.00'}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
                                >
                                    Proceed to Checkout
                                </button>

                                <a
                                    href="/products"
                                    className="block text-center text-green-600 hover:text-green-700 mt-4"
                                >
                                    Continue Shopping
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
