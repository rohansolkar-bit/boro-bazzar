import './globals.css';
import { UserAuthProvider } from '@/src/context/UserAuthContext.js';
import { ApiErrorProvider } from '@/src/components/ApiErrorToast';
import AxiosErrorBridge from '@/src/components/AxiosErrorBridge';
import PublicShell from '@/src/components/PublicShell';

export const metadata = {
  title: 'NextVibe — Modern Next.js App',
  description: 'A stunning Next.js app with Tailwind CSS, App Router, and modern UI design.',
  keywords: 'Next.js, Tailwind CSS, App Router, Modern UI, JavaScript',
  openGraph: {
    title: 'NextVibe — Modern Next.js App',
    description: 'A stunning Next.js app built with Next.js App Router and Tailwind CSS.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0a0a0f] text-slate-100" suppressHydrationWarning>
        <ApiErrorProvider>
          <UserAuthProvider>
            <AxiosErrorBridge />
            <PublicShell>
              {children}
            </PublicShell>
          </UserAuthProvider>
        </ApiErrorProvider>
      </body>
    </html>
  );
}
