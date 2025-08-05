import { RouterProvider } from 'react-router-dom';
import './App.css';
import Cookies from 'js-cookie';
import router from './routes/ROUTES';
import { useEffect } from 'react';
import { useGetUserFightersQuery, useGetUserQuery } from "./services/adminApi.jsx";

const AuthSyncListener = () => {
    const { data: getUser, error: userError } = useGetUserQuery();
    const { data: getUserFighters, error: fightersError } = useGetUserFightersQuery();

    useEffect(() => {
        // Error varsa və status 401 və ya 403-dürsə tokeni sil
        if (
            (userError && (userError.status === 400 || userError.status === 400)) ||
            (fightersError && (fightersError.status === 400 || fightersError.status === 400))
        ) {
            Cookies.remove('superAdminToken');
            localStorage.setItem('auth-change', Date.now()); // diger tablar ucun trigger
            window.location.reload(); // indiki tabda refresh
        }
    }, [userError, fightersError]);

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
