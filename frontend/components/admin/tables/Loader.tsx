
const Loader = () => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="w-64 h-10 bg-slate-200 animate-pulse rounded-md"></div>
                <div className="w-24 h-6 bg-slate-200 animate-pulse rounded-md"></div>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <div className="h-64 bg-slate-100 animate-pulse"></div>
            </div>
        </div>
    )
}

export default Loader