import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main>
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
