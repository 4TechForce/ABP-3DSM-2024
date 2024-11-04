import { Route, Routes } from "react-router-dom";
import { NotFoundPage, SettingsPage,  } from "../pages";

export default function AdmRoutes() {
  return (
    <>
      <Routes>
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
