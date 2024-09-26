import { fetchAuctionId } from '@/actions/auction-actions';
import { getCurrentUser } from '@/actions/auth-action';
import { UpdateAuctionForm } from '@/components/update-form';
import { redirect } from 'next/navigation';
import React from 'react';

const EditPage = async ({ params }: { params: { auctionId: string } }) => {
  const { auctionId } = params;

  const user = await getCurrentUser();
  const auction = await fetchAuctionId(auctionId);

  if (user?.username !== auction.seller) {
    return redirect(`/auctions/${auctionId}`);
  }

  return (
    <div className="p-5 m-2">
      <UpdateAuctionForm auction={auction} />
    </div>
  );
};

export default EditPage;
