import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

export interface ModalState{
    shareOpenModal:boolean
}


  const initialState:ModalState = {
    shareOpenModal:false
}


const modalSlice = createSlice({
    name:'modal',
    initialState,
    reducers:{
        openShareModal:(state)=>{
            state.shareOpenModal = true
        },
        closeShareModal:(state)=>{
            state.shareOpenModal = false
        }
    }
})

export const {openShareModal,closeShareModal} = modalSlice.actions
export default modalSlice.reducer