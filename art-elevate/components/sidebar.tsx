'use client';

import { cn } from '@/lib/utils';
import {
  Home,
  LogIn,
  LogOut,
  Paintbrush,
  ShoppingBag,
  User,
  User2,
} from 'lucide-react';
import { signIn, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { ModeToggle } from './mode-toggle';

const routes = [
  {
    icon: Home,
    href: '/',
    label: 'Home',
  },
  {
    icon: Paintbrush,
    href: '/auctions',
    label: 'Auctions',
  },
  {
    icon: ShoppingBag,
    href: '/sell',
    label: 'Create',
  },
  {
    icon: User,
    href: '/session',
    label: 'Profile',
  },
  {
    icon: LogOut,
    label: 'Logout',
  },
];

export const Sidebar = ({ user }: { user?: any }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="space-y-4 flex flex-col h-full text-primary bg-secondary">
      <div className="p-3 flex-1 flex justify-center">
        <div className="space-y-2">
          {user ? (
            routes.map((route) => (
              <div
                onClick={
                  route.label !== 'Logout'
                    ? () => router.push(route.href!)
                    : () => signOut({ callbackUrl: '/' })
                }
                key={route.href}
                className={cn(
                  'text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
                  pathname === route.href && 'bg-primary/10 text-primary'
                )}
              >
                <div className="flex flex-col gap-y-2 items-center flex-1">
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </div>
              </div>
            ))
          ) : (
            <div
              className="flex flex-col gap-y-2 items-center flex-1 mt-2"
              onClick={() => signIn('id-server')}
            >
              <LogIn className="h-5 w-5" />
              Sign In
            </div>
          )}
        </div>
      </div>
      {user && (
        <div className="p-3 flex items-center justify-center">
          <div className="space-y-2 mb-5 text-muted-foreground">
            <ModeToggle />
          </div>
        </div>
      )}
    </div>
  );
};
