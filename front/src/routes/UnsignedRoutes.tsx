import { Route, Routes } from "react-router-dom";
import { NotFoundPage, SignInPage, SignUpPage } from "../pages";
import Inicial from "../pages/Inicial";
import ForgotPassword from "../pages/Recuperacao";


export default function UnsignedRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Inicial />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/cadastro" element={<SignUpPage />} />
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/reset-password" element= {<ForgotPassword />} />
      </Routes>
    </>
  );
}
