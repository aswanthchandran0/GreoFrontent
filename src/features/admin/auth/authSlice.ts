import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { authenticateApi } from "../../../service/adminApi";
import axios from "axios";
import { toast } from "react-toastify";
import { adminTokenService } from "../../../service/adminTokenService";

 export interface adminAuthState{
    admin:any
    status:'idle'|'loading'|'succeeded'|'failed'
    error:string|null
    token:string |null
}

const initialState:adminAuthState ={
    admin:null,
    status:'idle',
    error:null,
    token: adminTokenService.getAccessToken() || null
}


export const authenticate = createAsyncThunk(
    'auth/authenticate',
    async({email,password}:{email:string; password:string},{rejectWithValue}) =>{
        try{
           const response = await authenticateApi(email,password)
           console.log('assees token ',response.token.accessToken)
           console.log('response from the backed',response)
          adminTokenService.setToken(response.token.accessToken)
           return response.admin
        }catch(error){
            if(axios.isAxiosError(error)){
                return rejectWithValue(error.response?.data.error || 'An error occured')
    
            }else{
                console.log('request was reaching in erro of authenticate')
            return rejectWithValue((error as Error).message|| 'An unexpected error was occured')

        }
    }
}
)

const adminAuthSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        signOut:(state)=>{
         state.admin = null,
         state.status = 'idle',
         state.error = null
         state.token = null
         adminTokenService.clearToken()
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(authenticate.pending,(state)=>{
            state.status = 'loading'
            toast.info('Authenticating...')
        })
        .addCase(authenticate.fulfilled,(state,action)=>{
            state.status = 'succeeded'
            state.admin =action.payload
            state.token = adminTokenService.getAccessToken();
            toast.success('Authentication successfull!')
        })
        .addCase(authenticate.rejected,(state,action)=>{
            state.status = 'failed'
            state.error = action.payload as string
            toast.error(`Authentication failed: ${action.payload}`)
        })
    }
})

export const {signOut} = adminAuthSlice.actions
export default adminAuthSlice.reducer