'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useArletDeleteModal } from '@/hooks/use-store-modal';
import { toast } from 'sonner';
import { Separator } from '../ui/separator';
import { getHeaders } from '@/actions/auth-action';
import { useRouter } from 'next/navigation';

export const AlertDeleteModal = () => {
  const apiUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://api.artelevate.com'
      : process.env.NEXT_PUBLIC_API_SERVER_URL;

  const alertModal = useArletDeleteModal();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${apiUrl}/auctions/${alertModal.auctionId}`,
        {
          headers: {
            Authorization: await getHeaders(),
          },
        }
      );
      toast.success('Deleting auction seccessfully');
      router.push('/auctions');
      router.refresh();
      alertModal.onClose();
    } catch (error) {
      toast.error('Cannot deleting auction');
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={alertModal.isOpen} onOpenChange={alertModal.onClose}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">Warning</DialogTitle>
          <DialogDescription className="text-center space-y-2">
            Are your sure to{' '}
            <span className="text-red-500 font-medium">Delete</span> this
            auction?
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={alertModal.onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={loading} variant="destructive">
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
