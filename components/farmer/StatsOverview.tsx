import { Package, ShoppingBag, IndianRupee, Clock } from 'lucide-react';
import { Product, Order } from '@/store/types';

interface StatsOverviewProps {
    products: Product[];
    orders: any[]; // Using any for now as Order type might need adjustment or import
    farmerId: string;
}

export default function StatsOverview({ products, orders, farmerId }: StatsOverviewProps) {
    // Calculate stats
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => {
        // Only count revenue for non-cancelled orders
        if (order.status !== 'CANCELLED') {
            // Calculate revenue only for items belonging to this farmer
            const myItems = order.items?.filter((item: any) =>
                item.farmerId?.toString() === farmerId?.toString()
            ) || [];
            const subtotal = myItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
            return acc + subtotal;
        }
        return acc;
    }, 0);

    const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length;

    const stats = [
        {
            title: 'Total Revenue',
            value: `₹${totalRevenue.toLocaleString('en-IN')}`,
            icon: IndianRupee,
            color: 'text-green-600',
            bg: 'bg-green-100',
        },
        {
            title: 'Total Orders',
            value: totalOrders,
            icon: ShoppingBag,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
        },
        {
            title: 'Total Products',
            value: totalProducts,
            icon: Package,
            color: 'text-purple-600',
            bg: 'bg-purple-100',
        },
        {
            title: 'Pending Orders',
            value: pendingOrders,
            icon: Clock,
            color: 'text-orange-600',
            bg: 'bg-orange-100',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}
