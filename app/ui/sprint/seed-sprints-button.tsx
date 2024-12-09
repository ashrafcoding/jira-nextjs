'use client';

import { Button } from "@/components/ui/button";
import { seedSprintsForProject } from "@/app/controllers/seed-sprints";
import { useRouter } from "next/navigation";

export function SeedSprintsButton({ projectId }: { projectId: string }) {
  const router = useRouter();

  const handleSeed = async () => {
    try {
      await seedSprintsForProject(projectId);
      router.refresh();
    } catch (error) {
      console.error('Error seeding sprints:', error);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleSeed}
      className="text-xs"
    >
      Add Example Sprints
    </Button>
  );
}
