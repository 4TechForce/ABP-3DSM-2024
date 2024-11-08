import { Route, Routes } from "react-router-dom";
import { NotFoundPage  } from "../pages";

export default function AdmRoutes() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
