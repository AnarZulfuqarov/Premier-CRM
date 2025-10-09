import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRouteAccounter = ({ children }) => {
    const token = Cookies.get('accountToken');
    const role = Cookies.get('role');

    if (role!=="SuperAdmin") {
        if (!token || token === 'null'  || role !== 'Accountant') {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRouteAccounter;
