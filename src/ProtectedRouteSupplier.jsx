import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRouteSupplier = ({ children }) => {
    const token = Cookies.get('supplierToken');
    const role = Cookies.get('role');

    // 🔐 Token yoksa veya rol yanlışsa yönlendir
    if (!token || token === 'null' || role !== 'Fighter') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRouteSupplier;
