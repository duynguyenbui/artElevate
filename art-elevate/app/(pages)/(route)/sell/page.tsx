import { AuctionForm } from '@/components/create-form';
import React from 'react';

const SellPage = () => {
  return (
    <div className="flex-col justify-center items-center md:ml-30 md:mr-30">
      <div className="space-y-4 p-10">
        <AuctionForm />
      </div>
    </div>
  );
};

export default SellPage;
