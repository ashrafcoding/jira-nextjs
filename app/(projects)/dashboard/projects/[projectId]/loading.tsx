import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-6 p-6 container mx-auto">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" /> {/* Project name */}
          <Skeleton className="h-4 w-[300px]" /> {/* Project description */}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[120px]" /> {/* View Members button */}
          <Skeleton className="h-10 w-[120px]" /> {/* Create Issue button */}
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Issues List Header */}
      <div className="container mx-auto py-6">
        <Skeleton className="h-8 w-[150px] mb-6" /> {/* "Project Issues" text */}
        
        {/* Issues Grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="w-full p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Skeleton className="h-6 w-[250px] mb-2" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
              <Skeleton className="h-16 w-full mb-4" />
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}