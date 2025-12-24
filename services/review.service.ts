import api from '@/lib/axios';

export interface CreateReviewData {
    productId: string;
    rating: number;
    comment: string;
}

export const reviewService = {
    addReview: async (data: CreateReviewData) => {
        const response = await api.post('/reviews', data);
        return response.data;
    },

    getReviews: async (productId: string, page = 1, limit = 5) => {
        const response = await api.get(`/reviews/${productId}`, {
            params: { page, limit }
        });
        return response.data.data;
    },

    deleteReview: async (reviewId: string) => {
        const response = await api.delete(`/reviews/${reviewId}`);
        return response.data;
    },

    getFarmerReviews: async (page = 1, limit = 10) => {
        const response = await api.get('/reviews/farmer/my-reviews', {
            params: { page, limit }
        });
        return response.data.data;
    }
};
