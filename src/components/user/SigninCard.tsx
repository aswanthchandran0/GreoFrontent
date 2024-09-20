import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { setSignUp} from "../../features/user/auth/authSlice";
import { signIn } from "../../features/user/auth/authSlice";
import { AppDispatch} from "../../store/store";
import { useGoogleLogin } from "@react-oauth/google";
import { googleSignin } from "../../features/user/auth/authSlice";
import { toast } from "react-toastify";
const SigninCard:React.FC = ()=>{
           const dispatch = useDispatch<AppDispatch>()
           const [email,setEmail] = useState('')
           const [password,setPassword] = useState('')
           const handleFormSubmit = (e:React.FormEvent)=>{
            e.preventDefault()
            dispatch(signIn({email,password}))
           }

          
           const handleGoogleSignIn = useGoogleLogin({
            onSuccess: async (response:any) => {
              try {
               const accessToken = response.access_token
                await dispatch(googleSignin(accessToken));
        
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
            Sign in
        </h1>
         <form  onSubmit={handleFormSubmit} className="space-y-4">
            <div>
            <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)}  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-lato text-primary placeholder-primary" placeholder="Email"></input>
            </div>

            <div>
            <input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-lato text-primary placeholder-primary" placeholder="Password"></input>
            </div>
            <div className="flex justify-end">
               <a href="#"  className="text-primary font-lato text-sm hover:underline">
                Forgot password?</a>
            </div>
            <button type="submit" className="w-full bg-primary text-background font-bold py-2 px-4 rounded focus:outline-none shadow-sm font-lato">
                SignIn
            </button>

            <button
            type="button"
      onClick={() => handleGoogleSignIn()}
      className="w-full flex items-center justify-center bg-background text-text font-bold py-2 px-4 rounded focus:outline-none shadow-sm font-lato"
    >
      <FcGoogle className="text-2xl mr-3" />
      Sign in with Google
    </button>
            <div className="mt-4 text-center">
                <span className="text-sm text-primary font-lato ">
                    Don't have account?{""}
                     <a href="#" onClick={()=>dispatch(setSignUp())} className="text-primary hover:underline">
                        Sign up</a>
                        </span>
            </div>
         </form>
        </div>
    )
}


export default SigninCard