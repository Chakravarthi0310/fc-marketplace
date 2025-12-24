'use client';

import { useEffect, useState } from 'react';
import { Review } from '@/store/types';
import { reviewService } from '@/services/review.service';
import { useAuthStore } from '@/store/slices/authStore';
import { Star, User, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Pagination from '../ui/Pagination';

interface ReviewListProps {
    productId: string;
    refreshTrigger: number; // Increment to trigger refresh
}

export default function ReviewList({ productId, refreshTrigger }: ReviewListProps) {
    const { user } = useAuthStore();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    });

    const fetchReviews = async (page = 1) => {
        setIsLoading(true);
        try {
            const data: any = await reviewService.getReviews(productId, page, 5);
            setReviews(data.docs || []);
            setPagination({
                page: data.page,
                totalPages: data.pages || data.totalPages,
                total: data.total
            });
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(1);
    }, [productId, refreshTrigger]);

    const handleDelete = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        try {
            await reviewService.deleteReview(reviewId);
            toast.success('Review deleted');
            fetchReviews(pagination.page); // Refresh current page
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">
                Customer Reviews ({pagination.total})
            </h3>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                </div>
            ) : reviews.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
                    No reviews yet. Be the first to review this product!
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white border rounded-xl p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{review.userId.name}</p>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                            <span className="text-xs text-gray-400 ml-2">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {user?._id === review.userId._id && (
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        className="text-gray-400 hover:text-red-500 transition"
                                        title="Delete Review"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <p className="mt-4 text-gray-600 leading-relaxed text-sm">
                                {review.comment}
                            </p>
                        </div>
                    ))}

                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={fetchReviews}
                    />
                </div>
            )}
        </div>
    );
}
