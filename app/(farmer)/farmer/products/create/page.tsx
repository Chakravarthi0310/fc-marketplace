'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/product.service';
import api from '@/lib/axios';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        unit: 'kg',
        stock: '',
        category: '',
    });

    useEffect(() => {
        // Fetch categories from backend
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                const categoriesData = data.data || [];
                setCategories(categoriesData);
                if (categoriesData.length > 0) {
                    setFormData(prev => ({ ...prev, category: categoriesData[0]._id }));
                }
            } catch (error) {
                console.error('Failed to fetch categories');
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Create the product first to get an ID
            const productData: any = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                unit: formData.unit,
                stock: parseInt(formData.stock),
                category: formData.category,
                images: [], // Initially empty
            };

            const newProduct = await productService.create(productData);
            const productId = newProduct._id;

            // 2. If an image is selected, upload it
            if (imageFile && productId) {
                try {
                    // Get pre-signed URL
                    const { uploadUrl, imageUrl } = await productService.getUploadUrl(productId, imageFile.type);

                    // Upload to S3
                    await productService.uploadImage(uploadUrl, imageFile);

                    // Update product with the image URL
                    await productService.update(productId, {
                        images: [imageUrl]
                    });
                } catch (uploadError) {
                    console.error('Image upload failed:', uploadError);
                    toast.error('Product created, but image upload failed. You can add it later by editing the product.');
                    router.push('/farmer/dashboard');
                    return;
                }
            }

            toast.success('Product created successfully!');
            router.push('/farmer/dashboard');
        } catch (error: any) {
            console.error('Creation failed:', error);
            toast.error(error.response?.data?.message || 'Failed to create product');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Organic Tomatoes"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Describe your product..."
                        />
                    </div>

                    {/* Price and Unit */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                            <select
                                required
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="kg">Kilogram (kg)</option>
                                <option value="g">Gram (g)</option>
                                <option value="lb">Pound (lb)</option>
                                <option value="piece">Piece</option>
                                <option value="dozen">Dozen</option>
                                <option value="liter">Liter</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Image (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Image (Optional)
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-white border-2 border-dashed border-gray-300 hover:border-green-500 rounded-lg px-6 py-8 text-center transition flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="text-sm text-gray-600">
                                        {imageFile ? imageFile.name : 'Click to upload image'}
                                    </span>
                                    <span className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</span>
                                </div>
                            </label>
                            {imagePreview && (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview('');
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            Upload an image for your product (optional - file upload feature coming soon)
                        </p>
                    </div>

                    {/* Stock and Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="">Select category</option>
                                {Array.isArray(categories) && categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            ℹ️ <strong>Description:</strong> Minimum 5 characters required.
                            <br />
                            ℹ️ <strong>Image:</strong> Optional. Images are stored securely on AWS S3.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
