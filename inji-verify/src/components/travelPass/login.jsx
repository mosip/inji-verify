import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import LoginOtp from "./loginOtp";
import Navbar from "./Navbar";


export default function Login({ onLogin }) {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const step = query.get("step");

  const handleLoginOtp = () => {
    navigate("/login?step=otp");
  };

  return (
    <>
    <Navbar/>
     {step !== "otp" && <LoginForm sentOtp={handleLoginOtp} />}
     {step === "otp" && <LoginOtp />}
    </>
  );
}