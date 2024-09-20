import SigninCard from "../../../components/user/SigninCard";
import SignupCard from "../../../components/user/SignupCard";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import React from "react";

const SignIn: React.FC = () => {
 const view = useSelector((state:RootState)=>state.userAuth.view)

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary sm:bg-primary md:bg-accent lg:bg-primary xl:bg-primary text-white">
      <div className="w-full max-w-md p-6">
        {
          view ==='signIn'?(
             <SigninCard/>
          ):(
            <SignupCard/>
          )
        }
        
      </div>
    </div>
  );
};

export default SignIn;
