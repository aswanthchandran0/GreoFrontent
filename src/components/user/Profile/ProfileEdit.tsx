import Modal from 'react-modal';
import { FaUser } from "react-icons/fa";
import { IoShield } from "react-icons/io5";
import { FaWallet } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import { User } from '../../../features/user/auth/authSlice';
import { toast } from 'react-toastify';
import { updateProfileApi } from '../../../service/api';
import { CropperRef, Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'

interface ProfileEditProps {
  isOpen: boolean;
  onClose: () => void;
  user:User|null
}

type selection = 'Edit Profile' | 'Account Privacy' | 'Wallet'

const ProfileEdit: React.FC<ProfileEditProps> = ({ isOpen, onClose,user }) => {
  const [selection,setSelection] = useState<selection>('Edit Profile')
  const [isEditing,setIsEditing] = useState(false)
  const [newProfieImage,setnewProfileImage] = useState<File | null>(null)


  const [formData,setFormData] = useState({
    name:user?.name?user.name:'',
    userName:user?.user_name?user.user_name:'',
    bio:user?.userbio?user.userbio:'',
    gender:user?.gender?user.gender:'prefer not to say',
    phoneNumber:user?.phoneNumber?user.phoneNumber:''
  })


  useEffect(()=>{
    if(isOpen){
      setSelection('Edit Profile')
    }
  },[isOpen])

 const handleProfileEdit = (event:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
   const {name,value} = event.target
   setFormData((prevData)=>(
    {
      ...prevData,
      [name]:value
    }
   ))
 }

 const clearProfileEdit = ()=>{
  setnewProfileImage(null)
  setFormData({
    name:'',
    userName:'',
    bio:'',
    gender:'prefer not to say',
    phoneNumber:''
  })

  setIsEditing(false)
 }

 const handleProfileImageChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
  if(event.target.files && event.target.files[0]){

    const file = event.target.files[0]
    setnewProfileImage(file)

  }
  }

  const  handleSubmit = async ()=>{

    if(isEditing){
      const formDataToSend = new FormData();

    formDataToSend.append('name', formData.name);
    formDataToSend.append('userName', formData.userName);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('phoneNumber', formData.phoneNumber);

    if (newProfieImage) {
      formDataToSend.append('profileImage', newProfieImage);
    }

   
    try{
   const response =    await updateProfileApi(formDataToSend)
   console.log('response from the server after the profile update',response)
  }catch(error){
      toast.error(' Failed to update profile')
    }

  }
    setIsEditing(!isEditing)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onAfterClose={onClose}
        className="fixed top-0 right-0 h-full w-full max-w-2xl bg-secondary  shadow-lg z-50" 
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        shouldCloseOnOverlayClick={true}
        onRequestClose={onClose}
      >
        <div className=' flex flex-row h-screen' >
         <div className='flex flex-col min-w-72 p-6 border-r-2'>
          <span className='font-lato text-text_white text-2xl font-normal'>Settings</span>  

          <div className='mt-5 space-y-3'>
           <div className={`flex bg-background  cursor-pointer rounded p-2 shadow items-center gap-3 group
            ${selection ==='Edit Profile' ? 'bg-primary text-text_white' : 'hover:bg-primary hover:text-text_white'} 
            `}>
            <FaUser className={`text-xl
              ${selection ==='Edit Profile' ? 'bg-primary text-text_white' : 'hover:bg-primary hover:text-text_white'}
              `}/>
            <span className='font-lato'>Edit Profile</span>
           </div>

           <div className='flex bg-background rounded p-2 cursor-pointer shadow items-center gap-3 hover:bg-primary hover:text-text_white group'>
            <IoShield className='text-xl text-primary group-hover:text-text_white '/>
            <span className='font-lato'>Security</span>
           </div>

           <div className='flex bg-background rounded cursor-pointer p-2 shadow items-center gap-3  hover:bg-primary hover:text-text_white group'>
            <FaWallet className='text-xl text-primary group-hover:text-text_white '/>
            <span className='font-lato'>Wallet</span>
           </div>
          </div>
         </div>
         <div className='flex flex-col w-full p-6 space-y-5 overflow-y-auto '>
         <span  className='font-lato text-text_white text-2xl font-normal '>Edit Profile</span>  



         <div className=' flex justify-center items-center space-x-2  rounded p-1 '>

            <div className='relative rounded-full overflow-hidden w-28 h-28 border-2 cursor-pointer group '>
    <img className='object-cover w-full h-full' src={newProfieImage?URL.createObjectURL(newProfieImage):user?.profileImage} alt="profile" />
            <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity'></div>
            {
              isEditing &&(
                <input  type="file" accept='image/*' className='absolute inset-0 opacity-0 cursor-pointer' onChange={handleProfileImageChange}  />
              )
            }
         
            </div> 
         </div>

<div className='flex flex-col space-y-4'>

<span className='font-lato text-text_white '>Name</span>

<div className='relative w-full max-w-sm '>
 <input  name='name'  value={formData.name} onChange={handleProfileEdit}   type="text" placeholder='full name' className='p-3 rounded placeholder-primary text-primary w-full max-w-sm' readOnly={!isEditing} />


</div>



<span className='font-lato text-text_white '>userName</span>

<div className='relative w-full max-w-sm '>
 <input  name='userName' value={formData.userName} onChange={handleProfileEdit}  type="text" placeholder='username' className='p-3 rounded placeholder-primary text-primary w-full max-w-sm' readOnly={!isEditing} />


</div>




    <span className='font-lato text-text_white '>Bio</span>

<div className='relative w-full max-w-sm '>
 <input name='bio' value={formData.bio} onChange={handleProfileEdit}  type="text" placeholder='bio' className='p-3 rounded placeholder-primary text-primary w-full max-w-sm' readOnly={!isEditing} />


</div>


<span className='font-lato text-text_white '>Gender</span>

<div className=' w-full max-w-sm '>
{isEditing ? (
    <select
      name='gender'
      value={formData.gender}
      onChange={handleProfileEdit}
      className='appearance-none w-full max-w-sm p-3 rounded placeholder-primary text-primary focus:ring-2 focus:ring-accent border-none focus:border-accent cursor-pointer'
    >
      <option value="Prefer not to say">Prefer not to say</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  ) : (
    <div className='p-3 rounded bg-background text-primary w-full max-w-sm'>
      {formData.gender}
    </div>
  )}


<p className='text-text_white text-sm p-2'>This won’t be a part of your public profile</p>
</div>



<span className='font-lato text-text_white '>Email</span>


<div className='relative w-full max-w-sm '>
 <input type="text" value={user?.email} name='email'  placeholder='email' className='p-3 rounded placeholder-primary text-primary w-full max-w-sm' readOnly />


</div>

</div>
     <div>


<div className='space-x-2'>

<button onClick={handleSubmit} className='bg-background text-primary hover:bg-primary hover:text-text_white p-2 rounded'>
 {isEditing?'save':'edit Profile'}
</button>

{
  isEditing && (
    <button onClick={clearProfileEdit} className='bg-background text-primary hover:bg-primary hover:text-text_white p-2 rounded'>
      cancel
    </button>
  )
}
</div>


         </div>
         </div>
        </div>
      </Modal>
    </>
  );
}

export default ProfileEdit;
