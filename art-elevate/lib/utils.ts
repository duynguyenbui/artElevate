import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculatePercentageRemaining(
  days: number,
  hours: number,
  minutes: number,
  seconds: number
): number {
  const totalSeconds =
    days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;

  // Get the current date and time
  const currentDate = new Date();

  // Calculate the total seconds until the provided time
  const targetDate = new Date(currentDate);
  targetDate.setDate(currentDate.getDate() + days);
  targetDate.setHours(hours, minutes, seconds, 0);
  const remainingSeconds = Math.floor(
    (targetDate.getTime() - currentDate.getTime()) / 1000
  );

  // Calculate the percentage remaining
  const percentageRemaining = (remainingSeconds / totalSeconds) * 100;

  return percentageRemaining;
}

import { ChangeEvent } from 'react';

export function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const dataTransfer = new DataTransfer();

  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image)
  );

  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(event.target.files![0]);

  return { files, displayUrl };
}
