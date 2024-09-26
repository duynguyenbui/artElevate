'use client';

import { ReactNode, useEffect, useState } from 'react';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
} from '@microsoft/signalr';
import { useBidsStore } from '@/hooks/use-bids-store';
import { Auction, AuctionFinished, Bid } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import { useAuctionStore } from '@/hooks/use-auctions-store';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';

interface SignalRProviderProps {
  children: ReactNode;
  user:
    | ({
        username: string;
      } & {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
      })
    | null;
}

export const SignalRProvider = ({ children, user }: SignalRProviderProps) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const router = useRouter();
  const params = useParams();
  const { addBid } = useBidsStore();
  const { setCurrentPrice, addData } = useAuctionStore();

  const apiUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://api.artelevate.com/notifications'
      : process.env.NEXT_PUBLIC_NOTIFY_URL;

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(apiUrl!, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(connection);
  }, [apiUrl]);

  useEffect(() => {
    const listen = (connection: HubConnection) => {
      connection.on('BidPlaced', (bid: Bid) => {
        setCurrentPrice(bid.auctionId, bid.amount);
        if (params.auctionId) {
          if (params.auctionId === bid.auctionId) {
            addBid(bid);
          }
        }
      });

      connection.on('AuctionCreated', (auction: Auction) => {
        addData(auction);
        if (user?.username !== auction.seller) {
          toast.message('A new art work has been created!', {
            description: `With ${auction.name} and ${auction.artist}`,
            action: {
              label: 'See now!!',
              onClick: () => router.push(`/auctions/${auction.id}`),
            },
          });
        }
      });

      connection.on('AuctionFinished', (auction: AuctionFinished) => {
        if (user?.username !== auction.seller) {
          toast.message('A new art work has been finished!', {
            description: `With ${
              auction.amount ? formatPrice(auction.amount) : 'no sold'
            } and ${auction.seller}`,
            action: {
              label: 'Checkout',
              onClick: () => router.push(`/auctions/${auction.auctionId}`),
            },
          });
        }
      });
    };

    if (connection) {
      connection
        .start()
        .then(() => listen(connection))
        .catch((error: any) => {
          if (connection.state === 'Disconnected') {
            connection.start().then(() => listen(connection));
          } else {
            console.log(error.message);
          }
        });
    }

    return () => {
      connection?.stop();
    };
  }, [
    addBid,
    addData,
    connection,
    params.auctionId,
    router,
    setCurrentPrice,
    user?.username,
  ]);

  return children;
};
