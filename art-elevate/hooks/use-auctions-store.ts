import { Auction } from '@/types';
import { create } from 'zustand';

type State = {
  auctions: Auction[];
};

type Actions = {
  setData: (data: Auction[]) => void;
  setCurrentPrice: (auctionId: string, amount: number) => void;
  addData: (auction: Auction) => void;
};

const initialState: State = {
  auctions: [],
};

export const useAuctionStore = create<State & Actions>((set) => ({
  ...initialState,
  setData: (auctions: Auction[]) => {
    set(() => ({
      auctions: auctions,
    }));
  },
  setCurrentPrice: (auctionId: string, amount: number) => {
    set((state) => ({
      auctions: state.auctions.map((auction) =>
        auction.id === auctionId
          ? { ...auction, currentHighBid: amount }
          : auction
      ),
    }));
  },
  addData: (auction: Auction) => {
    set((state) => ({
      auctions: [...state.auctions, auction],
    }));
  },
}));
