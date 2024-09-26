'use client';

import React from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { calculatePercentageRemaining } from '@/lib/utils';

type CountDownProps = {
  auctionEnd: string;
};

const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}) => {
  const remainTime = calculatePercentageRemaining(
    days,
    hours,
    minutes,
    seconds
  );
  return (
    <div className="flex flex-col space-y-2">
      <Badge
        variant={completed ? 'default' : 'destructive'}
        className="w-full h-8"
      >
        {completed ? (
          <span>Finished</span>
        ) : (
          <span suppressHydrationWarning={true}>
            {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:
            {zeroPad(seconds)}
          </span>
        )}
      </Badge>
      <Progress value={remainTime} className="w-full h-2" />
    </div>
  );
};

export default function CountdownTimer({ auctionEnd }: CountDownProps) {
  return (
    <div>
      <Countdown date={auctionEnd} renderer={renderer} />
    </div>
  );
}
