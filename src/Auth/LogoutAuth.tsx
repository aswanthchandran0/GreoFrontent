import { RootState } from "../store/store";
import { useSelector, } from "react-redux";
import { Navigate,Outlet } from "react-router-dom";


function LogoutAuth(){
    const token = useSelector((state:RootState)=>state.userAuth.token)
    
    console.log('token in logout',token)
    return token? <Navigate to={'/'}/>:<Outlet/>
}

export default LogoutAuth