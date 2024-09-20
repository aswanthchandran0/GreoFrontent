import { useEffect, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import Modal from 'react-modal';
import { commentSentAPi, getCommentsApi } from "../../service/api";
import { useRef } from "react";
import moment from "moment";

interface Post {
  _id:string,
  userId:string,
  username:string,
  userImage:string
  userBio:string
  mediaUrls: string[]
  content:string
  totalLikes:number,
  numberOfComments:number,
  createdAt:Date
  updatedAt:Date
  isLiked: boolean;
}

interface Comment{
  _id:string,
  userId:string,
  mediaUrl:string,
  content:string,
  createdAt:Date,
  updataedAt:Date,
  totalLikes:number,
  isliked:boolean,
  username:string,
  userImage:string,
  userBio:string
}



interface OpenedPost{
  isOpen: boolean;
  onClose: () => void;
  post:Post
}

export const OpenedPost:React.FC<OpenedPost> = ({isOpen, onClose,post}) => {
      const [comments,setComments] = useState<Comment[]>([])
      const [comment,setComment] = useState<string>('')

      const formateDate = (uploadDate:Date)=>{
        const date = moment(uploadDate)
        return date.isValid() ? date.fromNow(): 'Unknown date'
      } 
      const fetchComments = async ()=>{
        try{
          const response =await getCommentsApi(post._id)
          const comments = response.data
          const sortedComments = comments.sort((a:Comment,b:Comment)=>  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          console.log('sorted Comment',sortedComments)
          console.log('resposnse from the data',response.data)
          setComments(sortedComments)
        }catch(err){
          console.log('error fetching comments',err)
        }
       }




  useEffect(()=>{
  
   if (post._id) {
    fetchComments();
  }
  },[post._id])

  const handleCommentSent = async()=>{
    const response = await commentSentAPi(post._id,comment)
    const newComment = response.data
    console.log('response from the comment sent',response.data)
    setComments((prevComments)=>[newComment,...prevComments])

    setComment('')
  }
    return (
       <>
       <Modal 
       
       isOpen={isOpen}
       onRequestClose={onClose}
       className="fixed inset-0 flex justify-center items-center z-50 bg-black  bg-opacity-10"
       overlayClassName="fixed inset-0  bg-opacity-50"
       >
       <div className="fixed flex inset-0 justify-center items-center z-50 bg-opacity-10 ">
       <div className="flex flex-row  bg-background w-full max-w-4xl h-[95%]   ">
       <div className="flex justify-center items-center bg-premiumBlack w-[41%] ">
        <img src={post.mediaUrls[0]} alt="post" />
       </div> 
       <div className="flex flex-col w-[59%]">
        <div className="flex flex-row items-center p-3">
            
            <div className="w-10 h-10 rounded-full overflow-hidden ">
           <img className="object-cover" src={post.userImage} alt="proifle" />
            </div>
            
            <span className="m-2 text-text font-bold font-lato">{post.username}</span>
               <div className="ml-auto">

                <IoClose onClick={onClose} className="text-2xl text-tex cursor-pointer"/>
               </div>
        </div>
               <div className="border-b-2 border-secondary w-full opacity-50 "></div>

               <div className="flex flex-col  h-full overflow-y-auto">              
           <div className="flex flex-col  ">
          <div className=" flex flex-row items-center gap-2 p-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
          <img className="object-cover" src={post.userImage} alt="proifle" />
            </div>
            <span className="text-text font-bold font-lato">{post.username}</span>
            </div> 
            <div className="px-14 pb-3 -mt-4 font-lato">
          {post.content}
            </div>
            </div>

     {comments &&
      comments.map((comment,index)=>(

        <div key={index} className="flex flex-col  ">
        <div className=" flex flex-row items-center gap-2 p-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
        <img className="object-cover" src={comment.userImage} alt="proifle" />
          </div>
          <span className="text-text font-bold font-lato">{comment.username}</span>
          <span className="text-primary text-sm">{formateDate(comment.createdAt)}</span>
          </div> 
          <div className="px-14 pb-3 -mt-4 font-lato">
        {comment.content}
          </div>
          </div>

      ))
     }
          



             </div>       
            <div className="flex justify-between items-center p-5 border-t-2 border-secondary">
              <div className="flex items-center gap-2 ">

                <input value={comment} onChange={(e)=>setComment(e.target.value)} className="w-56 h-10 bg-secondary border-none pl-2 rounded-full text-white placeholder-white focus:border-secondary" type=" text" placeholder="comment" />
              </div>
                <IoSend onClick={()=>handleCommentSent()} className="text-2xl text-secondary"/>
            </div>
       </div>
       </div>
       </div>
       </Modal>
       </>
    )
}