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
import { createAuctionFormSchema } from '@/helpers/create-auction-form-schema';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { Textarea } from './ui/textarea';

export const AuctionForm = () => {
  const apiUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://api.artelevate.com'
      : process.env.NEXT_PUBLIC_API_SERVER_URL;

  const fileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof createAuctionFormSchema>>({
    resolver: zodResolver(createAuctionFormSchema),
    defaultValues: {
      Name: '',
    },
  });

  async function onSubmit(values: any) {
    try {
      if (fileInput.current) {
        const files = Array.from(fileInput.current.files!);
        const formData = new FormData();

        files.forEach((file) => {
          formData.append('Files', file);
        });

        let date = new Date(values.AuctionEnd);
        var dateString = date.toISOString();

        for (const key in values) {
          if (key === 'AuctionEnd') {
            formData.append(key, dateString);
          } else {
            formData.append(key, values[key]);
          }
        }

        try {
          const response = await axios.post(`${apiUrl}/auctions`, formData, {
            headers: {
              Authorization: await getHeaders(),
              'Content-Type': 'multipart/form-data',
            },
          });
          toast.success('Auction has been createed successfully');
          router.push(`/auctions/${response.data.id}`);
        } catch (error) {
          console.error('Error uploading files:', error);
        }
      }
    } catch (error) {
      console.error('An error occurred during the POST request:', error);
      toast.error('Auction has not been created! Please try again later!');
    }
  }

  return (
    <>
      <div className="flex justify-start items-center">
        <h1 className="text-5xl font-bold text-start mb-2">
          {form.watch('Name').length > 0
            ? form.getValues('Name')
            : 'Auction Form'}
          <p className="text-xs text-muted-foreground">
            {form.watch('Name').length > 0
              ? form.getValues('Artist')
              : 'Artist Name'}
          </p>
        </h1>
      </div>
      <Form {...form}>
        <form
          encType="multipart/form-data"
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
                  <Input
                    placeholder="Name"
                    {...field}
                    // onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="AuctionEnd"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-2.5">
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
          <div className="mt-2 mb-4">
            <FormLabel>Files</FormLabel>
            <Input type="file" id="files" ref={fileInput} multiple />
          </div>
          <FormField
            control={form.control}
            name="Description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about your auction"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="mt-5"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};
