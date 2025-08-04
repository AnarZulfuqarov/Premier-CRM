import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
    const token = Cookies.get('superAdminToken');
    const role = Cookies.get('role');

    if (!token || token === 'null' || role !== 'SuperAdmin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
