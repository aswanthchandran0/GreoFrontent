import { useState,useRef,useEffect,ReactNode } from "react";

interface  UseModalReturn{
    isOpen:boolean
    open:()=> void
    close:()=> void
    setContent:(content:ReactNode) =>void
    content:ReactNode
}

export const useModal = ():UseModalReturn=>{
    const [isOpen,setIsOpen] = useState<boolean>(false)
    const [content,setContent] = useState<ReactNode>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    const open = ()=>setIsOpen(true)
    const close = ()=>setIsOpen(false)

    useEffect(()=>{
        const handleClickOutside = (event:MouseEvent)=>{
            if(modalRef.current  && !modalRef.current.contains(event.target as Node)){
                close()
            }
        }
        if(isOpen){
            document.addEventListener('mousedown',handleClickOutside)
        }
        
        return ()=>{
            document.removeEventListener('mousedown',handleClickOutside)
        }
    },[isOpen])

    return {
        isOpen,
        open,
        close,
        setContent,
        content,
      };

}
