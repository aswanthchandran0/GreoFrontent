import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { googleSignInApi, googleSignUpApi, SigninApi, SignupApi } from "../../../service/api";
import { toast } from "react-toastify";
import { tokenService } from "../../../service/tokenService";

interface signUpCredentials{
    user_name:string,
    email:string,
    password:string
}

interface signInCredentials{
    email:string
    password:string
}

export type gender = 'prefer not to say' | 'male' | 'female' | 'other'

export interface User{
    id:string
    name:string
    gender:gender
    user_name:string
    profileImage:string
    userbio:string
    email:string,
    lastseen_online:string
    password:string
    phoneNumber:string
    followersCount?: number, 
    followingCount?: number,
    isFollowing?: boolean 
    publicKey?:string
}

export interface userAuthState{
   user:User|null
   status:'idle'|'loading'|'succeeded'|'rejected'
   error:string|null
   view:'signIn'|'signUp'
   token:string |null
}

interface AuthResponse {
    user: User;
    token: string;
}

const initialState:userAuthState = {
    user:null,
    status:'idle',
    error:null,
    view:'signIn',
    token: tokenService.getAccessToken()!== null?tokenService.getAccessToken():null
}


export const  signIn = createAsyncThunk<AuthResponse ,signInCredentials,{rejectValue:string}>(
    'auth/singIn',
    async({email,password},{rejectWithValue})=>{
try{
        const response = await SigninApi(email,password)
        tokenService.setTokens(response.data.tokens.accessToken,response.data.tokens.refreshToken)
        return {user:response.data.user,token:response.data.tokens.accessToken}
}catch(err){
    if(axios.isAxiosError(err)){
        return rejectWithValue(err.response?.data.error || 'An error occured')
    }else{
        return rejectWithValue((err as Error).message|| 'An unexpected error was occured')
    }
}
    }
)


export const signUp = createAsyncThunk<AuthResponse ,signUpCredentials,{rejectValue:string}>(
    'auth/signUp',
    async({user_name,email,password},{rejectWithValue})=>{
       try{
         const response = await SignupApi(user_name,email,password)
         tokenService.setTokens(response.data.tokens.accessToken,response.data.tokens.refreshToken)
         return {user:response.data.user,token:response.data.tokens.accessToken}
       }catch(err){
        if(axios.isAxiosError(err)){
            return rejectWithValue(err.response?.data.error ||'An error occured' )
        }else{
            return rejectWithValue((err as Error).message || 'An unexpected error was occured')
        }
       }
    }
)


export const googleSignup = createAsyncThunk(
    'auth/googleSignup',
    async (token:string,{rejectWithValue}) =>{
        try{
               const response = await googleSignUpApi(token)

               tokenService.setTokens(response.tokens.accessToken,response.tokens.refreshToken)
               return {user:response.user,token:response.tokens.accessToken}
        }catch(err){
            if(axios.isAxiosError(err) && err.response?.data.error){
                return rejectWithValue(err.response?.data.error ||'Google sign up failed')
            }else{
                return rejectWithValue('Google Sign up failed')
            }
        }
    }
)


export  const googleSignin = createAsyncThunk(
    'auth/googleSignin',
    async (token:string,{rejectWithValue})=>{
        try{
            const response = await googleSignInApi(token)
            tokenService.setTokens(response.tokens.accessToken,response.tokens.refreshToken)
            return {user:response.user,token:response.tokens.accessToken}
        }catch(err){
            if(axios.isAxiosError(err) && err.response?.data.error){
                return rejectWithValue(err.response?.data.error || 'Google Sign in failed')
            }else{
                return rejectWithValue('Google Sign in failed')
            }
        }
    }
)




const userAuthSlice = createSlice({
    name:'Signin',
    initialState,
    reducers:{
        logOut:(state)=>{
            state.user = null
            state.status ='idle'
            state.error = null
            state.token = null
            tokenService.clearTokens()
        },
        setSignIn:(state)=>{
          state.view='signIn'
        },
        setSignUp:(state)=>{
            state.view='signUp'
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(signIn.pending,(state)=>{
            state.status = 'loading'
        })
        .addCase(signIn.fulfilled,(state,action)=>{
            state.status = 'succeeded'
            state.user = action.payload.user
            state.token = action.payload.token
            toast.success('sign in Sucessfully')
        })
        .addCase(signIn.rejected,(state,action)=>{
            state.status = 'rejected'
            state.error = action.payload as string
            toast.error(`failed to Signin:${action.payload}`)
        })
        .addCase(signUp.pending,(state)=>{
            state.status = 'loading'
        })
        .addCase(signUp.fulfilled,(state,action)=>{
             state.status = 'succeeded'
             state.user = action.payload.user
             console.log('state user',state.user)
             state.token = action.payload.token
             toast.success('sign up successfully')
        })
        .addCase(signUp.rejected,(state,action)=>{
            state.status = 'rejected'
            state.error = action.payload as string
                // Handle other errors or show a generic message
                toast.error(`Failed to signup: ${action.payload}`)
        })
        .addCase(googleSignup.pending,(state)=>{
             state.status = 'loading'
        })
        .addCase(googleSignup.fulfilled,(state,action)=>{
            state.status = 'succeeded'
            state.user = action.payload.user
            state.token = action.payload.token
            toast.success('Google sign up successful')
        })
        .addCase(googleSignup.rejected,(state,action)=>{
            state.status = 'rejected'
            state.error = action.payload as string
            console.log('state error',state.error)
            toast.error(`Google sign up failed:${action.payload}`)

        })
        .addCase(googleSignin.pending,(state)=>{
            state.status = 'loading'
             toast.info('Authenticating...')
       })
       .addCase(googleSignin.fulfilled,(state,action)=>{
        console.log('User from fulfilled:', action.payload.user);
           state.status = 'succeeded'
           state.user = action.payload.user
           state.token = action.payload.token
           toast.success('Google sign up successful')
       })
       .addCase(googleSignin.rejected,(state,action)=>{
           state.status = 'rejected'
           state.error = action.payload as string
           toast.error(`Google sign up failed:${action.payload}`)

       })
        
    }
}
)


export const {logOut,setSignIn,setSignUp} = userAuthSlice.actions
export default userAuthSlice.reducer
