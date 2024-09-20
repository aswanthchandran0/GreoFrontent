import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { adminTokenService } from "./adminTokenService";

const API = axios.create({
    baseURL:  import.meta.env.VITE_BASE_URL
})


API.interceptors.request.use((config:InternalAxiosRequestConfig)=>{
  const token  = adminTokenService.getAccessToken()
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config

},(error:AxiosError)=>{
  return Promise.reject(error)
})

API.interceptors.response.use(
    response =>response,
    async error =>{
        const originalRequest = error.config as InternalAxiosRequestConfig & {_retry?:boolean}
        if(error && error.response?.status === 401){
            console.error("Unauthorized access - token might be invalid or expired.");  
    }
    return Promise.reject(error)
}
)

export const authenticateApi = async (email:string,password:string)=>{
    const response = await API.post('/admin/authenticate',{email,password})
    return response.data
}



export const getAllUser = async ()=>{
    return await API.get('/admin/users')
  }
  export const suspendUserApi = async(userId:string)=>{
    return await API.post('/admin',{userId})
  }