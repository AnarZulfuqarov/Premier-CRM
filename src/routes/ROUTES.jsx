import {createBrowserRouter} from "react-router-dom";
import Login from "../pages/LoginPage/index.jsx";
import CompanyPage from "../pages/UserPages/CompanyPage/index.jsx";
import AdminPage from "../pages/AdminPages/AdminPage/index.jsx";
import CustomerOrderAdd from "../pages/CustomerPage/CustomerOrderAdd/index.jsx";
import OrderHistory from "../pages/CustomerPage/HistoryPage/index.jsx";


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
        element: (
         <AdminPage/>
        ),
        children: [
            {
                path: "/admin/customerAdd",
                element:<CustomerOrderAdd/>
            },
            {
                path:"/admin/history",
                element:<OrderHistory/>
            }
        ]
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
