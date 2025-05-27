'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwt.decode(token);
      if (decoded?.role) {
        router.replace('/dashboard'); // ke dashboard utama
      } else {
        router.replace('/authentication/login');
      }
    } else {
      router.replace('/authentication/login');
    }
  }, [router]);

  return null;
}
