import { MarketPlaceIds } from './marketplace-ids';

export type WatchResult = {
    name: string;
    price: number;
    url: string;
    marketplaceId: MarketPlaceIds;
    description?: string;
    imageUrl?: string;
}

export type QueryResults = {
    query: string;
    results: Array<WatchResult>;
}
