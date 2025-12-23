import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={['CUSTOMER']}>
            {children}
        </ProtectedRoute>
    );
}
