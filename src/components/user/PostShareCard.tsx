import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineLink } from "react-icons/ai";
import { GrFacebookOption } from "react-icons/gr";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Modal from 'react-modal';
import { toast } from "react-toastify";


interface PostShareCardProps {
   isOpen: boolean;
   onClose: () => void;
   postUrl: string;
 }

const PostShareCard:React.FC<PostShareCardProps>= ({ isOpen, onClose,postUrl })=>{

   const handleCopyLink = ()=>{
      navigator.clipboard.writeText(postUrl)
      onClose()
      toast.success("Link copied to clipboard!")
   }

   const handleWhatsAppShare = ()=>{
      window.open(`https://wa.me/?text=${encodeURIComponent(postUrl)}`, "_blank`")
      onClose()
   }

   const handleFacebookShare = ()=>{
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, "_blank`")
      onClose()
   }

   const handleEmailShare = ()=>{
      window.open(`mailto:?subject=Check this out!&body=${encodeURIComponent(postUrl)}`, "_blank`")
      onClose()
   }

   const handleTwitterShare = () =>{
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`, "_blank`")
        onClose()
   }

   return(
    <>
     <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex justify-center items-center z-50  bg-opacity-50"
      overlayClassName="fixed inset-0  bg-opacity-50"
    >
   <div className="fixed inset-0 flex justify-center items-center z-50  bg-opacity-50"> 
    <div className="bg-background shadow-lg rounded m-4 w-full max-w-lg  md:max-lg: lg-max-w-xl">
        <div className="flex justify-between items-center m-2 mt-1">
            <span className="text-primary text-Lato font-bold ">Share</span>
            
            <div className="">
            <IoClose onClick={onClose} className=" text-2xl ml-2 cursor-pointer"/>
            </div>
            
        </div>
       <div className="border-b-2 border-primary w-full mt-2"></div>

       <div className="flex justify-start p-2 gap-2 items-center ">

       <div className="flex flex-col justify-center items-center">
         <div onClick={handleCopyLink} className="flex justify-center items-center bg-primary rounded-full mt-2 ml-2 w-14 h-14">
          <AiOutlineLink className="text-2xl text-background"/>
         </div>
         <div className="lg:ml-2">
            <span className="text-text text-sm text-center font-medium">link</span>
         </div>
       </div>

       <div className="flex flex-col justify-center items-center">
         <div onClick={handleWhatsAppShare} className="flex justify-center items-center bg-primary rounded-full mt-2 ml-2 w-14 h-14">
          <FaWhatsapp className="text-2xl text-background"/>
         </div>
         <div className="lg:ml-2">
            <span className="text-text text-sm text-center font-medium">Whatsapp</span>
         </div>
       </div>

       <div className="flex flex-col justify-center items-center">
         <div onClick={handleFacebookShare} className="flex justify-center items-center bg-primary rounded-full mt-2 ml-2 w-14 h-14">
          <GrFacebookOption className="text-2xl text-background"/>
         </div>
         <div className="lg:ml-2">
            <span className="text-text text-sm text-center font-medium">facebook</span>
         </div>
       </div>

       <div className="flex flex-col justify-center items-center">
         <div onClick={handleEmailShare} className="flex justify-center items-center bg-primary rounded-full mt-2 ml-2 w-14 h-14">
          <MdOutlineMailOutline className="text-2xl text-background"/>
         </div>
         <div className="lg:ml-2">
            <span className="text-text text-sm text-center font-medium">Email</span>
         </div>
       </div>

       <div className="flex flex-col justify-center items-center">
         <div onClick={handleTwitterShare} className="flex justify-center items-center bg-primary rounded-full mt-2 ml-2 w-14 h-14">
          <FaXTwitter className="text-2xl text-background"/>
         </div>
         <div className="lg:ml-2">
            <span className="text-text text-sm text-center font-medium">X</span>
         </div>
       </div>


       </div>
       
    </div>
   </div>
   </Modal>
    </>
   )
}



export default PostShareCard