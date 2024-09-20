import Sidebar from "../../../components/admin/Sidebar"
import Users from "../../../components/admin/Users"

const Dashboard:React.FC = ()=>{
    return (
        <>
        <div className="bg-primary w-full h-screen">
           <Sidebar/>
           <Users/>
        </div>
        </>
    )
}


export default Dashboard