import './globals.css'
import { getServerSession } from 'next-auth'
import SessionProvider from "@/components/SessionProvider";
import AdminLayout from '@/components/AdminLayout';
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: 'eCommerce',
  description: 'Generated by create next app',
}

export default async function RootLayout({ children }) {

  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="">
        <SessionProvider session={session}>
          <main>
            {/* <AdminLayout /> */}
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}