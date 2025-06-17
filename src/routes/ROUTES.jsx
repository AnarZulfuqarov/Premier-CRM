import {createBrowserRouter} from "react-router-dom";
import Login from "../pages/LoginPage/index.jsx";
import CompanyPage from "../pages/UserPages/CompanyPage/index.jsx";
import AdminPage from "../pages/AdminPages/AdminPage/index.jsx";
import CustomerOrderAdd from "../pages/CustomerPage/CustomerOrderAdd/index.jsx";
import OrderHistory from "../pages/CustomerPage/HistoryPage/index.jsx";
import OrderHistoryDetail from "../pages/CustomerPage/HistoryPageDetail/index.jsx";
import OrderHistoryDetailTwo from "../pages/CustomerPage/HistoryPageDetail2/index.jsx";
import CompanySectionPage from "../pages/UserPages/CompanySectionPage/index.jsx";
import CompanyDepartmentPage from "../pages/UserPages/CompanyDepartmentPage/index.jsx";
import SupplierPage from "../pages/SupplierPages/SupplierPage/index.jsx";


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
        path: '/choose-company-companyDepartment/:name',
        element: <CompanyDepartmentPage/>,
    },
    {
        path: '/choose-company-section/:name',
        element: <CompanySectionPage/>,
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
            },
            {
                path:"/admin/history/:id",
                element:<OrderHistoryDetail/>
            },
            {
                path:"/admin/historyTwo/:id",
                element:<OrderHistoryDetailTwo/>
            }
        ]
    },
    {
        path:"/supplier",
        element: (
            <SupplierPage/>
        ),
        children: [
            {}
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
