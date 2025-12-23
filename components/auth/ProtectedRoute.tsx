'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/slices/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('CUSTOMER' | 'FARMER' | 'ADMIN')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
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

    // Don't render children if not authenticated or wrong role
    if (!isAuthenticated) {
        return null;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
