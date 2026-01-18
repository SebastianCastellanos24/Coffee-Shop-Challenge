import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Shop from "./pages/Shop";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Nav from "./components/Nav";

export default function App() {
  return (
    <BrowserRouter>
      <Nav/>

      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}