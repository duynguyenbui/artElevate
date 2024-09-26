import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-[80px] inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <main className="pt-[50px] flex-grow flex-1 p-3">
        {children}
      </main>
      <div className="w-full inset-y-0">
        <Footer />
      </div>
    </div>
  );
};

export default RootLayout;
