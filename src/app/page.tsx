import { redirect } from 'next/navigation';

export default function Home() {
  // We will eventually check auth here and redirect to /admin, /user, or /login
  // For now, redirect to login
  redirect('/login');
}
