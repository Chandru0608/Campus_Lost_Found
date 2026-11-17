import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import ReportItem from "./pages/ReportItem";
import ItemDetails from "./pages/ItemDetails";
import Auth from "./pages/Auth";
import { AuthProvider } from "./context/AuthContext";
export default function App() {
  return <AuthProvider><BrowserRouter><Navbar /><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Auth mode="login" />} />
    <Route path="/register" element={<Auth mode="register" />} />
    <Route path="/report" element={<ProtectedRoute><ReportItem /></ProtectedRoute>} />
    <Route path="/item/:id" element={<ItemDetails />} />
    <Route path="*" element={<main className="container"><h1>Page not found</h1></main>} />
  </Routes><footer>Campus Lost & Found · Built with React and Node.js</footer></BrowserRouter></AuthProvider>;
}
