'use client';

import { useTheme } from 'next-themes';
import { ClipLoader } from 'react-spinners';

export const Loader = () => {
  const { theme } = useTheme();
  const color = theme === 'dark' ? '#fff' : '#09090b';
  return <ClipLoader color={color} size={50} />;
};
