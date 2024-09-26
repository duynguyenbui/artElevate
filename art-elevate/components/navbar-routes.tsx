import React from 'react';
import { ModeToggle } from './mode-toggle';
import { Logo } from './logo';
import { SearchInput } from './search-input';
import { NavigationMenuBar } from './navigation-menu';
import { DropdownMenuBar } from './dropdown-menu-bar';
import { getCurrentUser } from '@/actions/auth-action';

export const NavbarRoutes = async () => {
  const user = await getCurrentUser();

  return (
    <div className="hidden animate-out md:flex items-center w-full justify-between">
      <Logo />
      <NavigationMenuBar />
      <SearchInput />
      <div className="flex items-center justify-center space-x-3 mr-5 ">
        <ModeToggle />
        <DropdownMenuBar user={user} />
      </div>
    </div>
  );
};
