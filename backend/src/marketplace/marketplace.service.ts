import { Injectable } from '@nestjs/common';
import { ScraperService } from './scraper.service';

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

const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        price: 4999000,
        originalPrice: 5999000,
        discount: 17,
        rating: 4.8,
        reviewsCount: 1240,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000",
        seller: {
            name: "Sony Official Store",
            rating: 4.9,
            isOfficial: true,
            location: "Jakarta Pusat",
        },
        shipping: {
            speed: "Instant",
            isFree: true,
        },
        tags: ["Best Price", "Trusted Seller"],
        url: "https://shopee.co.id/sony-official",
    },
    {
        id: "2",
        title: "Logitech G Pro X Superlight Wireless Gaming Mouse",
        price: 1899000,
        originalPrice: 2399000,
        discount: 21,
        rating: 4.9,
        reviewsCount: 850,
        image: "https://images.unsplash.com/photo-1615663245857-acda5b2a6d5d?auto=format&fit=crop&q=80&w=1000",
        seller: {
            name: "Logitech Official",
            rating: 4.9,
            isOfficial: true,
            location: "Jakarta Utara",
        },
        shipping: {
            speed: "Same Day",
            isFree: true,
        },
        tags: ["Best Value"],
        url: "https://tokopedia.com/logitech",
    },
];

@Injectable()
export class MarketplaceService {
    constructor(private readonly scraperService: ScraperService) { }

    async search(query: string): Promise<Product[]> {
        if (!query) return MOCK_PRODUCTS;
        const lowerQuery = query.toLowerCase();

        // Try scraping first
        try {
            console.log(`Attempting to scrape for: ${query}`);
            const scrapedProducts = await this.scraperService.searchShopee(query);
            if (scrapedProducts && scrapedProducts.length > 0) {
                return scrapedProducts;
            }
        } catch (e) {
            console.error("Scraping failed, falling back to mock data", e);
        }

        // Fallback to mock data
        console.log("Falling back to mock data");
        await new Promise(resolve => setTimeout(resolve, 1000));

        return MOCK_PRODUCTS.filter(p =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.seller.name.toLowerCase().includes(lowerQuery)
        );
    }
}
