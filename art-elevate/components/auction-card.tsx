'use client';

import { formatPrice } from '@/lib/format';
import { ImageSlider } from './image-slider';
import Link from 'next/link';
import CountdownTimer from './count-down';
import { Auction } from '@/types';
import { useEffect, useState } from 'react';
import { AuctionPlaceholder } from './placeholders/auction-placeholder';

interface ProductCardProps {
  auction: Auction;
  index: number;
}

export const AuctionCard = ({ auction, index }: ProductCardProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  if (isVisible) return <AuctionPlaceholder />;

  return (
    <div className="shadow-md hover:shadow-none">
      <Link href={`/auctions/${auction.id}`}>
        <div className="flex flex-col hover:bg-gray-100 dark:hover:bg-gray-500 rounded-lg transition-all p-3">
          <ImageSlider urls={auction.imageUrl} />
          <div className="flex justify-between">
            <div>
              <h2 className="mt-4 font-medium text-lg text-gray-700 dark:text-white">
                {auction.name} | {auction.year}
              </h2>
              <h3 className="mt-1 text-md text-gray-500 dark:text-white">
                {auction.artist}
              </h3>
              <p className="mt-1 font-medium text-sm text-gray-900 dark:text-white">
                {formatPrice(auction.reservePrice)}
              </p>
            </div>
            <div className="mr-2 p-2 items-center flex flex-col justify-center space-y-2">
              <p className="mt-1 font-medium text-sm text-gray-900 dark:text-white">
                {!auction.currentHighBid
                  ? 'No bids'
                  : formatPrice(auction.currentHighBid)}
              </p>
              <CountdownTimer auctionEnd={auction.auctionEnd} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
