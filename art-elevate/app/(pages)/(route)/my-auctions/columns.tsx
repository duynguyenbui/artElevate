'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDateTime, formatPrice } from '@/lib/format';
import { Auction } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export const columns: ColumnDef<Auction>[] = [
  {
    accessorKey: 'artist',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Artist
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'reservePrice',
    header: 'Reserve Price',
    cell: ({ row }) => {
      return <div>{formatPrice(row.getValue('reservePrice'))}</div>;
    },
  },

  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => <>{formatDateTime(row.getValue('createdAt'))}</>,
  },
  {
    accessorKey: 'auctionEnd',
    header: 'Auction End',
    cell: ({ row }) => <>{formatDateTime(row.getValue('auctionEnd'))}</>,
  },
  {
    accessorKey: 'soldAmount',
    header: 'Sold Amount',
    cell: ({ row }) => {
      return <div>{formatPrice(row.getValue('soldAmount'))}</div>;
    },
  },
  {
    accessorKey: 'currentHighBid',
    header: 'Current High Bid',
    cell: ({ row }) => {
      return <div>{formatPrice(row.getValue('currentHighBid'))}</div>;
    },
  },
  {
    accessorKey: 'winner',
    header: 'Winner',
  },

  {
    accessorKey: 'height',
    header: 'Height',
  },
  {
    accessorKey: 'width',
    header: 'Width',
  },
  {
    accessorKey: 'medium',
    header: 'Medium',
  },
  {
    accessorKey: 'year',
    header: 'Year',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const auction = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(auction.id)}
            >
              Copy auction ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/auctions/${auction.id}`}>View Details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
