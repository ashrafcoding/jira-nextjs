import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container space-y-6 p-6">
      {/* Header with Create Project Button */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-[200px] mb-2" /> {/* Dashboard title */}
          <Skeleton className="h-4 w-[300px]" /> {/* Description */}
        </div>
        <Skeleton className="h-10 w-[150px]" /> {/* Create Project button */}
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Card key={index} className="p-6 space-y-4">
            {/* Project Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-6 w-[180px]" /> {/* Project name */}
                <Skeleton className="h-4 w-[120px]" /> {/* Created date */}
              </div>
              <Skeleton className="h-8 w-8 rounded-full" /> {/* Settings icon */}
            </div>

            {/* Project Description */}
            <Skeleton className="h-12 w-full" />

            {/* Project Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" /> {/* Label */}
                <Skeleton className="h-6 w-12" /> {/* Value */}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" /> {/* Label */}
                <Skeleton className="h-6 w-12" /> {/* Value */}
              </div>
            </div>

            {/* Members Preview */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((member) => (
                <Skeleton key={member} className="h-8 w-8 rounded-full" />
              ))}
              <Skeleton className="h-4 w-16" /> {/* Members count */}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
