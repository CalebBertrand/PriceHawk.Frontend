import { Writable, writable } from 'svelte/store';

import type { MarketPlaceIds } from './marketplaces';

export type Responses = {
    queryString: string | null;
    currency: '$';
    priceWatch: number | null;
    timeRange: number | null;
    timeUnit: 'days' | 'weeks' | 'months' | null;
    marketplaces: Array<MarketPlaceIds>;
}

export const responses: Writable<Responses> = writable({
    queryString: null,
    currency: '$',
    priceWatch: null,
    timeRange: 14,
    timeUnit: 'days',
    marketplaces: []
});
