import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
  return (
    <Link href="/">
      <Image
        height={100}
        width={100}
        alt="logo"
        src="/logo.svg"
        className="p-5"
      />
    </Link>
  );
};
