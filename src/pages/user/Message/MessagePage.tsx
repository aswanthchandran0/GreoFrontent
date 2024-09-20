import { useEffect, useState } from "react";
import ShortSidebar from "../../../components/user/ShortSideBar";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { getChatsApi, getUserByIdApi } from "../../../service/api";
import Conversation from "../../../components/user/chat/conversation/Conversation";
import ChatBox from "../../../components/user/chat/chatBox/ChatBox";
import { User } from "../../../features/user/auth/authSlice";



interface Chat{
  id:string
    members:string[]
    timeStamb:Date
}

const MessagePage = () => {
  const userId = useParams().userId
  const viewingUser = useSelector((state: RootState) => state.userAuth.user)
  const [user, setUser] = useState<User | null>(null)
  const [chats,setChats] = useState<Chat[] | []>([])
  const navigate = useNavigate()
  const [currentChat,setCurrentChat] = useState<Chat|null>(null)
  const [selectedUserData,setSelectedUserData] = useState<User|null>(null)
  const fetchUser = async () => {
    const response = await getUserByIdApi(userId || '')
    setUser(response.data)
  }

  useEffect(() => {
    if(userId){
      fetchUser()
    }else{
      console.error("userId is undefined")
    }

  }, [userId])

    //get chats
      useEffect(()=>{
        const fetchChats = async ()=>{
          const {data} = await getChatsApi(viewingUser?.id || '')
          setChats(data)
        
        }

        fetchChats()
      },[viewingUser])

    
      const handleConversationClick = async(chat: Chat) => {
          setCurrentChat(chat)
          const userId = chat.members.find((id)=>id!==viewingUser?.id)
        if(userId){
          const {data} = await getUserByIdApi(userId)
          setSelectedUserData(data)
        }
          navigate(`/chat/${chat.id}`)
      }

  return (
    <>
      <div className="flex">

        <ShortSidebar />
        <div className="flex flex-col w-full h-screen">
         
<ChatBox 
chat={currentChat} 
currentUser={viewingUser?.id || ''}
 userData={selectedUserData}
/>

        </div>
        <div className="flex flex-col w-full h-screen max-w-sm border border-l">
          <div className="flex justify-between  items-center bg-secondary max-h-20 mb-2   p-5  w-full">

            <p className="font-lato text-lg text-text_white font-bold cursor-pointer">Tokyo__</p>
            <GiHamburgerMenu className="text-text_white text-xl cursor-pointer" />
          </div>
          <div className="overflow-y-auto custom-scrollbar">


           
           {
            chats.map((chat,index)=>(
             <div key={index} 
             onClick={()=>handleConversationClick(chat)}
             >
              <Conversation data={chat} currentUserId={viewingUser?.id || null} />
             </div>
            ))
           }
         
            </div>

        </div>
      </div>
    </>
  )
}


export default MessagePage