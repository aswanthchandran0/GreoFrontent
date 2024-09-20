import { useEffect, useState } from "react"
import { getAllUser } from "../../service/adminApi";
import SuspendConformationModal from "./SuspendConformation";

const usersHeader = [
    {name:'No'},
    {name:'Id'},
    {name:'Username'},
    {name:'Email'},
    {name:'suspend'}
]


interface User {
    id: string;
    user_name: string;
    email: string;
    is_suspended: boolean;
  }

  
interface SuspendModalUser {
  id: string;
  username: string;
}

const Users:React.FC = ()=>{
    const [users,setUsers] = useState<User[]>([])
    const [suspendModalOpen,setSuspendModalOpen] = useState<boolean>(false)
    const [suspendUser, setSuspendUser] = useState<SuspendModalUser | null>(null);

const fetchUsers = async ()=>{
  const response =   await getAllUser()
  console.log('response data',response.data)
  setUsers(response.data)
}

  useEffect(()=>{
     fetchUsers()
  },[])

  const openSuspendModal = (id: string, username: string) => {
    setSuspendUser({ id, username });
    setSuspendModalOpen(true);
}

   return(
    <>
   <div className="pt-28 flex flex-col justify-center space-y-3 items-center">
  <div className="flex items-center justify-center bg-background h-10 rounded w-full max-w-4xl shadow-lg">
    <span className="text-lg text-accent font-lato font-extrabold">Users</span>
  </div>
  <div className="flex flex-col items-start w-full max-w-4xl h-[70vh] rounded bg-background overflow-auto">
    <table className="w-full">
      <thead>
        <tr className="bg-secondary text-background font-lato font-extrabold">
          {usersHeader.map((header, index) => (
            <th key={index} className="py-2 px-4 border-b border-secondary">
              {header.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="">
        {users && users.map((user, index) => (
          <tr key={index} className="text-text font-lato font-extrabold">
            <td className="py-2 text-sm px-4">{index + 1}</td>
            <td className="py-2 text-sm font px-4 ">{user.id}</td>
            <td className="py-2 text-sm font px-4">{user.user_name}</td>
            <td className="py-2 text-sm font px-4 ">{user.email}</td>
           <td className="py-2 text-sm font px-4">
                {
                    user.is_suspended ? <button className="bg-red-500 p-1 rounded text-background">Unsuspend</button> : <button  onClick={() => openSuspendModal(user.id, user.user_name)} className="bg-primary p-1 rounded text-background">Suspend</button>
                }
           </td>
          </tr>
        ))}
      </tbody>
    </table>
    {suspendUser && ( <SuspendConformationModal   isOpen={suspendModalOpen} onClose={() => setSuspendModalOpen(false)} id={suspendUser.id}  username={suspendUser.username}  />
                    )}
  </div>
</div>

    </>
   )
}


export default Users