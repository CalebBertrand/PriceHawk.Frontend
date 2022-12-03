import { MarketPlaceIds } from "./marketplaces";

export type OutgoingWatch = {
    query: string;
    price: number;
    marketplaceIds: Array<MarketPlaceIds>;
    captchaToken: string;
    dayCount: number;
}
