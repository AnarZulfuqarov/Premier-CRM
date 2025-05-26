import {createBrowserRouter} from "react-router-dom";
import Login from "../pages/LoginPage/index.jsx";
import CompanyPage from "../pages/UserPages/CompanyPage/index.jsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Login/>,
    },
    {
        path: '/choose-company',
        element: <CompanyPage/>,
    },
    {
        path: "/admin",
        // element: (
        //     // <ProtectedRoute>
        //     //     {/*<AdminPage/>*/}
        //     // </ProtectedRoute>
        // ),
        children: []
    },
    {
        path: "/",
        // element: <Login/>
    },
    {
        path: "*",
        // element: <NotFound/>
    }
]);

export default router;
