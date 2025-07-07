import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRouteCustomer = ({ children }) => {
    const token = Cookies.get('ordererToken');
    if (!token || token === 'null') {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default ProtectedRouteCustomer;
