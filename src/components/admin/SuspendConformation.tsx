import Modal from 'react-modal'
import { suspendUserApi } from '../../service/adminApi';
import React from 'react';



interface SuspendModalProps {
    isOpen: boolean;
    onClose: () => void;
    id: string;
    username: string;
  }
  
const SuspendConformationModal:React.FC<SuspendModalProps>=({ isOpen, onClose, id, username })=>{
    const handleSuspend = async () => {
        try {
          await suspendUserApi(id);
          onClose();
        } catch (error) {
          console.error('Failed to delete user:', error);
        }
      };
      
    return(
        <>
          <Modal 
       
       isOpen={isOpen}
       onRequestClose={onClose}
       className="fixed inset-0 flex justify-center items-center z-50 bg-black  bg-opacity-10"
       overlayClassName="fixed inset-0  bg-opacity-50"
       >
        <div className="fixed flex inset-0 justify-center items-center">
          <div className="flex flex-col bg-background w-full max-w-md justify-center items-center rounded">
            <div className="p-2">
         <span className="text-lg text-primary font-lato font-bold">Suspend</span>
            </div>
          
         <div className="flex flex-col justify-center items-center">
            <span className=" text-primary font-lato font-bold"> Are you Sure you want to suspend </span>
            <span className=" text-primary font-lato font-bold">{username}?</span>
          </div>

          <div className="space-x-2 p-2">
          <button onClick={onClose} className="bg-primary p-1 rounded text-background">cancel</button>
          <button onClick={handleSuspend} className="bg-red-500 p-1 rounded text-background">Suspend</button>

          </div>
          </div>
        </div>
        </Modal>
        </>
    )
}


export default SuspendConformationModal