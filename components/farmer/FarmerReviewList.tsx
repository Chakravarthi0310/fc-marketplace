'use client';

import { Star, User, Calendar } from 'lucide-react';

interface FarmerReviewListProps {
    reviews: any[];
}

export default function FarmerReviewList({ reviews }: FarmerReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews yet</h3>
                <p className="text-gray-500 mb-6">
                    Reviews from customers will appear here once they start rating your products.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div key={review._id} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Product Info (Small thumbnail) */}
                        <div className="flex items-center gap-4 md:w-1/4 min-w-[200px] border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {review.productId?.images?.[0] ? (
                                    <img
                                        src={review.productId.images[0]}
                                        alt={review.productId.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-xs">
                                        No Img
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{review.productId?.name}</h4>
                                <p className="text-xs text-gray-500">Product ID: ...{review.productId?._id?.slice(-6)}</p>
                            </div>
                        </div>

                        {/* Review Content */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-bold text-gray-900">{review.rating}.0</span>
                                </div>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                "{review.comment}"
                            </p>

                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <User className="w-3 h-3" />
                                <span>{review.userId?.name || 'Anonymous Customer'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
