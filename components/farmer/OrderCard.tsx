import { ChevronDown, ChevronUp, User, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

interface OrderCardProps {
    order: any;
    farmerId: string;
}

export default function OrderCard({ order, farmerId }: OrderCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Filter items relevant to this farmer
    const myItems = order.items?.filter((item: any) =>
        item.farmerId?.toString() === farmerId?.toString()
    ) || [];

    // Calculate subtotal for this farmer
    const subtotal = myItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    const statusColors = {
        DELIVERED: 'bg-green-100 text-green-800 border-green-200',
        CANCELLED: 'bg-red-100 text-red-800 border-red-200',
        PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
        PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        PAYMENT_PENDING: 'bg-orange-100 text-orange-800 border-orange-200',
    };

    const statusMap: Record<string, string> = {
        DELIVERED: 'Delivered',
        CANCELLED: 'Cancelled',
        PROCESSING: 'Processing',
        PENDING: 'Pending',
        PAYMENT_PENDING: 'Payment Pending',
    };

    const currentStatus = order.status as keyof typeof statusColors;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-gray-900 text-lg">Order #{order._id.slice(-8).toUpperCase()}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[currentStatus] || 'bg-gray-100 text-gray-800'}`}>
                                {statusMap[currentStatus] || order.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>

                    <div className="flex flex-col md:items-end">
                        <p className="text-sm text-gray-500 mb-1">Your Earnings</p>
                        <p className="text-2xl font-bold text-green-600">₹{subtotal}</p>
                    </div>
                </div>

                {/* Customer Info (Collapsed by default on mobile maybe?) */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                            <User className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Customer</p>
                            <p className="text-sm font-semibold text-gray-900">{order.userId?.name || 'Guest User'}</p>
                        </div>
                    </div>
                    {/* Add more customer details if available in the future (Phone, Address) */}
                </div>

                {/* Items List */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                        <h4 className="font-medium text-gray-700 text-sm">Order Items ({myItems.length})</h4>
                        <button className="text-gray-500 hover:text-gray-700">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Always show items, or collapse? Let's keep expanded by default or just show list */}
                    {/* Actually, let's show them always but have the chevron for optional collapsing if list is long. 
                        For now, just show them.
                    */}
                    <div className={`${isExpanded ? 'block' : 'block'} divide-y`}>
                        {/* Removing the toggle logic for now to keep it simple, straightforward list is better */}
                        {myItems.map((item: any, idx: number) => (
                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden relative">
                                        {item.productId?.images?.[0] ? (
                                            <img
                                                src={item.productId.images[0]}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs font-bold">x{item.quantity}</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">₹{item.price} per unit</p>
                                    </div>
                                </div>
                                <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
