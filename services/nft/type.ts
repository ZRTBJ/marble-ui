export interface NftInfo {
    readonly tokenId: string;
    readonly image: string;
    readonly title: string;
    readonly user: string;
    readonly price: string;
    readonly total: number;
}
export interface NftCategory {
    readonly id: string;
    readonly slug: string;
    readonly name: string;
}
export interface NftCollection {
    readonly id: number;
    readonly image: string;
    readonly num_tokens: number;
    readonly name: string;
    readonly description: string;
    readonly creator: string;
    readonly banner_image: string;
    readonly slug: string;
    readonly cat_ids: string;
}