import { fetchAuctionId } from '@/actions/auction-actions';
import { getCurrentUser } from '@/actions/auth-action';
import { AuctionCard } from '@/components/auction-card';
import { AuctionPlaceholder } from '@/components/placeholders/auction-placeholder';
import { BidCard } from '@/components/bid-card';
import { DeleteAuctionButton } from '@/components/delete-auction-btn';
import { FramePlaceholder } from '@/components/placeholders/frame-placeholder';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/format';
import Link from 'next/link';
import { PredictCard } from '@/components/predict-card';

const BREADCRUMBS = [
  { id: 1, name: 'Home', href: '/' },
  { id: 2, name: 'Auctions', href: '/auctions' },
];

const AuctionIdPage = async ({ params }: { params: { auctionId: string } }) => {
  const { auctionId } = params;

  const user = await getCurrentUser();
  const data = await fetchAuctionId(auctionId).catch((err) => {
    console.log(err);
    return null;
  });

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 md:-mt-20">
        {data ? (
          <>
            <div className="lg:max-w-lg lg:self-end">
              <ol className="flex items-center space-x-2">
                {BREADCRUMBS.map((breadcrumb, i) => (
                  <li key={breadcrumb.href}>
                    <div className="flex items-center text-sm">
                      <Link
                        href={breadcrumb.href}
                        className="font-medium text-sm text-muted-foreground hover:text-gray-900"
                      >
                        {breadcrumb.name}
                      </Link>
                      {i !== BREADCRUMBS.length - 1 ? (
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                          className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                        >
                          <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                        </svg>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-4 flex space-x-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {data.name}
                </h1>
                {user?.username === data.seller && (
                  <>
                    <Link href={`/auctions/${auctionId}/edit`}>
                      <Button variant="secondary" className="hover:opacity-70">
                        Update
                      </Button>
                    </Link>
                    <DeleteAuctionButton auctionId={auctionId!} />
                  </>
                )}
              </div>

              <section className="mt-4">
                <div className="flex items-center">
                  <p className="font-medium">{data.id}</p>

                  <div className="ml-4 border-l text-muted-foreground border-gray-300 pl-4">
                    {data.artist}
                  </div>
                </div>

                <div className="mt-4 space-y-6">
                  <p className="text-base text-muted-foreground">
                    {data.description}
                  </p>
                </div>

                <div className="mt-4 space-y-6">
                  <p className="text-base text-muted-foreground">
                    Created At: {formatDateTime(data?.createdAt)} by{' '}
                    {data.seller}
                  </p>
                </div>
              </section>
              <BidCard auction={data} user={user} />
            </div>
            <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
              <AuctionCard auction={data} index={0} />
            </div>
          </>
        ) : (
          <>
            <FramePlaceholder />
            <AuctionPlaceholder />
          </>
        )}
      </div>
      <PredictCard auctionId={auctionId} />
    </>
  );
};

export default AuctionIdPage;
