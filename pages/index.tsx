import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { LogIn } from 'lucide-react';

import GradientButton from "@/components/Button/gradientButton";
import Profile from "@/components/Profile";

export default function Home() {
  const { data: session, status } = useSession()

  const isLoggedIn = status === 'authenticated'
  return (
    <div className="bg-primaryBlack">
      {isLoggedIn ? <Profile name={session?.user?.name} profileImageUrl={session?.user?.image} /> : <GradientButton onClick={() => signIn("google")}>
        Sigin <LogIn className="ml-2" size={20} />
      </GradientButton>}
    </div>
  )
}
