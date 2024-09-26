'use client';

import { formatDateTime, formatPrice } from '@/lib/format';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatBidStatus } from '@/lib/format';

interface CurrentBidProps {
  bidder: string;
  bidTime: string;
  amount: number;
  bidStatus: string;
  reservePrice: number;
}

export const BidLabel = ({
  amount,
  reservePrice,
  bidStatus,
  bidTime,
  bidder,
}: CurrentBidProps) => {
  const text = amount ? formatPrice(amount) : 'Error';

  return (
    <Alert
      className={cn(
        'mb-2',
        amount && amount > reservePrice ? 'bg-green-500/50' : 'bg-red-500/50'
      )}
    >
      <Terminal className="h-4 w-4" />
      <AlertTitle>
        {text} <span className="text-sm">by {bidder}</span>
      </AlertTitle>
      <AlertDescription>
        <h2 className="text-sm">{formatBidStatus(bidStatus)}</h2>
        <p className="text-xs">{formatDateTime(bidTime)}</p>
      </AlertDescription>
    </Alert>
  );
};
