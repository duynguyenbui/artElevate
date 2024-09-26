import * as React from 'react';

import { cn } from '@/lib/utils';
import { Loader } from './loader';

export interface LoadingProps {
  isFetchData?: boolean;
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export type TextareaPropsWithLoadingProps = LoadingProps & TextareaProps;

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaPropsWithLoadingProps
>(({ className, isFetchData, ...props }, ref) => {
  return (
    <>
      {isFetchData != null ? (
        isFetchData ? (
          <div className="flex justify-center items-center min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <Loader />
          </div>
        ) : (
          <textarea
            className={cn(
              'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            ref={ref}
            {...props}
          />
        )
      ) : (
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
      )}
    </>
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
