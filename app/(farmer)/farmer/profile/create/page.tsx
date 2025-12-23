'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Loader2, Store, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateFarmerProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        farmName: '',
        phone: '',
        address: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post('/farmers', formData);
            toast.success('Farmer profile created successfully! Waiting for admin approval.');
            router.push('/farmer/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create farmer profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                        <Store className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Farmer Profile</h1>
                    <p className="text-gray-600">
                        Complete your profile to start selling your products
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                    {/* Farm Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Farm Name *
                        </label>
                        <div className="relative">
                            <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                minLength={2}
                                maxLength={100}
                                value={formData.farmName}
                                onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="e.g., Green Valley Farm"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                required
                                minLength={10}
                                maxLength={15}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="e.g., +91 9876543210"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Farm Address *
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <textarea
                                required
                                minLength={5}
                                maxLength={255}
                                rows={3}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter your complete farm address"
                            />
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            ℹ️ Your profile will be reviewed by our admin team. You'll be able to list products once approved.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating Profile...
                            </>
                        ) : (
                            'Create Profile'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
