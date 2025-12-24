import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 lg:ml-64 transition-all duration-300">
                    <main className="p-4 md:p-8 pt-20 lg:pt-8">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
