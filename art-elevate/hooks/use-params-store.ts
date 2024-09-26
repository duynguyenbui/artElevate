import { SearchParams } from '@/types';
import { create } from 'zustand';

const initialState: SearchParams = {
  pageNumber: 1,
  pageSize: 4,
  searchTerm: '',
  orderBy: 'new',
  filterBy: 'endingSoon',
  seller: '',
  winner: '',
};

type SearchParamsState = {
  searchParams: SearchParams;
  setPageNumber: (number: number) => void;
  setParams: (params: Partial<SearchParams>) => void;
  setSearchTerm: (value: string) => void;
  reset: () => void;
};

export const useParamsStore = create<SearchParamsState>((set) => ({
  searchParams: initialState,
  setParams: (newParams: Partial<SearchParams>) => {
    set((state) => {
      if (newParams.pageNumber) {
        return {
          ...state,
          searchParams: {
            ...state.searchParams,
            pageNumber: newParams.pageNumber,
          },
        };
      } else {
        return {
          ...state,
          searchParams: { ...state.searchParams, ...newParams, pageNumber: 1 },
        };
      }
    });
  },
  setPageNumber: (number: number) => {
    set((state) => ({
      searchParams: { ...state.searchParams, pageNumber: number },
    }));
  },
  reset: () => set({ searchParams: initialState }),
  setSearchTerm: (value: string) => {
    set((state) => ({
      searchParams: { ...state.searchParams, searchTerm: value },
    }));
  },
}));
