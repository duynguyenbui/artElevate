import { Bid } from '@/types';
import { create } from 'zustand';

type State = {
  bids: Bid[];
};

type Actions = {
  setBids: (bids: Bid[]) => void;
  addBid: (bid: Bid) => void;
};

export const useBidsStore = create<State & Actions>((set) => ({
  bids: [],
  setBids: (bids: Bid[]) => {
    set(() => ({
      bids,
    }));
  },
  addBid: (bid: Bid) => {
    set((state) => ({
      bids:
        !state.bids.find((x) => x.id === bid.id) &&
        state.bids.filter((x) => x.auctionId)
          ? [bid, ...state.bids]
          : [...state.bids],
    }));
  },
}));
