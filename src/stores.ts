import { Writable, writable } from 'svelte/store';

export type Responses = {
    queryString: string | null;
    currency: '$';
    priceWatch: number | null;
    timeRange: number | null;
    timeUnit: 'days' | 'weeks' | 'months' | null;
    marketplaces: Array<number>;
}

export const responses: Writable<Responses> = writable({
    queryString: null,
    currency: '$',
    priceWatch: null,
    timeRange: 14,
    timeUnit: 'days',
    marketplaces: []
});