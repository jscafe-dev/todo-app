import Image from 'next/image'
import { signOut } from "next-auth/react"

import Button from "@/components/Button"

interface ProfileProps {
    name?: string | null,
    profileImageUrl?: string | null
}

const Profile = (props: ProfileProps) => {
    const {name, profileImageUrl} = props
    return <div className='absolute right-5 top-5 flex items-center'>
        <div>
            <div className='mr-2 text-white'>{name}</div>
            <Button onClick={() => signOut()} externalClass="text-white bg-button1 p-2 rounded text-sm">Sign Out</Button>
        </div>
        {name && profileImageUrl && <Image  className="rounded-full" src={profileImageUrl} alt={name} width={50} height={50}/>}
    </div>
}

export default Profile;