"use client";

import { useState } from "react";
import { SearchBar } from "@/components/search-bar";
import { ProductCard, Product } from "@/components/product-card";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export default function Home() {
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock search function simulating API call
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple filter for mock purposes
    const filtered = MOCK_PRODUCTS.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.seller.name.toLowerCase().includes(query.toLowerCase())
    );

    // If no specific match, return all for now to show UI
    setResults(filtered.length > 0 ? filtered : MOCK_PRODUCTS);
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-24 px-4 bg-gradient-to-b from-background via-background to-secondary/20 relative overflow-hidden">

      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <div className={`w-full max-w-4xl space-y-8 transition-all duration-700 ${hasSearched ? 'translate-y-0 scale-100' : 'translate-y-[10vh]'}`}>
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400 drop-shadow-sm font-sans">
            Find the Best Deal.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto font-light">
            Instant price comparison from trusted sellers across Shopee & Tokopedia.
          </p>
        </div>

        <div className="w-full">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full max-w-7xl mt-16 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] bg-white/5 rounded-xl border border-white/5" />
            ))}
          </div>
        ) : hasSearched ? (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Top Results</h2>
              <span className="text-sm text-muted-foreground">Found {results.length} deals</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((product, index) => (
                <ProductCard key={product.id} product={product} rank={index + 1} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-20 text-center opacity-0 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6">Popular Categories</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Gaming Gear', 'Skincare', 'Sneakers', 'Home Office', 'Gadgets'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSearch(tag)}
                  className="px-6 py-2 rounded-full border border-white/10 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all text-sm font-medium backdrop-blur-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
