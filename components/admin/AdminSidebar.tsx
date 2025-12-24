'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/slices/authStore';
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Package,
    LogOut,
    Menu,
    X
} from 'lucide-react';

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Farmers', href: '/admin/farmers', icon: Users },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Categories', href: '/admin/categories', icon: Package },
    ];

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isMobileMenuOpen ? 'mt-16 lg:mt-0' : ''} /* Adjust for mobile header when open */
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo Area (Hidden on mobile if header shows title, but good for desktop) */}
                    <div className="hidden lg:flex items-center justify-center h-16 border-b border-gray-200">
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                            Farmcart Admin
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname.startsWith(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                        ${isActive
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                                        }
                                    `}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-600'}`} />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User & Logout */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={() => {
                                logout();
                                setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
