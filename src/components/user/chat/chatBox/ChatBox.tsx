import React, { useEffect, useState } from "react";
import { AiFillAudio,} from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { FaImage, FaLock } from "react-icons/fa6";
import { IoCallOutline, IoSend, IoVideocamOutline } from "react-icons/io5";
import { User } from "../../../../features/user/auth/authSlice";
import { getMessagesApi,} from "../../../../service/api";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoChatbubblesOutline } from "react-icons/io5";
import { PROFILE_DEFAULT_IMAGE } from "../../../../assets/images";
import dayjs from "dayjs";
import EmojiInput from 'react-input-emoji';

interface Chat {
  id: string;
  members: string[];
  timeStamb: Date;
}

interface chatBoxProps {
  chat: Chat | null;
  currentUser: string;
  userData: User | null; // <-- Accept userData as a prop
}

interface Message {
  chatId: string;
  senderId: string;
  text: string;
  updatedAt:string
}

function ChatBox({ chat, currentUser, userData }: chatBoxProps) {
  const [messages, setMessages] = useState<Message[] | null>([]);
  const [newMessage,setNewMessage] = useState<string>('')
  const [isTyping,setIsTyping] = useState(false)
  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (chat) {
        const { data } = await getMessagesApi(chat.id);
        setMessages(data);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]); 

  // time convertion
  const timeConversion = (timeString: string) => {
    return dayjs(timeString).format("h:mm A");
  };

  const handleNewMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    setIsTyping(true)
  }

  useEffect(()=>{
    if(isTyping){
      
    }
  })
  const handleSendMessage = ()=>{
  setNewMessage('')
  }
  return (
    <>
    {
      chat?
<> 
<div className="flex flex-row items-center w-full max-h-20 bg-secondary  border border-l-background p-5">
        <div className="h-16 w-16 rounded-md border-4 border-accent overflow-hidden cursor-pointer">
          <img className="object-cover  w-full h-full" src={userData && userData.profileImage !== '' ? userData.profileImage : PROFILE_DEFAULT_IMAGE} alt="" />
        </div>
        <div className="flex flex-col text-black font-lato  font-extrabold p-2">
          <p className="text-3xl cursor-pointer ">{userData?(userData.name?userData.name:userData.user_name):''}</p>
          {/* <p className="text mt-[-4px] cursor-pointer ">{user?.userbio}</p> */}
        </div>
        <div className="flex flex-row ml-auto p-2 gap-3">
          <p className="text text-primary text-extrabol cursor-pointer ">
            24 minute ago
          </p>
          <IoCallOutline className="w-7 h-7 cursor-pointer" />
          <IoVideocamOutline className="w-7 h-7 cursor-pointer" />
          <IoIosInformationCircleOutline className="w-7 h-7 cursor-pointer" />
        </div>
      </div>


      <div className="flex flex-col w-full h-screen overflow-y-auto custom-scrollbar  p-4 ">
        <div className="flex  justify-center items-center w-full ">
          <div className="flex flex-row justify-center items-center  gap-2  bg-secondary bg-opacity-40 rounded-full w-50 p-1 cursor-pointer">
            <FaLock className="text-xs text-primary" />
            <p className="font-lato text-xs text-primary">
              {" "}
              Messages are end-to-end encripted
            </p>
          </div>
        </div>

        {
          messages?.map((message)=>(

            <div key={message.chatId}>
{message.senderId === currentUser?(
    <div className="flex  mt-10 justify-end ">
    <div className="flex flex-col  bg-secondary p-1 rounded min-w-20">
      <p className="text-black font-lato text-sm font-bold ">{message.text}</p>
      <p className="text-black font-lato text-xs ml-auto ">{timeConversion(message.updatedAt)}</p>
    </div>
  </div>
):
(

  <div className="flex flex-row space-x-2">
  <div className="h-12 w-12 rounded-full overflow-hidden">
    <img
      className="object-cover  w-full h-full"
      src={
        userData && userData.profileImage !== ""
          ? userData.profileImage
          : PROFILE_DEFAULT_IMAGE
      }
      alt=""
    />
  </div>

 
    <>
      <div>
        <div className="flex flex-col  bg-secondary bg-opacity-40 p-1 rounded min-w-20">
          <p className="text-black font-lato text-sm font-bold ">
          {message.text}
          </p>
          <p className="text-black font-lato text-xs text-right ">
          {timeConversion(message.updatedAt)}
          </p>
        </div>
      </div>
    </>
 
</div>

)
}

            </div>
          ))
        }
       

       

        <div></div>
        <div className="flex  flex-row items-center p-2 bg-secondary bg-opacity-40 mt-auto mb-5   mx-5 h-12 max-w-4xl rounded-lg w-full gap-3 px-3 fixed bottom-0 ">
          <BsEmojiSmile className="text-primary h-6 w-6 cursor-pointer" />
          <input
          value={newMessage}
          onChange={(e)=>setNewMessage(e.target.value)}
            className="flex h-full placeholder-primary bg-transparent text-primary w-full focus:outline-none"
            type="text"
            placeholder="message"
          />

          <>
            <IoSend onClick={()=>handleSendMessage()} className="text-primary h-6 w-6 cursor-pointer" />
          </>

          <>
            <FaImage className="text-primary h-6 w-6 cursor-pointer" />
            <AiFillAudio className="text-primary h-6 w-6 cursor-pointer" />
          </>
        </div>
      </div>


</>
  :<>
{/* no current userid */}
  <div className="flex flex-col justify-center items-center  w-full h-screen">

  <IoChatbubblesOutline className="w-20 h-20 text-primary" />
 <span className="text-primary font-lato text-3xl font-bold">Greo</span>
 <span className="text-primary font-lato text-md font-bold">Send and receive messages</span>
  </div>

  </>    
    }
     
    </>
  );
}

export default ChatBox;
