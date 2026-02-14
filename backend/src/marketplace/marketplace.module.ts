import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { ScraperService } from './scraper.service';

@Module({
    controllers: [MarketplaceController],
    providers: [MarketplaceService, ScraperService],
})
export class MarketplaceModule { }
