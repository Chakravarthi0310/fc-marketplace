'use client';

import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/slices/adminStore';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';

type TabType = 'all' | 'pending' | 'approved' | 'rejected';

export default function FarmersPage() {
    const { farmers, isLoading, fetchAllFarmers, fetchPendingFarmers, approveFarmer, rejectFarmer } = useAdminStore();
    const [activeTab, setActiveTab] = useState<TabType>('pending');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (activeTab === 'pending') {
            fetchPendingFarmers();
        } else {
            fetchAllFarmers();
        }
    }, [activeTab, fetchAllFarmers, fetchPendingFarmers]);

    const filteredFarmers = farmers.filter((farmer) => {
        const matchesSearch =
            farmer.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.farmName.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'all') return matchesSearch;
        return matchesSearch && farmer.verificationStatus === activeTab.toUpperCase();
    });

    const handleApprove = async (farmerId: string) => {
        if (confirm('Are you sure you want to approve this farmer?')) {
            await approveFarmer(farmerId);
        }
    };

    const handleReject = async (farmerId: string) => {
        if (confirm('Are you sure you want to reject this farmer?')) {
            await rejectFarmer(farmerId);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Farmer Verification</h1>
                    <p className="text-gray-600 mt-2">Manage farmer registrations and approvals</p>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by name, email, or farm name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>

                {/* Tabs */}
                <div className="mb-6 flex space-x-4 border-b">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`pb-2 px-4 font-medium ${activeTab === 'pending'
                            ? 'border-b-2 border-emerald-600 text-emerald-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setActiveTab('approved')}
                        className={`pb-2 px-4 font-medium ${activeTab === 'approved'
                            ? 'border-b-2 border-emerald-600 text-emerald-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Approved
                    </button>
                    <button
                        onClick={() => setActiveTab('rejected')}
                        className={`pb-2 px-4 font-medium ${activeTab === 'rejected'
                            ? 'border-b-2 border-emerald-600 text-emerald-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Rejected
                    </button>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`pb-2 px-4 font-medium ${activeTab === 'all'
                            ? 'border-b-2 border-emerald-600 text-emerald-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        All Farmers
                    </button>
                </div>

                {/* Farmers Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Farmer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Farm Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Registered
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {!filteredFarmers || filteredFarmers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No farmers found
                                    </td>
                                </tr>
                            ) : (
                                filteredFarmers.map((farmer) => (
                                    <tr key={farmer._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                                    <User className="h-6 w-6 text-emerald-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{farmer.userId.name}</div>
                                                    <div className="text-sm text-gray-500">{farmer.userId.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{farmer.farmName}</div>
                                            <div className="text-sm text-gray-500">
                                                {farmer.farmSize} acres • {farmer.farmingType}
                                            </div>
                                            <div className="text-sm text-gray-500">{farmer.experience} years experience</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {farmer.verificationStatus === 'APPROVED' && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    Approved
                                                </span>
                                            )}
                                            {farmer.verificationStatus === 'PENDING' && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    Pending
                                                </span>
                                            )}
                                            {farmer.verificationStatus === 'REJECTED' && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <XCircle className="w-4 h-4 mr-1" />
                                                    Rejected
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(farmer.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {farmer.verificationStatus === 'PENDING' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleApprove(farmer.userId._id)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(farmer.userId._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            {farmer.verificationStatus !== 'PENDING' && (
                                                <span className="text-gray-400">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
