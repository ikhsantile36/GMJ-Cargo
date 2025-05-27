// app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/authentication'); // atau '/authentication/login-user' kalau mau lebih spesifik
}
