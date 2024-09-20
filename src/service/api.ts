import axios from "axios";
import { AxiosError,InternalAxiosRequestConfig } from 'axios';
import { tokenService } from "./tokenService";
import React from "react";
import { adminTokenService } from "./adminTokenService";
import { toast } from "react-toastify";
import { generateKeyPair,storePrivateKey,exportPublicKey,removePrivateKey } from "./keyService";
const API = axios.create({
    baseURL : import.meta.env.VITE_BASE_URL
})


API.interceptors.request.use((config:InternalAxiosRequestConfig) =>{
        const token = tokenService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    return config;

    },(error:AxiosError) =>{
        return Promise.reject(error)
    }
)

API.interceptors.response.use(
    response =>response,
    async error =>{
        const originalRequest = error.config as InternalAxiosRequestConfig & {_retry?:boolean}
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true
            const refreshToken = tokenService.getRefreshToken()
            try{
           const response = await API.post('/refresh-token',{refreshToken})
           const { accessToken, refreshToken: newRefreshToken } = response.data;
           tokenService.setTokens(accessToken,newRefreshToken)
           originalRequest.headers.Authorization =  `Bearer ${accessToken}`
           return API(originalRequest)
            }catch(refreshError){
              tokenService.clearTokens()
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error)
        
    }
)


export const SigninApi = async (email:string,password:string) =>{
    const response  = await API.post('/user_signin',{email,password})
    return response
}

export const SignupApi = async (user_name:string,email:string,password:string)=>{
  try{
    const {privateKey,publicKey} = await generateKeyPair()

    try {
      await storePrivateKey(privateKey);
    } catch (storageError) {
      console.error('Error storing private key:', storageError);
      toast.error(`Error during sign-in ${storageError}`)
    }

    let publicKeyPem:string | null = null

    try {
      publicKeyPem = await exportPublicKey(publicKey);
    } catch (exportError) {
      console.error('Error exporting public key:', exportError);
      toast.error(`Error during sign-in ${exportError}`)
    }
  
    const response = await API.post('/user_signup',{user_name,email,password,publicKey:publicKeyPem || null})

    if (!response) {
      throw new Error('No response from server');
    }

    return response
  }catch(error){
    toast.error(`Error during sign-in ${error}`)
    throw error;
  } 
}
export const googleSignUpApi = async (token: string) => {
  try {
    // Generate RSA Key Pair (public and private)
    const { privateKey, publicKey } = await generateKeyPair();

    // Store the private key in local storage or secure storage
    try {
      await storePrivateKey(privateKey);
    } catch (storageError) {
      console.error('Error storing private key:', storageError);
      toast.error(`Error during sign-up: ${storageError}`);
    }

    // Export public key to PEM format
    let publicKeyPem: string | null = null;
    try {
      publicKeyPem = await exportPublicKey(publicKey);
    } catch (exportError) {
      console.error('Error exporting public key:', exportError);
      toast.error(`Error during sign-up: ${exportError}`);
    }

    // Send token and public key to the backend during sign-up
    const response = await API.post('/signup_with_google', {
      token,
      publicKey: publicKeyPem || null,
    });

    if (!response) {
      throw new Error('No response from server');
    }

    return response.data;

  } catch (err) {
    toast.error(`Error during Google sign-up: ${err}`);
    throw err;
  }
};


export const googleSignInApi = async (token: string) => {
  try {
    // Send token to the backend during sign-in
    const response = await API.post('/signin_with_google', { token });

    if (!response) {
      throw new Error('No response from server');
    }

    return response.data;

  } catch (err) {
    toast.error(`Error during Google sign-in: ${err}`);
    throw err;
  }
};


export const PostUploadApi = async(formData:FormData)=>{
    const  response = await API.post('/post_upload',formData,)
   return response.data
}


export const getPostApi = async ()=>{
    console.log('request reaching in get post api')
    const response = await API.get('/get_posts')
    return response.data
}


export const likePostApi = async (likeIds: string[], unlikeIds: string[]) => {
    console.log('likedpost',likeIds)
    return await API.post('/like_post', { likeIds, unlikeIds });
  };


  export const getCommentsApi = async (postId:string)=>{
    return await API.get(`/get_comments/${postId}`,)
  }


  export const commentSentAPi =  async (postId:string,content:string)=>{
    console.log('post id and commment',postId,content)
    return await API.post(`/sent_comment`,{postId,content})
  }

  export const getUserPostsApi = async (username:string)=>{
    return await API.get(`/get_user_posts/${username}`)
  }


  export  const updateProfileApi = async (formData:FormData)=>{
    try {
      return await API.patch('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error updating profile', error);
      throw error;
    }
  }

  export const targetedProfileApi = async (username:string)=>{
    const response =  await API.get(`/userProfile/${username}`)
    console.log('response data',response.data)
    return response.data
  }

  export const followUserApi = async (followerId:string,followeeId:string)=>{
    return  await API.post('/follow',{followerId,followeeId})
  }

  export const unfollowUserApi = async (followerId:string,followeeId:string)=>{
       return await API.post('/unfollow',{followerId,followeeId})   
  }

  export const getUserByIdApi = async(userId:string)=>{
    return await API.get(`/get_user_by_id/${userId}`)
  }

  export const getChatsApi = async (userId:string)=>{
    return await API.get(`/chat/${userId}`)
  }

  export const getMessagesApi =async (userId:string)=>{
    return await  API.get(`/chat/m/${userId}`)
  }