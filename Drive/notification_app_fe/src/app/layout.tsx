import type {Metadata} from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Notification Center',
  description: 'A responsive dashboard for notifications built with Next.js and Material UI.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
