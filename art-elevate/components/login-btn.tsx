'use client';

import { signIn } from 'next-auth/react';
import { LogIn } from 'lucide-react';
import { Button } from './ui/button';

export const LoginButton = () => {
  return (
    <Button
      variant="default"
      onClick={() =>
        signIn('id-server', {
          callbackUrl: '/',
        })
      }
    >
      <LogIn className="w-4 h-4 mr-2" />
      Login
    </Button>
  );
};
