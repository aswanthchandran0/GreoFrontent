import React, { useDebugValue, useEffect, useState } from "react";
import {getUserByIdApi } from "../../../../service/api";
import { toast } from "react-toastify";
import { PROFILE_DEFAULT_IMAGE } from "../../../../assets/images";
import { User } from "../../../../features/user/auth/authSlice";
interface Chat {
    id: string;
    members: string[];
    timeStamb: Date;
  }
  
  interface ConversationProps {
    data: Chat;
    currentUserId: string|null;
  }


  
  const Conversation = ({ data, currentUserId }: ConversationProps) => {
    const [userData, setUserData] = useState<User | null>(null);
    useEffect(()=>{
      const userId = data.members.find((id)=>id!==currentUserId)
      const getUserData = async()=>{
        const {data} = await getUserByIdApi(userId?userId:'')
        console.log('user data',data)
          setUserData(data)
        }
        if(data !== null)getUserData()
       },[data,currentUserId])
       
       return (
        <>
         <>
            <div className="flex flex-row bg-secondary m-1 p-2 h-16 rounded-lg gap-2">
      <div className="h-12 w-12  rounded-md border-2 overflow-hidden cursor-pointer">
        <img className="object-cover  w-full h-full" src={userData && userData.profileImage !== '' ? userData.profileImage : PROFILE_DEFAULT_IMAGE} alt="" />
      </div>
      <div className="flex flex-col ">
        <p className="font-lato font-bold text-md"> {userData?(userData.name?userData.name:userData.user_name):''}</p>
        <p className="font-lato  text-sm font-medium">{''}</p>
      </div>

      <div className="flex items-end ">
        <p className="font-lato py-1 text-sm font-medium  before:content-['•'] before:mr-1 text-primary">1h</p>
      </div>
      </div>

          </>
      


            <div className="flex flex-row bg-secondary bg-opacity-40 m-1 p-2 h-16 rounded-lg gap-2">
              <div className="h-12 w-12  rounded-md border-2 overflow-hidden cursor-pointer">
                <img className="object-cover  w-full h-full" src="3d-illustration-cute-cartoon-boy-with-backpack-his-back.jpg" alt="" />
              </div>
              <div className="flex flex-col ">
                <p className="font-lato font-bold text-md">Livia</p>
                <p className="font-lato  text-sm font-medium">Great job</p>
              </div>

              <div className="flex items-end ">
                <p className="font-lato py-1 text-sm font-medium  before:content-['•'] before:mr-1 text-primary">1h</p>
              </div>
            </div>

        </>
    )
}


export default Conversation