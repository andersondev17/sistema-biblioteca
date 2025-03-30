import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
    <div className="space-y-4 pr-4 sm:p-0">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-3">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className={`${i === 3 ? 'col-span-2 sm:col-span-1' : ''} bg-white rounded-lg p-2 sm:p-4 animate-pulse`}
                >
                    <div className="flex justify-between items-center mb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-10" />
                    </div>
                    <Skeleton className="h-8 w-16 mt-2" />
                </div>
            ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid gap-2 sm:gap-4 lg:grid-cols-3">
            <main className="lg:col-span-2 space-y-2 sm:space-y-4">
                {/* Quick Access Grid Skeleton */}
                <div className="bg-white rounded-lg p-4">
                    <Skeleton className="h-6 w-48 mb-4" />
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Sidebar Skeleton */}
            <aside className="space-y-2 sm:space-y-4 pr-4 lg:col-span-1">
                <div className="bg-white rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <Skeleton className="h-5 w-36" />
                        <Skeleton className="h-3 w-16" />
                    </div>

                    {/* Recent Books Skeleton */}
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-3">
                                <Skeleton className="h-16 w-12 rounded-md flex-shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    </div>
);

export default LoadingSkeleton;