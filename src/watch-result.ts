export type WatchResult = {
    name: string;
    price: number;
    url: string;
    description?: string;
    imageUrl?: string;
}

export type QueryResults = {
    query: string;
    results: Array<WatchResult>;
}
