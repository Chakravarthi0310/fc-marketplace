'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/store/slices/productStore';
import { useCartStore } from '@/store/slices/cartStore';
import { ArrowLeft, ShoppingCart, Package, Loader2, Star } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { selectedProduct, isLoading, fetchProductById } = useProductStore();
    const { addItem } = useCartStore();
    const [refreshReviews, setRefreshReviews] = useState(0);

    useEffect(() => {
        if (params.id) {
            fetchProductById(params.id as string);
        }
    }, [params.id, fetchProductById]);

    const handleAddToCart = async () => {
        if (!selectedProduct) return;
        try {
            await addItem(selectedProduct._id, 1);
            router.push('/cart');
        } catch (error) {
            // Error handled by store
        }
    };

    if (isLoading || !selectedProduct) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Products
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                            {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                <Image
                                    src={selectedProduct.images[0]}
                                    alt={selectedProduct.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Package className="w-24 h-24" />
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {selectedProduct.images && selectedProduct.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {selectedProduct.images.slice(1, 5).map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden"
                                    >
                                        <Image src={image} alt={`${selectedProduct.name} ${index + 2}`} fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {selectedProduct.name}
                        </h1>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex items-center text-yellow-500">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="ml-1 font-bold text-gray-900">
                                    {selectedProduct.averageRating?.toFixed(1) || '0.0'}
                                </span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-600">
                                {selectedProduct.ratingCount || 0} reviews
                            </span>
                        </div>

                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-4xl font-bold text-green-600">
                                ₹{selectedProduct.price}
                            </span>
                            <span className="text-xl text-gray-500">/ {selectedProduct.unit}</span>
                        </div>

                        {/* Stock Status */}
                        <div className="mb-6">
                            {selectedProduct.stock > 0 ? (
                                <div className="flex items-center gap-2 text-green-600">
                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                    <span className="font-semibold">In Stock ({selectedProduct.stock} available)</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-600">
                                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                    <span className="font-semibold">Out of Stock</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                            <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={selectedProduct.stock === 0}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>

                        {/* Product Details */}
                        <div className="mt-8 pt-8 border-t">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
                            <dl className="space-y-3">
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Category</dt>
                                    <dd className="font-semibold text-gray-900">
                                        {typeof selectedProduct.category === 'object'
                                            ? selectedProduct.category.name
                                            : selectedProduct.category}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Unit</dt>
                                    <dd className="font-semibold text-gray-900">{selectedProduct.unit}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Stock</dt>
                                    <dd className="font-semibold text-gray-900">{selectedProduct.stock}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <ReviewList productId={params.id as string} refreshTrigger={refreshReviews} />
                        </div>
                        <div>
                            <ReviewForm
                                productId={params.id as string}
                                onReviewAdded={() => setRefreshReviews(prev => prev + 1)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
