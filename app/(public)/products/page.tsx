'use client';

import { useEffect } from 'react';
import { useProductStore } from '@/store/slices/productStore';
import { useCartStore } from '@/store/slices/cartStore';
import { Plus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Pagination from '@/components/ui/Pagination';

export default function ProductsPage() {
    const { products, isLoading, fetchProducts, pagination } = useProductStore();
    const productsPagination = pagination || { page: 1, totalPages: 1 };
    const { addItem } = useCartStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handlePageChange = (page: number) => {
        fetchProducts({}, page);
    };

    const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await addItem(productId, 1);
        } catch (error) {
            // Error handled by store
        }
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
            <Navbar />

            {/* Page Title */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Fresh From The Farm
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Connect directly with local farmers and get fresh, organic produce delivered to your doorstep.
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Link
                                key={product._id}
                                href={`/products/${product._id}`}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden block"
                            >
                                {/* Product Image */}
                                <div className="relative h-48 bg-gray-200">
                                    {product.images && product.images.length > 0 ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                    {product.stock === 0 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="text-white font-semibold">Out of Stock</span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <span className="text-2xl font-bold text-green-600">
                                                ₹{product.price}
                                            </span>
                                            <span className="text-gray-500 text-sm">/{product.unit}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            Stock: {product.stock}
                                        </span>
                                    </div>

                                    <button
                                        onClick={(e) => handleAddToCart(product._id, e)}
                                        disabled={product.stock === 0}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add to Cart
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {products && products.length > 0 && (
                    <Pagination
                        currentPage={productsPagination.page}
                        totalPages={productsPagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}
