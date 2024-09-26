import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';
import { getCurrentUser } from '@/actions/auth-action';

export const MobileSidebar = async () => {
  const user = await getCurrentUser();
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-secondary pt-10 w-32">
        <Sidebar user={user}/>
      </SheetContent>
    </Sheet>
  );
};
