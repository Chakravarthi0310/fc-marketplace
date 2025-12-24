'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/slices/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('CUSTOMER' | 'FARMER' | 'ADMIN')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, user, hasHydrated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        // Wait for hydration to complete before checking auth
        if (!hasHydrated) {
            return;
        }

        // Check if user is authenticated
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // Check if user has required role
        if (allowedRoles && user && !allowedRoles.includes(user.role)) {
            // Redirect based on user role
            switch (user.role) {
                case 'CUSTOMER':
                    router.push('/');
                    break;
                case 'FARMER':
                    router.push('/farmer/dashboard');
                    break;
                case 'ADMIN':
                    router.push('/admin/dashboard');
                    break;
                default:
                    router.push('/');
            }
        }
    }, [isAuthenticated, user, allowedRoles, router]);

    // Don't render children while hydrating, or if not authenticated/wrong role
    if (!hasHydrated || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
