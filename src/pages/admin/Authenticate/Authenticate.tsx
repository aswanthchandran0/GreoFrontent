import AuthenticateCard from "../../../components/admin/AuthenticateCard"



const Authenticate:React.FC = ()=>{
    return(
        <div className="min-h-screen flex items-center justify-center bg-primary sm:bg-primary md:bg-accent lg:bg-primary xl:bg-primary text-white">
      <div className="w-full max-w-md p-6">
        <AuthenticateCard/>
      </div>
    </div>
    )
}


export default Authenticate