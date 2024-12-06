import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Skeleton className="h-4 w-[100px] mb-2" /> {/* projects text */}
          <div className="my-2">
            <Skeleton className="h-8 w-[400px] mb-2" /> {/* Multi tasking heading */}
            <Skeleton className="h-6 w-[300px]" /> {/* Name your projects text */}
          </div>
        </div>
        <div>
          <Skeleton className="h-[300px] w-[600px]" /> {/* Image placeholder */}
        </div>
      </div>

      {/* Projects Section */}
      <div className="flex items-center justify-between space-y-2 mt-8">
        <Skeleton className="h-8 w-[150px]" /> {/* Projects heading */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[100px]" /> {/* Select */}
          <Skeleton className="h-10 w-[100px]" /> {/* Button */}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Card key={index} className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <Skeleton className="h-9 w-9 rounded-full" /> {/* Avatar */}
                <div>
                  <Skeleton className="h-6 w-[180px]" /> {/* Project name */}
                  <Skeleton className="h-4 w-[120px] mt-2" /> {/* Created date */}
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-full" /> {/* Menu icon */}
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
