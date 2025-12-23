import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function FarmerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={['FARMER']}>
            {children}
        </ProtectedRoute>
    );
}
