import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function TariffsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex space-x-3">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Statistics Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table Header Skeleton */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-lg">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>

            {/* Table Rows Skeleton */}
            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-12 gap-4 px-4 py-4 bg-white border border-gray-200 rounded-lg"
              >
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <div key={colIndex} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    {colIndex === 0 && (
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
