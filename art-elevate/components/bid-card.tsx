'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import React, { useEffect, useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Auction } from '@/types';
import { useBidsStore } from '@/hooks/use-bids-store';
import { BidLabel } from './bid-label';
import { getBidsForAuction } from '@/actions/auction-actions';
import { toast } from 'sonner';
import { Loader } from './ui/loader';
import { BidForm } from './bid-form';
import { isAfter, parseISO } from 'date-fns';
import { User } from '@/types';

export const BidCard = ({
  auction,
  user,
}: {
  auction: Auction;
  user: User;
}) => {
  const [loading, setLoading] = useState(true);
  const { bids, setBids } = useBidsStore();

  useEffect(() => {
    getBidsForAuction(auction.id)
      .then((res) => setBids(res))
      .catch((error) =>
        toast.error('Error while retrieving bids for this auction!', {
          description: error.message,
        })
      )
      .finally(() => setLoading(false));
  }, [auction.id, setBids]);

  return (
    <Card className="mt-5 shadow-sm">
      <CardHeader>
        <CardTitle>Auction Bid Placed</CardTitle>
        <CardDescription>This is history of this auction</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[300px] w-full rounded-md p-5 overflow-hidden"'>
          {loading ? (
            <div className="flex justify-center items-center flex-col mt-20">
              <Loader />
            </div>
          ) : (
            bids.map((bid) => (
              <BidLabel
                amount={bid.amount}
                reservePrice={auction.reservePrice}
                bidStatus={bid.bidStatus}
                bidTime={bid.bidTime}
                bidder={bid.bidder}
                key={bid.id}
              />
            ))
          )}
        </ScrollArea>
      </CardContent>
      {user &&
        user?.username !== auction.seller &&
        !loading &&
        auction.status !== 'Finished' &&
        auction.auctionEnd &&
        isAfter(parseISO(auction.auctionEnd), new Date()) && (
          <CardFooter className="border-t flex justify-center">
            <BidForm auctionId={auction.id} highBid={auction.currentHighBid} />
          </CardFooter>
        )}
    </Card>
  );
};
