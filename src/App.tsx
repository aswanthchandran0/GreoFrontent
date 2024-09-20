import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from "react-router-dom";
import SignIn from "./pages/user/Signin/Signin";
import Authenticate from "./pages/admin/Authenticate/Authenticate";
import HomePage from "./pages/user/Homepage/Homepage";
import LoginAuth from "./Auth/LoginAuth";
import LogoutAuth from "./Auth/LogoutAuth";
import Sidebar from "./components/user/Sidebar";
import Upload from "./components/user/Upload";
import AdminPanel from "./pages/admin/Dashboard/AdminPanel";
import AdminSigninAuth from "./Auth/Admin/AdminSigninAuth";
import AdminSignOutAuth from "./Auth/Admin/AdminSignOutAuth";
import ProfilePage from "./pages/user/Profilepage/ProfilePage.tsx";
import MessagePage from "./pages/user/Message/MessagePage.tsx";

const UserLayout: React.FC<{ openUpload: () => void }> = ({ openUpload }) => (
  <>
    <div className="flex">
      <Sidebar openUpload={openUpload} />
      <div className="flex-1 ml-0 sm:ml-20 md:ml-24 lg:ml-60 xl:ml-50 ">
        <Outlet />
      </div>
    </div>
  </>
);



const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Router>
      {isModalOpen && <Upload onClose={closeModal} />}

      <Routes>
        <Route element={<LogoutAuth />}>
          <Route path="/signin" element={<SignIn />} />
        </Route>

        <Route element={<LoginAuth />}>
          <Route element={<UserLayout openUpload={openModal} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/:username" element={<ProfilePage />} />
          </Route>
            <Route path="/chat/:userId?" element={<MessagePage/>}/>
        </Route>


        <Route element={<AdminSignOutAuth />}>
          <Route path="/admin/authenticate" element={<Authenticate />} />
        </Route>

        <Route element={<AdminSigninAuth />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

      </Routes>
    </Router>
  )
}

export default App