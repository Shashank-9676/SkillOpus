import React, { useEffect } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
    const { userDetails } = useAuth();
    const token = Cookies.get('jwt_token');

    useEffect(() => {
        if (!userDetails || !token) {
            toast.info("Please login to access this page");
        }
    }, [userDetails, token]);

    if (!userDetails || !token) {
        return <Navigate to="/login" replace />;
    }
    
    return (
        <div>
            {children}
        </div>
    );
};

export default ProtectedRoute;