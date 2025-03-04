import { Navigate } from "react-router-dom";

function PrivateRoute({ element }){
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;