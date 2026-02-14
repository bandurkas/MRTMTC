"use client";

import { Search, Loader2 } from "lucide-react";
import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                "relative w-full max-w-2xl mx-auto transition-all duration-300",
                "focus-within:scale-105 focus-within:shadow-2xl focus-within:ring-2 ring-primary/50 rounded-full"
            )}
        >
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Search className="w-6 h-6" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={cn(
                        "block w-full pl-12 pr-12 py-4 text-lg bg-background/80 backdrop-blur-md border border-white/10 rounded-full",
                        "text-foreground placeholder:text-muted-foreground/80 outline-none shadow-lg",
                        "transition-all duration-300 hover:bg-background/90 hover:shadow-xl"
                    )}
                    placeholder="Search for best deals (e.g., 'sepatu gaming')..."
                    autoFocus
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    ) : (
                        <button
                            type="submit"
                            className="p-1 rounded-full hover:bg-primary/10 transition-colors text-primary"
                        >
                            <span className="sr-only">Search</span>
                            {/* Optional: Add an arrow or enter icon if desired, otherwise cleaner keeps it simple */}
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}
