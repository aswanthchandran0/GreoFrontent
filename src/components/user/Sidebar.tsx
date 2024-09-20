import React, { useState } from 'react';
import { FaHome, FaSearch, FaHeart, FaUser, FaPlusSquare } from 'react-icons/fa';
import { RxAvatar } from "react-icons/rx";
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaEllipsis } from 'react-icons/fa6';
import { FaSignOutAlt } from 'react-icons/fa';
import { TbMessageCircle } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../features/user/auth/authSlice';
import { RootState } from '../../store/store';
import {PROFILE_DEFAULT_IMAGE} from '../../assets/images'


interface SidebarProps {
  openUpload: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ openUpload }) => {
  const location = useLocation();
  const user= useSelector((state:RootState)=>state.userAuth.user)
  console.log('user',user)
   const [profilePopUp,setProfilePopUp] = useState(false)
   const dispatch = useDispatch()
   const handleProfilePopUp = ()=>{
    setProfilePopUp(!profilePopUp)
   }


   const handleLogout = () => {
    dispatch(logOut());
};


const menuConfig = [
  { name: 'Home', icon: FaHome, to: '/' },
  { name: 'Search', icon: FaSearch, to: '/search' },
  { name: 'Message', icon: TbMessageCircle, to: '/chat' },
  { name: 'Upload', icon: FaPlusSquare, to: '/upload' },
  { name: 'Notifications', icon: FaHeart, to: '/notifications' },
  { name: 'Profile', icon: FaUser, to: `/${user?.user_name}` },
];

  return (
    <>
    <div className="fixed left-0 bottom-0   w-full sm:w-20 md:w-24 lg:w-60 xl:w-50 bg-secondary text-background flex md:flex-col md:h-screen">
      <div className="hidden md:flex flex-col item-center lg:items-start p-4">
      <h1 className="text-xl font-bold font-Lato lg:text-2xl">Greo</h1>
      </div>
      <nav className="flex w-full justify-between md:flex-col">
        <ul className="flex w-full justify-between md:flex-col md:pt-10 sm:justify-center ">
          {menuConfig.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index} className="flex-1 md:mb-1">
                <Link
                  to={item.to}
                  onClick={item.name === 'Upload' ? (e) => {
                    e.preventDefault(); // Prevent navigation for the "Upload" link
                    console.log('open modal called')
                    openUpload();
                  } : undefined}
                  className={`flex flex-col items-center md:flex-row md:items-center md-justify-start w-full p-2 md:p-3  rounded-lg transition-all duration-300 ${
                    location.pathname === item.to ? 'bg-primary text-white' : 'text-white hover:bg-primary hover:text-white'
                  }`}
                >
                  <Icon className="text-2xl " />
                  <span className="hidden lg:inline ml-2">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>


      <div className='p-2 absolute bottom-0'>    
{
profilePopUp && (
 <div onClick={handleLogout} className='hidden sm:flex justify-between px-3 items-center mx-auto my-4  mb-2 bg-primary lg:w-52 lg:h-14 md:w-12 rounded-lg shadow-lg lg:items-center'>
 <div className='flex items-center'>
   <FaSignOutAlt />
   <span  className='ml-4 text-background font-lato font-medium'>Logout</span>
 </div>
</div> 
)
}
      

      <div className='hidden sm:flex justify-between px-3  items-center mx-auto my-4 mt-2 mb-10 bg-primary lg:w-52 lg:h-14 md:w-12 rounded-lg shadow-lg lg:items-center'>
        <div className='flex items-center'>
          {
            user?.profileImage?
           <img src={user && user.profileImage!==''?user.profileImage:PROFILE_DEFAULT_IMAGE} alt="profile icon" className='w-10 h-10 rounded-full'/>
           :
           <RxAvatar className='w-10 h-10 rounded-full'/>
          }
          <span
  aria-disabled='false'
  aria-label='profile'
  title="schoool" // This will show a tooltip on hover
  className='ml-4 text-background font-lato font-medium truncate hover:text-clip w-24 hover:w-full'
>
  {user?.user_name}
</span>

        </div>
        <FaEllipsis onClick={handleProfilePopUp} className='text-balance cursor-pointer ml-4'/>
      </div>

      </div>
      

    </div>
    {/* <Outlet/> */}
      </>
  );
};

export default Sidebar;
