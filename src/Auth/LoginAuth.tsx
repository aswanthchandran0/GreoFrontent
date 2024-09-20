import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { Navigate,Outlet } from "react-router-dom";


function LoginAuth(){
    const token = useSelector((state:RootState)=>state.userAuth.token)
    return token?<Outlet/>:<Navigate to={'/signin'}/>
}

export default LoginAuth