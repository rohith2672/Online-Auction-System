export interface Item {
    id: string;
    sellerId: string;
    sellerUsername: string;
    name: string;
    description: string;
    startingPrice: number;
    currentPrice: number;
    startTime: string;
    endTime: string;
    imageUrl: string | null;
    status: 'ACTIVE' | 'ENDED' | 'CANCELLED';
}
