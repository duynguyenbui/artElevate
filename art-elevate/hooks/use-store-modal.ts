import { create } from 'zustand';

interface useArletDeleteModalStore {
  auctionId: string;
  isOpen: boolean;
  onOpen: (auctionId: string) => void;
  onClose: () => void;
}

export const useArletDeleteModal = create<useArletDeleteModalStore>((set) => ({
  auctionId: '',
  isOpen: false,
  onOpen: (auctionId: string) => set({ isOpen: true, auctionId: auctionId }),
  onClose: () => set({ isOpen: false, auctionId: '' }),
}));
