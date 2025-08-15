import { RouterProvider } from 'react-router-dom';
import './App.css';
import Cookies from 'js-cookie';
import router from './routes/ROUTES';
import { useEffect } from 'react';

const AuthSyncListener = () => {

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'auth-change') {
                window.location.reload();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return null;
};


const App = () => {
    const token = Cookies.get('superAdminToken');
    if (!token) {
        Cookies.set('superAdminToken', 'null');
    }

    return (
        <div>
            <AuthSyncListener />
            <RouterProvider router={router} />
        </div>
    );
};

export default App;
