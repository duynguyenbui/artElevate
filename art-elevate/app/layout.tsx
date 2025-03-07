import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AlertDeleteModal } from '@/components/modals/alert-delete-modal';
import { SignalRProvider } from '@/components/providers/signalr-provider';
import { getCurrentUser } from '@/actions/auth-action';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Art Elevate',
  description: 'Generated by duy nguyen bui',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AlertDeleteModal />
          <Toaster position="bottom-right" />
          <SignalRProvider user={user}>{children}</SignalRProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
