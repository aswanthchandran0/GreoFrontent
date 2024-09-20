import { FaEllipsis } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { AppDispatch, persistor } from "../../store/store";
import { signOut } from "../../features/admin/auth/authSlice";
import { FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import React from "react";
const menuConfig = [
  { name: 'Dashboard' },
  { name: 'Community' },
  { name: 'Post' },
  { name: 'Transaction' },
  { name: 'Users' },
  { name: 'Notification' }
]
const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [profilePopUp, setProfilePopUp] = useState(false)
  const handleLogout = () => {
    console.log('request was reaching in handle logout')
    dispatch(signOut())
    console.log('after teh signout')
  }

  const handleProfilePopUp = () => {
    setProfilePopUp(!profilePopUp)
  }


  return (
    <>
      <div className=" fixed w-full sm:w-20 md:w-24 lg:w-56 xl:w-50 flex md:flex-col md:h-screen border-r border-r-1 border-secondary">
        <div className="ml-10 mt-5">
          <span className="text-3xl font-Lato font-semibold text-background">GREO</span>
        </div>
        <div className=" flex-col  p-2 flex mt-16 space-y-3 ">
          {
            menuConfig.map((item, index) => {
              return (
                <div key={index} className="flex justify-center items-center w-full h-10 bg-background rounded text-primary shadow-lg hover:bg-accent hover:text-background">
                  <span className="text-md font-bold font-lato">{item.name}</span>
                </div>
              )
            })
          }
        </div>





        <div className="p-2 absolute bottom-0">

          {
            profilePopUp && (
              <div onClick={handleLogout} className='hidden cursor-pointer sm:flex justify-between px-3 items-center mx-auto my-4 mt-auto mb-2 bg-background  lg:w-52 lg:h-14 md:w-12 rounded-lg shadow-lg lg:items-center'>
                <div className='flex items-center'>
                  <FaSignOutAlt className="text-primary  " />
                  <span className='ml-4 text-primary  font-lato font-medium'>Logout</span>
                </div>
              </div>
            ) 
          }

          <div className='hidden sm:flex justify-between px-3 items-center mx-auto my-4 mt-2 mb-10 bg-background lg:w-52 lg:h-14 md:w-12 rounded-lg shadow-lg lg:items-center'>
            <div className='flex items-center'>
              <img src="3d-illustration-cute-cartoon-boy-with-backpack-his-back.jpg" alt="profile icon" className='w-12 h-12 rounded-full' />
              <span className='ml-4 text-primary font-lato font-medium'>Admin</span>
            </div>
            <FaEllipsis onClick={handleProfilePopUp} className='text-balance text-primary cursor-pointer ml-4' />
          </div>
        </div>
      </div>
    </>
  )

}



export default Sidebar