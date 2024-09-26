'use client';

import React from 'react';
import { Button } from './ui/button';
import { useArletDeleteModal } from '@/hooks/use-store-modal';

export const DeleteAuctionButton = ({ auctionId }: { auctionId: string }) => {
  const { onOpen } = useArletDeleteModal();
  return (
    <Button
      variant="destructive"
      className="hover:opacity-70"
      onClick={() => onOpen(auctionId)}
    >
      Delete
    </Button>
  );
};
