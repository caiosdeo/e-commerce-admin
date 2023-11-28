"use client";
import { useSession, signIn, signOut } from "next-auth/react"
import AdminLayout from "@/components/AdminLayout";

export default function Home() {
  const { data: session } = useSession()

  if(!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg">Login with Google</button>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300 text-black gap-1 rounded-lg overflow-hidden">
          <img 
            src={session?.user?.image} 
            alt="User profile picture"
            className="h-6 w-6"
          />
          <span className="px-2">
            {session?.user?.name}
          </span>
        </div>
      </div>
    </AdminLayout>
  );
// TODO pesquisar o Image src pq ta errado
}