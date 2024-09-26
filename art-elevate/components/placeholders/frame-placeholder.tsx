'use client';

import { Skeleton } from '../ui/skeleton';

export const FramePlaceholder = () => {
  return (
    <div className="flex flex-col mb-2">
      <div className="relative bg-zinc-100 aspect-square overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
};
