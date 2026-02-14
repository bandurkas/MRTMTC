import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Product } from './marketplace.service';
import * as fs from 'fs';
import * as path from 'path';

// Add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);

    private async loadCookies(page: any) {
        try {
            const cookiePath = path.resolve(process.cwd(), 'cookies.json');
            if (fs.existsSync(cookiePath)) {
                const cookiesString = fs.readFileSync(cookiePath, 'utf8');
                const cookies = JSON.parse(cookiesString);
                // Sanitize cookies for Puppeteer - EXTREME SAFEMODE v4
                const sanitizedCookies = cookies.map((c: any) => ({
                    name: String(c.name),
                    value: String(c.value),
                    domain: String(c.domain).startsWith('.') ? String(c.domain).substring(1) : String(c.domain)
                }));

                // Remove undefined values
                const cleanCookies = sanitizedCookies.filter((c: any) => c.name && c.value && c.domain);

                this.logger.log(`Attempting to set ${cleanCookies.length} cookies.`);
                await page.setCookie(...cleanCookies);
                this.logger.log(`Loaded ${cleanCookies.length} cookies from ${cookiePath}`);
            } else {
                this.logger.warn(`No cookies.json found at ${cookiePath}. Proceeding without login session.`);
            }
        } catch (error) {
            this.logger.error(`Failed to load cookies: ${error.message}`);
        }
    }

    async searchShopee(query: string): Promise<Product[]> {
        this.logger.log(`Searching Shopee for: ${query} (Stealth Mode)`);

        let browser;
        try {
            // Use puppeteer-extra to launch
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-blink-features=AutomationControlled',
                    '--window-size=1920,1080',
                ],
            });

            const page = await browser.newPage();

            // Load cookies for "Logged In" simulation
            await this.loadCookies(page);

            // Set user agent to avoid detection (Standard Chrome on Windows)
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

            // Construct search URL
            const searchUrl = `https://shopee.co.id/search?keyword=${encodeURIComponent(query)}`;
            this.logger.log(`Navigating to: ${searchUrl}`);

            // Increased timeout for slow loading sites
            await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });

            // Wait for product items to load with robust selector strategy
            try {
                await page.waitForSelector('div.shopee-search-item-result__item, div[data-sqe="item"]', { timeout: 15000 });
            } catch (e) {
                this.logger.warn('Timeout waiting for selector. Page might have loaded differently, blocked, or requires CAPTCHA.');
            }

            // Extract data
            const products = await page.evaluate(async () => {
                const items = document.querySelectorAll('.shopee-search-item-result__item, div[data-sqe="item"]');
                const results: any[] = [];

                items.forEach((item, index) => {
                    if (index >= 10) return; // Limit to 10 items

                    try {
                        const linkEl = item.querySelector('a');
                        const url = linkEl ? linkEl.href : '';

                        const imgEl = item.querySelector('img');
                        const image = imgEl ? imgEl.src : '';

                        // Try to find title in various common containers
                        const titleEl = item.querySelector('div[data-sqe="name"] > div > div') || item.querySelector('.Cve6sh');
                        const title = titleEl ? titleEl.textContent : 'Unknown Product';

                        const priceEl = item.querySelector('div[data-sqe="item-price"]') || item.querySelector('.ZEgDH9');
                        const rawPrice = priceEl ? priceEl.textContent : '0';
                        const price = parseInt(rawPrice.replace(/\D/g, '') || '0', 10);

                        const rating = 4.5; // Mock 
                        const reviewsCount = 100; // Mock

                        const locationEl = item.querySelector('div.zGGwiV');
                        const location = locationEl ? locationEl.textContent : 'Indonesia';

                        const sellerName = 'Shopee Seller';

                        if (title && url && price > 0) {
                            results.push({
                                title,
                                price,
                                url,
                                image,
                                rating,
                                reviewsCount,
                                location,
                                sellerName
                            });
                        }
                    } catch (err) {
                        // skip item on error
                    }
                });
                return results;
            });

            this.logger.log(`Found ${products.length} products.`);

            return products.map((p, i) => ({
                id: `shopee-${i}-${Date.now()}`,
                title: p.title || `Product ${i + 1}`,
                price: p.price || 0,
                originalPrice: p.price * 1.2,
                discount: 20,
                image: p.image || 'https://via.placeholder.com/300',
                rating: p.rating,
                reviewsCount: p.reviewsCount,
                seller: {
                    name: p.sellerName,
                    rating: 4.8,
                    isOfficial: false,
                    location: p.location,
                },
                shipping: {
                    speed: "Standard",
                    isFree: false
                },
                tags: ["Best Price"],
                url: p.url,
            }));

        } catch (error) {
            this.logger.error(`Error scraping Shopee: ${error.message}`);
            return [];
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}
