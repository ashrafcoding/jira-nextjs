'use client';

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

export function ProjectFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') ?? 'all';

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('filter', value);
    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={filter} onValueChange={handleFilterChange}>
      <SelectTrigger className="w-[180px]">
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Filter by" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter</SelectLabel>
          <SelectItem value="all">All Projects</SelectItem>
          <SelectItem value="owned">Owned Projects</SelectItem>
          <SelectItem value="member">Member Projects</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
