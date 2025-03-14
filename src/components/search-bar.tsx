"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { revalidatePath } from "next/cache";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(defaultValue);
  
  // Update the local state when URL parameters change
  useEffect(() => {
    const currentQuery = searchParams.get('q') || '';
    setSearchQuery(currentQuery);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new URL with search params
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }
    
    // Use replace instead of push to avoid building up history
    router.push(`/resumenes?${params.toString()}`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-md items-center space-x-2">
      <Input
        type="text"
        placeholder="Buscar en publicaciones..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" variant="outline">
        <Search className="h-4 w-4 mr-2" />
        Buscar
      </Button>
    </form>
  );
}