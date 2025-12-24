import Link from 'next/link';
import Image from 'next/image';
import { Package, Edit, Trash2, MoreVertical, Star } from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/store/types';

interface ProductCardProps {
    product: Product;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
            <Link href={`/farmer/products/${product._id}`} className="block">
                <div className="relative h-48 bg-gray-50">
                    {product.images && product.images.length > 0 ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package className="w-12 h-12" />
                        </div>
                    )}

                    {/* Stock Badge */}
                    <div className="absolute top-3 left-3">
                        {product.stock > 0 ? (
                            <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                                In Stock ({product.stock})
                            </span>
                        ) : (
                            <span className="bg-white/90 backdrop-blur-sm text-red-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                Out of Stock
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-5">
                    <div className="mb-3">
                        <h3 className="font-semibold text-lg text-gray-900 leading-tight mb-1">{product.name}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-2">{product.description}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                            <span className="text-sm font-semibold text-gray-900">
                                {product.averageRating?.toFixed(1) || '0.0'}
                            </span>
                            <span className="text-xs text-gray-500">
                                ({product.ratingCount || 0} reviews)
                            </span>
                        </div>
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Price</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                                <span className="text-gray-400 text-sm">/{product.unit}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Actions (Separate from Link to prevent navigation) */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onEdit(product._id);
                    }}
                    className="p-2 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-blue-600 rounded-full shadow-sm hover:shadow-md transition"
                    title="Edit Product"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onDelete(product._id);
                    }}
                    className="p-2 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-600 rounded-full shadow-sm hover:shadow-md transition"
                    title="Delete Product"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden absolute bottom-5 right-5 flex gap-3">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onEdit(product._id);
                    }}
                    className="p-2 bg-gray-100 rounded-full text-blue-600"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onDelete(product._id);
                    }}
                    className="p-2 bg-gray-100 rounded-full text-red-600"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
