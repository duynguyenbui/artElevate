'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type BidFormProps = {
  auctionId: string;
  highBid: number;
};

import * as z from 'zod';
import { useBidsStore } from '@/hooks/use-bids-store';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { placeBidForAuctionAmount } from '@/actions/auction-actions';
import { formatPrice } from '@/lib/format';

export const BidForm = ({ auctionId, highBid }: BidFormProps) => {
  const { addBid } = useBidsStore();

  const bidFormSchema = z.object({
    amount: z.coerce.number().min(highBid, {
      message: `Amount must be at least ${highBid + 1}`,
    }),
  });

  const form = useForm<z.infer<typeof bidFormSchema>>({
    resolver: zodResolver(bidFormSchema),
    defaultValues: {
      amount: highBid || 0,
    },
  });

  async function onSubmit(values: z.infer<typeof bidFormSchema>) {
    try {
      const res = await placeBidForAuctionAmount(auctionId, values.amount);
      console.log(res);
      addBid(res);
      toast.success('Placed Bid Successfully', {
        description: `You have bided for this auction with ${formatPrice(
          values.amount
        )}`,
      });
    } catch (error: any) {
      console.log(error);
      toast.error('Failed to place bid for this auction', {
        description: error.message || '',
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-x-5 items-center flex-1 flex"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex-1 mt-2 flex space-x-4 items-center">
              <FormLabel>Amount</FormLabel>
              <div>
                <FormControl>
                  <Input placeholder="Amount" {...field} type="number" />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-3.5"
          disabled={form.formState.isSubmitting}
        >
          <ShoppingCart className="w-6 h-6 mr-2" />
          Place Bid
        </Button>
      </form>
    </Form>
  );
};
