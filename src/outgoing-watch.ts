import type { MarketPlaceIds } from "./marketplace-ids";

export type OutgoingWatch = {
    contact: string;
    query: string;
    price: number;
    marketplaceIds: Array<MarketPlaceIds>;
    captchaToken: string;
    dayCount: number;
    verificationCode: number;
}
