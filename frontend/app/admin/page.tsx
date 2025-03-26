"use client";
import RecentBooksList from "@/components/admin/dashboard/RecentBooksList";
import { QuickAccessGrid, StatCard } from "../../components/admin/dashboard-components";
import { useDashboardData } from "../../hooks/dashboard";

const AdminDashboard = () => {
    const { stats, recentBooks } = useDashboardData();

    return (
        <div className="space-y-4 p-2 sm:p-0 font-bebas-neue">
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-3">
                <StatCard 
                    title="Usuarios"
                    value={stats.totalUsers}
                    trend={4}
                    colorClass="text-primary-admin"
                    className="text-xs sm:text-base p-1 sm:p-2"
                />
                <StatCard  
                    title="Libros"
                    value={stats.totalBooks}
                    trend={2}
                    colorClass="text-amber-500"
                    className="text-xs sm:text-base p-1 sm:p-2"
                />
                <StatCard 
                    title="Autores"
                    value={stats.totalAuthors}
                    trend={1}
                    colorClass="text-green-500"
                    className="col-span-2 sm:col-span-1 text-xs sm:text-base p-1 sm:p-2"
                />
            </div>

            <div className="grid gap-2 sm:gap-4 lg:grid-cols-3">
                <main className="lg:col-span-2 space-y-2 sm:space-y-4">
                    <QuickAccessGrid />
                </main>

                <aside className="space-y-2 sm:space-y-4 lg:col-span-1">
                    <RecentBooksList books={recentBooks} />
                </aside>
            </div>
        </div>
    );
};

export default AdminDashboard;