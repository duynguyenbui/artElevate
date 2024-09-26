import { getAuctions } from '@/actions/auction-actions';
import { AuctionsReel } from '@/components/auction-reel';
import { Auction } from '@/types';
import React from 'react';

const RootPage = async () => {
  let auctions: Auction[] = [];
  await getAuctions({
    pageNumber: 1,
    orderBy: 'new',
  })
    .then((res) => (auctions = res.results))
    .catch((err) => {
      console.log(err);
      auctions = [];
    });

  return (
    <AuctionsReel
      title={'Recently auctions updated'}
      subtitle="Many auction details can be found here"
      href="/auctions"
      auctions={auctions}
    />
  );
};

export default RootPage;
