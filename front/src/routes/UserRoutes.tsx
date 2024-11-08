import { Route, Routes } from "react-router-dom";
import {  NotFoundPage } from "../pages";
import Logout from "../pages/Logout";
import Principal from "../pages/Principal";
import Alimentos from "../pages/Alimentos";
import CalorieProgress from "../pages/Refeicoes";
import UpdateUserForm from "../pages/UpdateUserForm";
import { AuthProvider } from "../contexts/AuthContext";
import HistoricoRefeicoes from "../pages/Refeicoes";

export default function UserRoutes() {
  return (
    <>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/profile/update/:id" element={<UpdateUserForm />} />
        <Route path="/alimentos" element={<Alimentos />} />
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/refeicoes" element={<HistoricoRefeicoes />} />
        {/* <Route path="/refeicoes" element={<UserHistory />} /> */}

      </Routes>
      </AuthProvider>
    </>
  );
}
