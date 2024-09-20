import { useSelector, } from "react-redux";
import { Navigate,Outlet } from "react-router-dom";
import { RootState } from "../../store/store";


function AdminSignOutAuth(){
    const token = useSelector((state:RootState)=>state.adminAuth.token)
    
    console.log('token in logout',token)
    return token? <Navigate to={'/admin'}/>:<Outlet/>
}

export default AdminSignOutAuth