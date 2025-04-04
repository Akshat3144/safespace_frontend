import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

const SearchBar = ({ onSearch, className = "" }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = () => {
    if (!query.trim()) {
      toast({
        variant: "destructive",
        title: "Search query is empty",
        description:
          "Please enter a location or address to search for properties.",
      });
      return;
    }
    onSearch(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`relative rounded-md shadow-sm ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-neutral-700" />
      </div>
      <Input
        type="text"
        className="block w-full pl-10 pr-20 py-6 text-black rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
        placeholder="Enter a location or address..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="absolute inset-y-0 right-0 flex items-center">
        <Button
          onClick={handleSearch}
          className="h-full px-4 text-white bg-primary-dark rounded-r-md hover:bg-primary-dark/90"
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
