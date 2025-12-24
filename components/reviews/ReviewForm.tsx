'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { reviewService } from '@/services/review.service';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/slices/authStore';
import Link from 'next/link';

interface ReviewFormProps {
    productId: string;
    onReviewAdded: () => void;
}

export default function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
    const { isAuthenticated } = useAuthStore();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            await reviewService.addReview({
                productId,
                rating,
                comment
            });
            toast.success('Review submitted successfully!');
            setRating(0);
            setComment('');
            onReviewAdded();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-gray-50 rounded-xl p-6 text-center border border-dashed border-gray-300">
                <p className="text-gray-600 mb-2">Please log in to write a review.</p>
                <Link href="/auth/login" className="text-green-600 font-semibold hover:underline">
                    Log In
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="focus:outline-none transition"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                className={`w-8 h-8 ${star <= (hoverRating || rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500 font-medium">
                        {hoverRating || rating ? (hoverRating || rating) + ' Stars' : 'Select a rating'}
                    </span>
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                </label>
                <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    placeholder="Share your experience with this product..."
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}
