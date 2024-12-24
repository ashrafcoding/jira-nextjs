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
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, Search } from "lucide-react";
import debounce from "lodash/debounce";
import { useEffect, useMemo } from "react";

export function ProjectFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') ?? 'all';
  const search = searchParams.get('search') ?? '';

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('filter', value);
    router.push(`?${params.toString()}`);
  };

  // Create a debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
          params.set('search', term);
        } else {
          params.delete('search');
        }
        router.push(`?${params.toString()}`);
      }, 300),
    [router, searchParams]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1 min-w-20 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          defaultValue={search}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex-1">
      <Select value={filter} onValueChange={handleFilterChange}>
        <SelectTrigger className="">
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
      </div>
    </div>
  );
}
