import Image from 'next/image';
import { Package, Edit, Trash2, MoreVertical } from 'lucide-react';
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
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 group">
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

                {/* Quick Actions (Desktop Hover / Mobile Visible) */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(product._id)}
                        className="p-2 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-blue-600 rounded-full shadow-sm hover:shadow-md transition"
                        title="Edit Product"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(product._id)}
                        className="p-2 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-600 rounded-full shadow-sm hover:shadow-md transition"
                        title="Delete Product"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="p-5">
                <div className="mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 leading-tight mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Price</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                            <span className="text-gray-400 text-sm">/{product.unit}</span>
                        </div>
                    </div>

                    {/* Fallback Edit/Delete for mobile if hover doesn't work well */}
                    <div className="md:hidden flex gap-3">
                        <button onClick={() => onEdit(product._id)} className="text-blue-600">
                            <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => onDelete(product._id)} className="text-red-600">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
