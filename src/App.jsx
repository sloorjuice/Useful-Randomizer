import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Navbar from "./components/navbar"; 
import Register from "./pages/register";  
import Login from "./pages/login"; 
import Profile from "./pages/profile"; // Import the Profile page
import PassReset from "./pages/passreset";
import "./css/App.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} /> {/* Add Profile route */}
        <Route path="/forgot-password" element={<PassReset />} /> {/* Add Password Reset route */}
      </Routes>
    </>
  );
}

export default App;
