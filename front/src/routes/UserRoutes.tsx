import { Route, Routes } from "react-router-dom";
import { FoodPage, NotFoundPage, ProductPage, ProfilePage, SettingsPage, SignInPage } from "../pages";
import { EatProvider, FoodProvider, ProductProvider } from "../contexts";
import Logout from "../pages/Logout";
import ResetPassword from "../pages/Editar";
import Principal from "../pages/Principal";
import Configuracoes from "../pages/Configuracoes";
import Alimentos from "../pages/Alimentos";

export default function UserRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/principal" element={<Principal />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/alimentos" element={<Alimentos />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </>
  );
}
