import {format} from 'date-fns';
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export function formatDateTime(dateTimeString: string): string {
  return format(
      new Date(dateTimeString),
      "MMMM d, yyyy 'at' hh:mm:ss a"
  );
}

export function formatBidStatus(status: string): string {
  switch (status) {
    case 'Accepted':
      return 'Accepted';
    case 'AcceptedBelowReserve':
      return 'Accepted Below Reserve';
    case 'TooLow':
      return 'Too Low';
    case 'Finished':
      return 'Finished';
    default:
      return 'Invalid Status';
  }
}
