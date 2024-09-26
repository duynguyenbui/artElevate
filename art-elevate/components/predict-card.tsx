'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { MessageCircleQuestion, StarIcon, StarsIcon, Trash2Icon } from 'lucide-react';

export const PredictCard = ({ auctionId }: { auctionId: string }) => {
  const [show, setShow] = useState<boolean>(false);
  const [predict, setPredict] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrediction = async (auctionId: string) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.artelevate.com/auctions/predict/${auctionId}`
        );

        console.log(response.data);
        setPredict(response.data);
      } catch (error) {
        console.error('Error fetching prediction:', error);
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      fetchPrediction(auctionId);
    }
  }, [auctionId, show]);

  return (
    <div className="z-50 transition-all fixed right-10 bottom-5 md:bottom-16 md:right-20 rounded-lg">
      {show ? (
        <>
          <div className="grid w-[400px] h-[300px] gap-1 mb-3 shadow-2xl rounded-3xl">
            <Textarea
              isFetchData={loading}
              className="overflow-y-auto rounded-lg text-muted text-sm"
              placeholder={loading ? 'Loading prediction...' : predict}
              readOnly
              disabled={loading}
            />
          </div>
          <Button
            onClick={() => setShow(!show)}
            className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ml-[310px]"
          >
            <Trash2Icon className="h-4 w-5 mr-2" />
            Hide
          </Button>
        </>
      ) : (
        <Button
          onClick={() => setShow(!show)}
          className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
        >
          <StarsIcon className="h-6 w-6 mr-2" />
          Gemini
        </Button>
      )}
    </div>
  );
};
