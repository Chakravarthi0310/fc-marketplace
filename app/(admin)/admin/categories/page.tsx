'use client';

import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/slices/adminStore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function CategoriesPage() {
    const { categories, isLoading, fetchCategories, createCategory, updateCategory, deleteCategory } = useAdminStore();
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            await updateCategory(editingCategory._id, formData);
        } else {
            await createCategory(formData);
        }
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description || '' });
        setShowModal(true);
    };

    const handleDelete = async (categoryId: string) => {
        if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            await deleteCategory(categoryId);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
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
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
                        <p className="text-gray-600 mt-2">Manage product categories</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Category
                    </button>
                </div>

                {/* Categories Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {!categories || categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No categories found
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">{category.description || 'No description'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(category.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="text-emerald-600 hover:text-emerald-900 flex items-center"
                                                >
                                                    <Edit2 className="w-4 h-4 mr-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category._id)}
                                                    className="text-red-600 hover:text-red-900 flex items-center"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingCategory ? 'Edit Category' : 'Add Category'}
                                </h2>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="e.g., Vegetables"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Optional description"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                    >
                                        {editingCategory ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
