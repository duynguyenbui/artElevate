'use client';

import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Send } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { getHeaders } from '@/actions/auth-action';
import { useRouter } from 'next/navigation';
import { Auction } from '@/types';
import { updateAuctionFormSchema } from '@/helpers/update-auction-form-schema';
import { ImageSlider } from './image-slider';

export const UpdateAuctionForm = ({ auction }: { auction: Auction }) => {
  const apiUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://api.artelevate.com'
      : process.env.NEXT_PUBLIC_API_SERVER_URL;

  const router = useRouter();
  const form = useForm<z.infer<typeof updateAuctionFormSchema>>({
    resolver: zodResolver(updateAuctionFormSchema),
    defaultValues: {
      Artist: auction.artist,
      Name: auction.name,
      Description: auction.description,
      Height: auction.height,
      Width: auction.width,
      Medium: auction.medium,
      Year: auction.year,
      ReservePrice: auction.reservePrice,
      AuctionEnd: new Date(auction.auctionEnd),
    },
  });
  async function onSubmit(values: z.infer<typeof updateAuctionFormSchema>) {
    try {
      const res = await axios.patch(
        `${apiUrl}/auctions/${auction.id}`,
        values,
        {
          headers: {
            Authorization: await getHeaders(),
          },
        }
      );
      toast.success('Update auction successfully!');
      router.push(`/auctions/${auction.id}`);
      router.refresh();
    } catch (error) {
      console.error('An error occurred during the PATCH request:', error);
      toast.error('Auction has not been updated! Please try again later!');
    }
  }

  return (
    <>
      <div className="flex justify-between items-center space-x-2">
        <div className="md:text-6xl text-4xl font-bold text-start overflow-x-hidden">
          {form.watch('Name').length > 0
            ? form.getValues('Name')
            : 'Auction Form'}
          <p className="text-xs text-muted-foreground">
            {form.watch('Name').length > 0
              ? form.getValues('Artist')
              : 'Artist Name'}
          </p>
        </div>
        <div className="w-[200px] h-[200px] mr-36">
          <ImageSlider urls={auction.imageUrl} />
        </div>
      </div>
      <Form {...form}>
        <form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className="md:grid md:grid-cols-3 md:gap-5"
        >
          <FormField
            control={form.control}
            name="Artist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Artist</FormLabel>
                <FormControl>
                  <Input placeholder="Artist" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height(cm)</FormLabel>
                <FormControl>
                  <Input placeholder="Height" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width(cm)</FormLabel>
                <FormControl>
                  <Input placeholder="Width" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Medium"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medium</FormLabel>
                <FormControl>
                  <Input placeholder="Medium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input placeholder="Year" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ReservePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reserve Price</FormLabel>
                <FormControl>
                  <Input placeholder="Reserve Price" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="AuctionEnd"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-2">
                <FormLabel>Auction End</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'text-left',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Auction End</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="mt-2"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};
