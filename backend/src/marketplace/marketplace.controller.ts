import { Controller, Get, Query } from '@nestjs/common';
import { MarketplaceService, Product } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
    constructor(private readonly marketplaceService: MarketplaceService) { }

    @Get('search')
    async search(@Query('q') query: string): Promise<Product[]> {
        return this.marketplaceService.search(query || '');
    }
}
