'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/store/slices/productStore';
import { ArrowLeft, Edit, Package, Star, Calendar, Tag, Box } from 'lucide-react';
import Image from 'next/image';
import ReviewList from '@/components/reviews/ReviewList';

export default function FarmerProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { selectedProduct, isLoading, fetchProductById } = useProductStore();

    useEffect(() => {
        if (params.id) {
            fetchProductById(params.id as string);
        }
    }, [params.id, fetchProductById]);

    if (isLoading || !selectedProduct) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900">Product Details</h1>
                    </div>
                    <button
                        onClick={() => router.push(`/farmer/products/edit/${selectedProduct._id}`)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium text-sm shadow-sm"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Product
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                        {/* Image Section */}
                        <div className="md:col-span-1">
                            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                    <Image
                                        src={selectedProduct.images[0]}
                                        alt={selectedProduct.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Package className="w-16 h-16" />
                                    </div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                                    <Star className="w-6 h-6 fill-current" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{selectedProduct.averageRating?.toFixed(1) || '0.0'}</span>
                                <span className="text-sm text-gray-500">{selectedProduct.ratingCount || 0} reviews</span>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h1>
                                {selectedProduct.stock > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                        In Stock ({selectedProduct.stock})
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-sm text-gray-500 mb-1">Price</p>
                                    <p className="text-2xl font-bold text-green-600">₹{selectedProduct.price}<span className="text-sm text-gray-400 font-normal">/{selectedProduct.unit}</span></p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-sm text-gray-500 mb-1">Category</p>
                                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-gray-400" />
                                        {typeof selectedProduct.category === 'object' ? selectedProduct.category.name : 'Unknown'}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <Box className="w-4 h-4" />
                                    Description
                                </h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                    {selectedProduct.description}
                                </p>
                            </div>

                            <div className="pt-6 border-t flex gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    Created: {new Date(selectedProduct.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
                    </div>
                    <div className="p-6">
                        <ReviewList productId={params.id as string} refreshTrigger={0} />
                    </div>
                </div>
            </div>
        </div>
    );
}
