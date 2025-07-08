import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRouteSupplier = ({ children }) => {
    const token = Cookies.get('supplierToken');
    if (!token || token === 'null') {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default ProtectedRouteSupplier;
