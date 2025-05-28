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
      const role = decoded?.role;

      if (role) {
        switch (role) {
          case "OWNER":
          case "ADMIN":
            router.replace('/dashboard');
            break;
          case "USER":
          case "OPERATOR":
            router.replace('/status-barang');
            break;
          default:
            router.replace('/authentication/'); // fallback jika role tidak dikenal
            break;
        }
      } else {
        router.replace('/authentication/');
      }
    } else {
      router.replace('/authentication/');
    }
  }, [router]);

  return null;
}
