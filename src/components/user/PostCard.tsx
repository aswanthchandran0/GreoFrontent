import { FaHeart } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import { IoMdBookmark } from "react-icons/io";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa6";
import { MdBookmarkBorder } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { formatDistanceToNow } from "date-fns";
import { useEffect,useRef,useState } from "react";
import moment from "moment";
import { getPostApi, likePostApi } from "../../service/api";

import PostShareCard from "./PostShareCard";
import { OpenedPost } from "./OpenedPost";
import React from "react";
import { useNavigate } from "react-router-dom";
import {PROFILE_DEFAULT_IMAGE} from '../../assets/images'
const config = {
  rootMargin: "0px 0px 0px 0px",
  threshold:0
}

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
 const PostCard:React.FC = ()=>{
  const postRef = useRef<HTMLDivElement>(null)
  const [loadedImages,setLoadedImages] = useState<Set<string>>(new Set())
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [unlikedPosts, setUnlikedPosts] = useState<Set<string>>(new Set());
  const [posts,setPosts] = useState<Post[]>([])
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [viewPost,setViewPost] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const navigate = useNavigate()
  const formateDate = (uploadDate:Date)=>{
    const date = moment(uploadDate)
    return date.isValid() ? date.fromNow(): 'Unknown date'
  } 

  console.log('posts',posts)
  const fetchPosts = async () => {
    const fetchedPosts = await getPostApi();
    const sortedPosts = fetchedPosts.sort((a: Post, b: Post) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setPosts(sortedPosts);

    const likedSet = new Set<string>(fetchedPosts.filter((post:Post) => post.isLiked).map((post:Post) => post._id));
    setLikedPosts(likedSet);
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);


     useEffect(()=>{
      const observer = new IntersectionObserver((entries,self)=>{ 
        entries.forEach((entry)=>{
          if(entry.isIntersecting){
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            setLoadedImages(prev => new Set(prev).add(img.dataset.src || ''));
             self.unobserve(entry.target)
          }
        })
      },config)
      const images = document.querySelectorAll('[data-src]')
      images.forEach((image)=>{
        observer.observe(image)
      })

      return ()=>{
        images.forEach((image)=>{
          observer.unobserve(image)
        })
      }
     },[posts])

    
     const handleLike = async (postId: string) => {
      const isCurrentlyLiked = likedPosts.has(postId);
      const updatedLikedPosts = new Set(likedPosts);
      const updatedUnlikedPosts = new Set(unlikedPosts);
      
      if (isCurrentlyLiked) {
        updatedLikedPosts.delete(postId);
        updatedUnlikedPosts.add(postId);
      } else {
        updatedLikedPosts.add(postId);
        updatedUnlikedPosts.delete(postId);
      }
      
      setLikedPosts(updatedLikedPosts);
      setUnlikedPosts(updatedUnlikedPosts);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                totalLikes: isCurrentlyLiked
                  ? post.totalLikes - 1
                  : post.totalLikes + 1,
              }
            : post
        )
      );
    };
  
      // Sync with backend
    

useEffect(() => {
  const syncLikesWithBackend = async () => {
    const likesArray = Array.from(likedPosts);
    const unlikesArray = Array.from(unlikedPosts);
    await likePostApi(likesArray, unlikesArray);
  };

  window.addEventListener('beforeunload', syncLikesWithBackend);
  return () => {
    syncLikesWithBackend();
    window.removeEventListener('beforeunload', syncLikesWithBackend);
  };
}, [likedPosts, unlikedPosts]);


const handleOpenModal = () => setIsShareModalOpen(true);
const handleCloseModal = () => setIsShareModalOpen(false);

const handleOpenViewPost = (post: Post) => {
  setSelectedPost(post);
  setViewPost(true);
};

const handleCloseViewPost = () => {
  setSelectedPost(null);
  setViewPost(false);
};
     return (
    <div className="min-h-screen lg:ml-60 md:ml-32 flex flex-col w-full   space-y-2">
      {posts && posts.length > 0 &&
        posts.map((post) => (
          <div key={post._id} className="w-full max-w-md bg-secondary bg-opacity-25 rounded">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row items-center gap-2">
                <img title="profile" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full m-1 cursor-pointer" src={post && post.userImage!==''?post.userImage:PROFILE_DEFAULT_IMAGE} alt="profile icon" />
                <span onClick={()=>navigate(`/${post.username}`)} className="text-text font-semibold cursor-pointer">{post.username}</span>
                <span className="text-primary text-sm">{formateDate(post.createdAt)}</span>
              </div>
              <MdOutlineMoreHoriz title="more" className="w-6 h-6 mr-3 cursor-pointer" />
            </div>

            <div>
              <img className={`transition-opacity duration-500 ${loadedImages.has(post.mediaUrls[0]) ? 'opacity-100' : 'opacity-0 blur-sm'}`}
                data-src={post.mediaUrls[0]} alt="post" />
            </div>
            <div className="mt-2 mx-2 flex flex-row justify-between">
              <div className="flex flex-row gap-3">
                {likedPosts.has(post._id) ?
                  <FaHeart title="like" onClick={() => handleLike(post._id)} className="w-6 h-8 text-red-500 cursor-pointer" />
                  :
                  <FaRegHeart title="like" onClick={() => handleLike(post._id)} className="w-6 h-8 cursor-pointer" />
                }
                <FaRegComment title="comment" onClick={()=>handleOpenViewPost(post)} className="w-6 h-8 cursor-pointer" />
                <IoIosShareAlt title="share" onClick={handleOpenModal}  className="w-6 h-8 cursor-pointer" />
              </div>
              <MdBookmarkBorder title="bookmark" className="w-6 h-8 cursor-pointer" />
            </div>
            <div className="mx-2 mb-3 flex flex-col">
              <span>{post.totalLikes} likes</span>
              <span>{post.username} {post.content}</span>
              <span  className="cursor-pointer" onClick={()=>handleOpenViewPost(post)}>{`view all ${post.numberOfComments > 0 ? post.numberOfComments : ''} comment`}</span>
            </div>

            <PostShareCard isOpen={isShareModalOpen} onClose={handleCloseModal} postUrl={`https://localhost:5173/post/${post._id}`} />
            {selectedPost && (
              <OpenedPost isOpen={viewPost} onClose={handleCloseViewPost} post={selectedPost} />
            )}
          </div>
        ))
      }
    </div>
  );
};

export default PostCard;