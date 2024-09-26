'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Auction } from '@/types';
import { AuctionCard } from './auction-card';
import { useAuctionStore } from '@/hooks/use-auctions-store';

interface AuctionsReelProps {
  title: string;
  subtitle?: string;
  href?: string;
  auctions?: Auction[];
}

export const AuctionsReel = ({
  title,
  subtitle,
  href,
  auctions,
}: AuctionsReelProps) => {
  const state = useAuctionStore();

  useEffect(() => {
    state.setData(auctions!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctions]);

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          {title ? (
            <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {href ? (
          <Link
            href={href}
            className="hidden text-md font-medium text-blue-600 hover:text-blue-500 md:block"
          >
            Visit the auctions <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : null}
      </div>
      <div className="sm:grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5">
        {state.auctions &&
          state.auctions
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .filter((a) => a.status !== 'Finished')
            .slice(0, 4) // Take only the first 4 items
            .map((auction, i) => (
              <AuctionCard auction={auction} key={i} index={i} />
            ))}
      </div>
    </>
  );
};
