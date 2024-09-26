'use server';

import { authOptions } from '@/types/auth-options';
import { NextApiRequest } from 'next';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session) return null;
    return session.user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getTokenWorkAround() {
  const req = {
    headers: Object.fromEntries(headers() as Headers),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value])
    ),
  } as NextApiRequest;

  return await getToken({ req });
}

export async function getHeaders() {
  const token = await getTokenWorkAround();
  if (token) {
    return 'Bearer ' + token.access_token;
  }
  return null;
}
