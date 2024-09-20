import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { googleSignup, setSignIn, signUp } from "../../features/user/auth/authSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppDispatch} from "../../store/store";
import {useGoogleLogin } from "@react-oauth/google";
import React from "react";

const SignupCard:React.FC = ()=>{
          const dispatch = useDispatch<AppDispatch>()
          const [formData,setFormData] = useState({
            user_name:'',
            
            email:'',
            password:'',
            confirmPassword:''
          })

          const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
            setFormData({...formData,[e.target.id]:e.target.value})
          }

          const validateUsername = (username:string)=>{
            const uesrnameRegex = /^[a-zA-Z0-9_]{3,15}$/
            return uesrnameRegex.test(username)
          }

          const handleSubmit = (e:React.FormEvent)=>{
            e.preventDefault()

            if (!formData.user_name) {
              toast.error('Username is required');
              return;
            }

            if(!validateUsername(formData.user_name)){
              toast.error('Username should be 3-15 characters long and contain only letters, numbers, and underscores.')
              return
            }

            if (!formData.email) {
              toast.error('Email is required');
              return;
            }
            if (!formData.password) {
              toast.error('Password is required');
              return;
            }

            if(formData.password !== formData.confirmPassword){
                toast.error('password do not match')
                return
            }
            dispatch(signUp(formData))
          }

         const handleGoogleSignUp = useGoogleLogin({
          onSuccess: async (response:any) => {
            try {
             const accessToken = response.access_token
              await dispatch(googleSignup(accessToken));
      
            } catch (err) {
              toast.error('Failed to Sign up with Google');
            }
          },
          onError: () => {
            toast.error('Failed to Sign up with Google');
          },
         })
    return(
  <div className="w-full max-w-md p-8 bg-secondary rounded-lg shadow-lg">
        <h1 className="text-32px font-bold mb-6 text-center text-background font-lato">
            Sign up
        </h1>
         <form className="space-y-4" onSubmit={handleSubmit}>

         <div>
            <input id="user_name" type="text"value={formData.user_name} onChange={handleChange}  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-lato text-primary placeholder-primary" placeholder="Username"></input>
            </div>

            <div>
            <input id="email" type="email"  value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-lato text-primary placeholder-primary" placeholder="Email"></input>
            </div>

            <div>
            <input id="password" type="password"  value={formData.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-lato text-primary placeholder-primary" placeholder="Password"></input>
            </div>

            <div>
            <input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-lato text-primary placeholder-primary" placeholder="Conform password"></input>
            </div>

            <button type="submit" className="w-full bg-primary text-background font-bold py-2 px-4 rounded focus:outline-none shadow-sm font-lato">
                SignUp
            </button>
           
            <button
            type="button"
      onClick={() => handleGoogleSignUp()}
      className="w-full flex items-center justify-center bg-background text-text font-bold py-2 px-4 rounded focus:outline-none shadow-sm font-lato"
    >
      <FcGoogle className="text-2xl mr-3" />
      Sign up with Google
    </button>



         
       
            <div className="mt-4 text-center">
                <span className="text-sm text-primary font-lato ">
                    already have an account?{""}
                     <a href="#" onClick={()=>dispatch(setSignIn())} className="text-primary hover:underline">
                        Sign in</a>
                        </span>
            </div>
         </form>
        </div>
    )
}

export default SignupCard