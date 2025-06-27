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
import ActiveOrders from "../pages/SupplierPages/ActiveOrders/index.jsx";
import OrderHistorySupplier from "../pages/SupplierPages/HistoryPage/index.jsx";
import OrderHistoryDetailSuplier from "../pages/SupplierPages/HistoryPageDetail/index.jsx";
import ActiveOrdersDetail from "../pages/SupplierPages/ActiveOrdersDetail/index.jsx";
import SupplierProducts from "../pages/SupplierPages/SupplierProducts/index.jsx";
import SupplierProductAdd from "../pages/SupplierPages/SupplierProductsAdd/index.jsx";
import SupplierCategories from "../pages/SupplierPages/SupplierCategories/index.jsx";
import SupplierCategoryAdd from "../pages/SupplierPages/SupplierCategorisAdd/index.jsx";
import SupplierVendors from "../pages/SupplierPages/SupplierVendors/index.jsx";
import VendorHistorySupplier from "../pages/SupplierPages/VendorHistoryPage/index.jsx";
import VendorHistoryDetailSuplier from "../pages/SupplierPages/VendorHistoryPageDetail/index.jsx";
import SuperAdminPage from "../pages/SuperAdminPages/SupplierPage/index.jsx";
import SuperAdminPeople from "../pages/SuperAdminPages/SuperAdminPeople/index.jsx";
import SuperAdminPeopleDetail from "../pages/SuperAdminPages/SuperAdminPeopleDetail/index.jsx";
import SuperAdminPeopleDetailAddBolme from "../pages/SuperAdminPages/SuperAdminPeopleDetailAddBolme/index.jsx";
import SuperAdminProducts from "../pages/SuperAdminPages/SuperAdminProducts/index.jsx";
import SuperAdminProductsAdd from "../pages/SuperAdminPages/SuperAdminProductsAdd/index.jsx";
import SuperAdminCategories from "../pages/SuperAdminPages/SuperAdminCategories/index.jsx";
import SuperAdminCategoryAdd from "../pages/SuperAdminPages/SuperAdminCategorisAdd/index.jsx";


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
            {
                path: "/supplier/activeOrder",
                element: <ActiveOrders/>
            },
            {
                path: "/supplier/activeOrder/:id",
                element: <ActiveOrdersDetail/>
            },
            {
                path: "/supplier/history",
                element: <OrderHistorySupplier/>
            },
            {
                path:"/supplier/history/:id",
                element:<OrderHistoryDetailSuplier/>
            },
            {
                path:"/supplier/products/products",
                element:<SupplierProducts/>
            },
            {
                path: "/supplier/productAdd",
                element: <SupplierProductAdd/>
            },
            {
                path:"/supplier/products/categories",
                element:<SupplierCategories/>
            },
            {
                path: "/supplier/categoryAdd",
                element: <SupplierCategoryAdd/>
            },
            {
                path: "/supplier/products/vendors",
                element: <SupplierVendors/>
            },
            {
                path: "/supplier/vendor/:id",
                element: <VendorHistorySupplier/>
            },
            {
                path: "/supplier/vendor/:id/:id",
                element: <VendorHistoryDetailSuplier/>
            }
        ]
    },
    {
        path:"/superAdmin",
        element: (
            <SuperAdminPage/>
        ),
        children: [
            {
                path: "/superAdmin/people",
                element: <SuperAdminPeople/>
            },
            {
                path: "/superAdmin/people/:id",
                element: <SuperAdminPeopleDetail/>
            },
            {
              path: "/superAdmin/people/:id/bolmeAdd",
              element: <SuperAdminPeopleDetailAddBolme/>
            },
            {
                path: "/superAdmin/history",
                element: <OrderHistorySupplier/>
            },
            {
                path:"/superAdmin/history/:id",
                element:<OrderHistoryDetailSuplier/>
            },
            {
                path:"/superAdmin/products/products",
                element:<SuperAdminProducts/>
            },
            {
                path: "/superAdmin/productAdd",
                element: <SuperAdminProductsAdd/>
            },
            {
                path:"/superAdmin/products/categories",
                element:<SuperAdminCategories/>
            },
            {
                path: "/superAdmin/categoryAdd",
                element: <SuperAdminCategoryAdd/>
            },
            {
                path: "/superAdmin/products/vendors",
                element: <SupplierVendors/>
            },
            {
                path: "/superAdmin/vendor/:id",
                element: <VendorHistorySupplier/>
            },
            {
                path: "/superAdmin/vendor/:id/:id",
                element: <VendorHistoryDetailSuplier/>
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
