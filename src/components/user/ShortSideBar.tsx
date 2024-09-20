import { FaHeart, FaHome, FaPlusSquare, FaSearch, FaUser } from "react-icons/fa"
import { TbMessageCircle } from "react-icons/tb"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"

const ShortSidebar:React.FC = ()=>{
    const username = useSelector((state:RootState)=>state.userAuth.user?.user_name)
    const location = useLocation()
    const menuConfig = [
        { name: 'Home', icon: FaHome, to: '/' },
        { name: 'Search', icon: FaSearch, to: '/search' },
        { name: 'Message', icon: TbMessageCircle, to: '/chat' },
        { name: 'Notifications', icon: FaHeart, to: '/notifications' },
        { name: 'Profile', icon: FaUser, to: `/${username}` },
        { name: 'Upload', icon: FaPlusSquare, to: '/upload' },
        
    ]
 return(
 <>
 <div className="flex flex-col  h-screen w-full bg-secondary  max-w-20 hidden sm:flex items-center py-5 border-r border-secondary ">
     <div>
        <span className="font-lato text-text_white font-bold">GREO</span>
     </div>
   
    <div className="flex flex-col items-center justify-center mt-14 space-y-3">
        {
            menuConfig.map((item,index)=>{
                const Icon = item.icon
                const isActive = location.pathname === item.to
                return(
                    <>
                    <Link key={index} to={item.to}>
                   
                     <div className={`flex flex-col  w-full h-full  p-3 transition-all easy-in-out duration-300
                     ${isActive? "bg-gradient-to-r from-primary via-primary to-primary shadow-lg rounded-full": 'hover:bg-gradient-to-r hover:from-primary hover:via-accent hover:to- hover:shadow-lg rounded-full'}
                     `}>
                      <Icon className={`w-7 h-7 text-white transform transition-transform duration-200 ${isActive? "text-white scale-110 animate-pulse ":"text-white"}`}/>
                    </div>
                    </Link>
                    </>
                )
            })
        }
   
    </div>
 </div>
 </>
 )
}

export default ShortSidebar

