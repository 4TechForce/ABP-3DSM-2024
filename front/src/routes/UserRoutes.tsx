import { Route, Routes } from "react-router-dom";
import {  NotFoundPage, SettingsPage } from "../pages";
import Logout from "../pages/Logout";
import ResetPassword from "../pages/Editar";
import Principal from "../pages/Principal";
import Configuracoes from "../pages/Configuracoes";
import Alimentos from "../pages/Alimentos";
import PratoComponent from "../pages/Prato";
import CalorieProgress from "../pages/Historico";

export default function UserRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/profile/:id" element={<Principal />} />
        <Route path="/configuracoes" element={<Configuracoes/>} />
        <Route path="/alimentos" element={<Alimentos />} />
        <Route path="/prato" element={<PratoComponent />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/historico" element={<CalorieProgress goal={0} current={0} />} />
      </Routes>
    </>
  );
}
