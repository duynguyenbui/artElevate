export interface PageResult<T> {
  results: T[];
  pageCount: number;
  totalCount: number;
}

export interface Auction {
  createdAt: string;
  updatedAt: string;
  auctionEnd: string;
  seller: string;
  winner?: string;
  status: string;
  reservePrice: number;
  soldAmount: any;
  currentHighBid: any;
  artist: string;
  name: string;
  description: string;
  height: number;
  width: number;
  medium: string;
  year: number;
  imageUrl: string[];
  id: string;
}

export type Bid = {
  id: string;
  auctionId: string;
  bidder: string;
  bidTime: string;
  amount: number;
  bidStatus: string;
};

export interface SearchParams {
  searchTerm?: string;
  orderBy?: 'artist' | 'new';
  filterBy?: 'finished' | 'endingSoon';
  seller?: string;
  winner?: string;
  pageNumber?: number;
  pageSize?: number;
}

export type AuctionFinished = {
  itemSold: boolean;
  auctionId: string;
  winner?: string;
  seller: string;
  amount?: number;
};

export type User =
  | {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
      username?: string | null | undefined;
    }
  | null
  | undefined;
