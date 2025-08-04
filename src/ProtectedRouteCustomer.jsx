import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRouteCustomer = ({ children }) => {
    const token = Cookies.get('ordererToken');
    const role = Cookies.get('role');

    // 🔐 Token yoksa veya rol başka bir şeyse → yönlendir
    if (!token || token === 'null' || role !== 'Customer') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRouteCustomer;
