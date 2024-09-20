import { useEffect, useState } from "react"
import Dropdown from '@mui/joy/Dropdown'
import Menu from '@mui/joy/Menu'
import MenuButton from '@mui/joy/MenuButton'
import MenuItem from '@mui/joy/MenuItem'
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { RootState } from "../../../store/store"
import { followUserApi, getUserPostsApi, targetedProfileApi, unfollowUserApi } from "../../../service/api"
import ProfileEdit from "./ProfileEdit"
import { User } from "../../../features/user/auth/authSlice"
import {PROFILE_DEFAULT_IMAGE} from '../../../assets/images'

interface Post{
  _id:string,
  userId:string,
  mediaUrls:[string],
  content:string,
  created_at:string,
  updated_at:string
}

const Profile:React.FC = ()=>{
  const {username} = useParams<{username:string}>()
  const loggedInUser:User | null = useSelector((state:RootState)=>state.userAuth.user?.user_name === username?state.userAuth.user as User:null)
  const loggedInUserId:string | null = useSelector((state:RootState)=>state.userAuth.user?.id ?? null)
  const [posts,setPosts] = useState<Post[]>([])
  const [isEditModal,setIsEditModal] = useState(false)
  const [selectedOption,setSelectedOption] = useState('Posts')
  const [postCount,setPostCount] = useState(0)
  const [user,setUser]= useState<User | null>(null)
  const navigate = useNavigate()
  const isViewingOwnProfile = loggedInUser?.user_name === username
  const handleOptionChange = (option:string)=>{
    setSelectedOption(option)
  }

 const fetchProfile = async (userName:string)=>{
    const response = await targetedProfileApi(userName)
    setUser(response.user)
    setPosts(response.posts)
    setPostCount(response.posts.length)
 }
 useEffect(()=>{
  const fetchData = async ()=>{
    if(isViewingOwnProfile &&  loggedInUser){
      setUser(loggedInUser)
      const response = await getUserPostsApi(loggedInUser.user_name)
      setPosts(response.data)
      setPostCount(response.data.length)

  } else if(username)
    await fetchProfile(username)
  }
  fetchData()
 },[username,loggedInUser,isViewingOwnProfile,])

 

 const closeEditModal = ()=>{
    setIsEditModal(false)
  }


  const handleFollow = async (followeeId:string)=>{
    if(user?.isFollowing){
    const response = await  unfollowUserApi(loggedInUserId??'', followeeId)
    if(response.status === 200){
      
      setUser(prevUser=> prevUser?{...prevUser,isFollowing:false,followersCount:(prevUser.followersCount as number)-1}:null)
    }
    }else{
     const response = await  followUserApi(loggedInUserId??'', followeeId)
     if(response.status === 200){    
       setUser(prevUser=> prevUser?{...prevUser,isFollowing:true,followersCount:(prevUser.followersCount as number)+1}:null)
     }
    }
  }

 return (
    <>
   <div className="flex flex-col justify-start   lg:m-5 lg:px-16 space-y-10">
    <div className="flex flex-row">
    <div className=" lg:w-40 lg:h-40 sm:w-10 sm:h-10 rounded-full overflow-hidden mx-auto lg:mx-0">
    <img className="object-cover w-full h-full" src={user && user.profileImage !==''?user.profileImage:PROFILE_DEFAULT_IMAGE} alt="proflie" />
    </div>

    <div className="flex flex-col  justify-center ml-7 space-y-2 ">
      <span className="text-3xl font-lato font-normal">{user?.name || user?.user_name}</span>
      <div className="flex flex-row gap-4 font-lato text-lg font-normal">
        <span>{postCount} Post</span>
        <span>{user?.followersCount} followers</span> 
        <span>{user?.followingCount} following</span>
      </div>
       <span className="font-lato text-lg font-normal ">{user?.user_name}</span>
       <span className="font-lato text-md font-normal">bio:{user?.userbio || 'No bio available'}</span>
       <div className="flex flex-row gap-4 font-lato font-semibold ">

      {
        isViewingOwnProfile?(
          <>
          <button className="border text-text p-1 rounded  bg-opacity-25 hover:bg-accent hover:bg-opacity-30 shadow-sm">View community</button>
          <button onClick={()=>setIsEditModal(true)} className="border text-text p-1 rounded bg-opacity-25 hover:bg-accent hover:bg-opacity-30 shadow-sm">Edit profile</button>
          </>
        ):(
          <>
          {
            user?.isFollowing?(
              <button  onClick={()=>handleFollow(user?.id as string)} className="border text-text p-1 rounded  bg-opacity-25 bg-accent hover:bg-opacity-30 shadow-sm px-5">Following</button>
            ):(
      
              <button onClick={()=>handleFollow(user?.id as string)} className="border text-text p-1 rounded  bg-opacity-25 hover:bg-accent hover:bg-opacity-30 shadow-sm px-5">Follow</button>
            )
          }
          
          <button onClick={()=>navigate(`/chat/${user?.id}`)} className="border text-text p-1 rounded bg-opacity-25 hover:bg-accent hover:bg-opacity-30 shadow-sm px-5">Message</button>
          </>
        )
} 
      
       </div>
    </div>
    </div>


        <div className="m-3 flex flex-col space-y-4 ">
    <div className="flex justify-end">
      <Dropdown>
        <MenuButton >{selectedOption}</MenuButton>
        <Menu>
          <MenuItem onClick={() => handleOptionChange('Posts')}>Posts</MenuItem>
          <MenuItem onClick={() => handleOptionChange('Roll')}>Roll</MenuItem>
        </Menu>
      </Dropdown>
    </div>

    <div className="grid grid-cols-3 gap-1">
      {
        posts && posts.map((post,index)=>{
          return (
            <>
            <div key={index} className="aspect-w-1 aspect-h-1">
              <img className="object-cover w-full h-full" src={post.mediaUrls[0]} alt="post" />
            </div>
            </>
          )
        })
      }
    </div>
    </div>
    <ProfileEdit isOpen={isEditModal} onClose={closeEditModal} user={user}/>
   </div>
    </>
 )
}


export default Profile