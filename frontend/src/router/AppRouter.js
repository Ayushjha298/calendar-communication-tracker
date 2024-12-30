import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/Admin/Dashboard";
import CompanyManagement from "../pages/Admin/CompanyManagement";
import CommunicationMethods from "../pages/Admin/CommunicationMethods";
import UserDashboard from "../pages/User/Dashboard";
import Calendar from "../pages/User/Calendar";

const AppRouter = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (token && role) {
            setIsAuthenticated(true);
            setUserRole(role);
        } else {
            setIsAuthenticated(false);
            setUserRole(null);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <Login
                            setIsAuthenticated={setIsAuthenticated}
                            setUserRole={setUserRole}
                        />
                    }
                />

                <Route path="/signup" element={<Register />} />

                <Route
                    path="/admin/dashboard"
                    element={
                        isAuthenticated && userRole === "admin" ? (
                            <AdminDashboard />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/admin/companies"
                    element={
                        isAuthenticated && userRole === "admin" ? (
                            <CompanyManagement />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/admin/communication-methods"
                    element={
                        isAuthenticated && userRole === "admin" ? (
                            <CommunicationMethods />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/user/dashboard"
                    element={
                        isAuthenticated && userRole === "user" ? (
                            <UserDashboard />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/user/calendar"
                    element={
                        isAuthenticated && userRole === "user" ? (
                            <Calendar />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="*"
                    element={
                        isAuthenticated ? (
                            userRole === "admin" ? (
                                <Navigate to="/admin/dashboard" />
                            ) : (
                                <Navigate to="/user/dashboard" />
                            )
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRouter;
