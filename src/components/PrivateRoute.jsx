import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService.js';
import {getCurrentFamily} from "../services/FamilyService.js";

const PrivateRoute = ({ element, requiresFamily = false }) => {
    const user = AuthService.getCurrentUser();
    const family = getCurrentFamily();

    if (requiresFamily && !family) {
        return <Navigate to="/" />;
    }

    return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;