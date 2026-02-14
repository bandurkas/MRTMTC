"use client";

import Image from "next/image";
import { Star, ShieldCheck, Zap, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Product {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    image: string;
    rating: number;
    reviewsCount: number;
    seller: {
        name: string;
        rating: number;
        isOfficial: boolean;
        location?: string;
    };
    shipping: {
        speed: "Instant" | "Same Day" | "Next Day" | "Standard";
        isFree: boolean;
    };
    tags: ("Best Price" | "Best Value" | "Trusted Seller")[];
    url: string;
}

interface ProductCardProps {
    product: Product;
    rank: number;
}

export function ProductCard({ product, rank }: ProductCardProps) {
    const isTopPick = rank === 1;

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
                isTopPick ? "bg-gradient-to-br from-secondary/50 to-primary/5 border-primary/20 ring-1 ring-primary/30" : "bg-card/50 border border-border/50 hover:border-sidebar-accent"
            )}
        >
            {/* Top Badge */}
            {isTopPick && (
                <div className="absolute top-0 left-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-br-lg z-10 shadow-lg">
                    ✨ Top Choice
                </div>
            )}

            {/* Image Skeleton / Container */}
            <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized // For mock images if external
                />

                {/* Overlay Action */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-black px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform hover:scale-105 active:scale-95"
                    >
                        View Deal
                    </a>
                </div>

                {/* Favorite / Wishlist (Placeholder) */}
                <button className="absolute top-2 right-2 p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white transition-colors">
                    <Heart className="w-4 h-4" />
                </button>
            </div>

            <div className="p-4 space-y-3">
                {/* Title & Seller */}
                <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        {product.seller.isOfficial && <ShieldCheck className="w-3 h-3 text-blue-400" />}
                        <span className="truncate max-w-[150px]">{product.seller.name}</span>
                        <span className="mx-1">•</span>
                        <span className="flex items-center text-yellow-500"><Star className="w-3 h-3 fill-current mr-0.5" /> {product.seller.rating}</span>
                    </div>
                    <h3 className="font-medium text-lg leading-tight line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                        {product.title}
                    </h3>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                    {product.tags.map((tag) => (
                        <span key={tag} className={cn(
                            "px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border",
                            tag === "Best Price" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                tag === "Trusted Seller" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                    "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        )}>
                            {tag}
                        </span>
                    ))}
                    {product.shipping.speed === "Instant" && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border bg-purple-500/10 text-purple-400 border-purple-500/20 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Instant
                        </span>
                    )}
                </div>

                {/* Price & Action */}
                <div className="pt-2 flex items-end justify-between border-t border-border/30 mt-2">
                    <div>
                        {product.discount && product.discount > 0 && (
                            <div className="text-xs text-muted-foreground line-through decoration-red-400/50">
                                Rp {product.originalPrice?.toLocaleString('id-ID')}
                            </div>
                        )}
                        <div className="text-xl font-bold text-foreground">
                            Rp {product.price.toLocaleString('id-ID')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
