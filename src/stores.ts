import { BehaviorSubject } from 'rxjs';

import { MarketPlaceIds } from './marketplace-ids';

export type Responses = {
    queryString: string | null;
    currency: '$';
    priceWatch: number | null;
    timeRange: number | null;
    timeUnit: 'days' | 'weeks' | 'months' | null;
    marketplaces: Array<MarketPlaceIds>;
    contact: string;
    mustInclude: Array<string>;
}

export const responses: BehaviorSubject<Responses> = new BehaviorSubject({
    queryString: null,
    currency: '$',
    priceWatch: null,
    timeRange: 14,
    timeUnit: 'days',
    marketplaces: [MarketPlaceIds.Amazon],
    contact: null,
    mustInclude: []
});
