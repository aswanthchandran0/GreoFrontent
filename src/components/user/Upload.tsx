import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Cropper from 'react-easy-crop';
import { toast } from 'react-toastify';
import { PostUploadApi } from '../../service/api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
interface UploadProps {
  onClose: () => void;
}




const Upload: React.FC<UploadProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const uploadPostRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState<File[]>([]);
  const [postIndex, setPostIndex] = useState(0);
  const [cropping, setCropping] = useState<boolean>(true);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1 / 1);
  const [comment,setComment] = useState('')
  const [mediaType,setMediaType] = useState<'post'|'roll'>('post')
  const userId = useSelector((state:RootState)=>state.userAuth.user?.id)
  const [selectedAspect, setSelectedAspect] = useState<"1:1" | "4:5" | "16:9">("1:1");
  const dispatch = useDispatch()

 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleOpenFileDialog = () => {
    if (uploadPostRef.current) {
      uploadPostRef.current.click();
    }
  };

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setPosts(Array.from(files));
    }
  };

  const toLeft = () => {
    if (!cropping) {
      setCropping(true);
    } else if (postIndex > 0) {
      setPostIndex(postIndex - 1);
    }
  };

  const toRight = () => {
    if (postIndex < posts.length - 1) {
      setPostIndex(postIndex + 1);
    } else if (cropping) {
      setCropping(false);
    }
  };



  const clearPost = () => {
    setPosts([]);
  };

 const handleUpload =async ()=>{
  if(posts.length>0){
    try{
      const formData = new FormData();
      posts.forEach(post => formData.append('files', post));
      if(userId){
        formData.append('userId', userId);
      }
      formData.append('mediaType', mediaType);
      formData.append('comment', comment);
      
      const response = await PostUploadApi(formData)
      if(response){
       toast.success('post uploaded')
        onClose()
      }
      console.log('respoonse get by upload post',response)
    }catch(error){
      toast.error('upload failed')
    }
  }
 }

  const handleComment  = (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
    setComment(e.target.value)
  }

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    console.log('Crop complete:', croppedArea, croppedAreaPixels);
  };

  const handleAspectRatioChange = (aspectRatio: "1:1" | "4:5" | "16:9") => {
    setSelectedAspect(aspectRatio);
    switch (aspectRatio) {
      case "1:1":
        setAspect(1 / 1);
        break;
      case "4:5":
        setAspect(4 / 5);
        break;
      case "16:9":
        setAspect(16 / 9);
        break;
    }

    if(aspectRatio =='4:5'){
      setMediaType('roll')
    }
  };

  const currentPost = posts[postIndex];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-secondary p-6 md:p-8 lg:p-10 rounded-lg shadow-lg w-11/12 max-w-md lg:max-w-4-xl flex flex-col items-center transition-all duration-300"
      >
        <div className="flex items-center w-full mb-4">
          <div className="flex-grow flex items-center justify-center">
            <h1 className="text-background text-Lato text-lg font-medium">
              {posts.length > 0 ? (cropping ? 'Crop' : 'Comment & Upload') : 'Upload'}
            </h1>
          </div>
          {posts.length > 0 && cropping && (
            <div className="flex items-center ml-2">
              <span className="mr-2 text-background">Next</span>
              <FaArrowRight
                onClick={toRight}
                className="text-2xl text-background cursor-pointer"
              />
            </div>
          )}
        </div>

        {posts.length > 0 ? (
          cropping ? (
            <div className="relative w-full h-[40vh] lg:h-[50vh] md:h-[35vh]">
              <Cropper
                image={currentPost ? URL.createObjectURL(currentPost) : ''}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
              {/* Crop Options */}
              <div className="absolute bottom-0 left-0 p-2 bg-gray-800 text-white flex space-x-4">
                <button
                  onClick={() => handleAspectRatioChange("1:1")}
                  className={`px-4 py-2 rounded ${selectedAspect === "1:1" ? 'bg-blue-500' : 'bg-gray-700'} transition-colors`}
                >
                  1:1
                </button>
                <button
                  onClick={() => handleAspectRatioChange("4:5")}
                  className={`px-4 py-2 rounded ${selectedAspect === "4:5" ? 'bg-blue-500' : 'bg-gray-700'} transition-colors`}
                >
                  4:5
                </button>
                <button
                  onClick={() => handleAspectRatioChange("16:9")}
                  className={`px-4 py-2 rounded ${selectedAspect === "16:9" ? 'bg-blue-500' : 'bg-gray-700'} transition-colors`}
                >
                  16:9
                </button>
              </div>
              <FaArrowLeft
                onClick={toLeft}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-3xl text-background cursor-pointer"
              />
            </div>
          ) : (
            <div className="relative w-full h-[40vh] lg:h-[50vh] md:h-[35vh]">
              <img
                src={currentPost ? URL.createObjectURL(currentPost) : ''}
                alt="Selected"
                className="w-full h-full object-cover rounded"
              />
              {/* Navigation Arrows */}
              <FaArrowLeft
                onClick={toLeft}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-3xl text-background cursor-pointer"
              />
            
            </div>
          )
        ) : (
          <>
            <div>
              <img className="w-32 lg:w-48 mt-4 lg:mt-10" src="uploadLogo.jpg" alt="upload post" />
            </div>
            <h1 className="text-background text-Lato text-lg font-sm mt-4">
              Upload photos or videos here
            </h1>
            <input className="hidden" ref={uploadPostRef} onChange={handleFiles} type="file" accept="image/*,video/*" multiple />
            <button onClick={handleOpenFileDialog} className="text-background bg-primary py-1 px-4 rounded mt-1 hover:bg-accent">
              Select
            </button>
          </>
        )}

        {/* Comment and Upload Section */}
        {!cropping && posts.length > 0 && (
          <div className="w-full mt-4">
            <textarea value={comment} onChange={handleComment}
              className="w-full p-2 rounded bg-gray-100 text-text  rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-lato text-primary placeholder-primary"
              placeholder="Add description..."
            />
            <button
            onClick={handleUpload}
              className="text-background bg-primary py-1 px-4 rounded mt-2 hover:bg-accent"
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
