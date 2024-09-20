
import { useSelector } from "react-redux";
import { Navigate,Outlet } from "react-router-dom";
import { RootState } from "../../store/store";
import {adminTokenService} from "../../service/adminTokenService";

function AdminSigninAuth(){
    const token = useSelector((state:RootState)=>state.adminAuth.token)
    console.log('admin access token in sign in ', token);
    return token?<Outlet/>:<Navigate to={'/admin/authenticate'}/>
}

export default AdminSigninAuth