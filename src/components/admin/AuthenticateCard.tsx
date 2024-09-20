import {useDispatch,useSelector } from "react-redux"
import { authenticate } from "../../features/admin/auth/authSlice"
import { RootState,AppDispatch} from "../../store/store"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import React from "react"

const AuthenticateCard:React.FC = ()=>{
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate  = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const authStatus = useSelector((state:RootState)=>state.adminAuth.status)
    const handleSubmit = (e:React.FormEvent)=>{
        e.preventDefault()
        console.log(email,password)
        dispatch(authenticate({email,password}))
    }

    

     return(
        <div className="w-full max-w-4xl p-8 bg-secondary rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center text-background font-lato">
            Admin
        </h1>
         <form onSubmit={handleSubmit} className="space-y-6">
            <div>
            <input id="email" type="email"  value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 block w-full px-6 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-lato text-primary placeholder-primary" placeholder="Email"></input>
            </div>

            <div>
            <input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 block w-full px-6 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-lato text-primary placeholder-primary" placeholder="Password"></input>
            </div>
            <button type="submit" className="w-full bg-primary text-background font-bold py-2 px-4 rounded focus:outline-none shadow-sm font-lato">
                SignIn
            </button>
           
            <div className="mt-4 text-center">
               
            </div>
         </form>
        </div>
     )
}

export default  AuthenticateCard