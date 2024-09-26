'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LoginButton } from './login-btn';
import { User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { User } from '@/types';

export const DropdownMenuBar = ({ user }: { user: User }) => {
  if (!user) {
    return <LoginButton />;
  } else {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex justify-center items-center space-x-3">
            <UserIcon className="w-6 h-6" />
            <span className="text-md">{user.name}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2">
          <DropdownMenuLabel>
            <span className="text-sm text-muted-foreground">
              {user.username}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/session">
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <Link href="/my-auctions">
            <DropdownMenuItem>Auctions</DropdownMenuItem>
          </Link>
          <Link href="/sell">
            <DropdownMenuItem>Sell</DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
};
