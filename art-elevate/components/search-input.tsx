'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { useParamsStore } from '@/hooks/use-params-store';
import { usePathname } from 'next/navigation';

export const SearchInput = () => {
  const pathname = usePathname();
  const [value, setValue] = useState<string>();
  const debouncedValue = useDebounce(value);
  const { setSearchTerm } = useParamsStore();

  useEffect(() => {
    setSearchTerm(debouncedValue || '');

    // return () => setValue('');
  }, [debouncedValue, setSearchTerm]);

  if (pathname !== '/auctions') {
    return null;
  }

  return (
    <div className="relative mr-2">
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full md:w-[500px] pl-9 rounded-full focus-visible:ring-slate-200 transition duration-0 hover:duration-150 "
        placeholder="Search for a art work"
      />
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
    </div>
  );
};
