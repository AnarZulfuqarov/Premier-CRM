import {createBrowserRouter} from "react-router-dom";
import CompanyPage from "../pages/UserPages/CompanyPage/index.jsx";
import AdminPage from "../pages/AdminPages/AdminPage/index.jsx";
import CustomerOrderAdd from "../pages/CustomerPage/CustomerOrderAdd/index.jsx";
import OrderHistory from "../pages/CustomerPage/HistoryPage/index.jsx";
import OrderHistoryDetail from "../pages/CustomerPage/HistoryPageDetail/index.jsx";
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
import SuperAdminPeople from "../pages/SuperAdminPages/SuperAdminPeople/index.jsx";
import SuperAdminPeopleDetail from "../pages/SuperAdminPages/SuperAdminPeopleDetail/index.jsx";
import SuperAdminPeopleDetailAddBolme from "../pages/SuperAdminPages/SuperAdminPeopleDetailAddBolme/index.jsx";
import SuperAdminProducts from "../pages/SuperAdminPages/SuperAdminProducts/index.jsx";
import SuperAdminProductsAdd from "../pages/SuperAdminPages/SuperAdminProductsAdd/index.jsx";
import SuperAdminCategories from "../pages/SuperAdminPages/SuperAdminCategories/index.jsx";
import SuperAdminCategoryAdd from "../pages/SuperAdminPages/SuperAdminCategorisAdd/index.jsx";
import SuperAdminVendors from "../pages/SuperAdminPages/SuperAdminVendors/index.jsx";
import SuperAdminVendorsAdd from "../pages/SuperAdminPages/SuperAdminVendorsAdd/index.jsx";
import VendorHistorySuperAdmin from "../pages/SuperAdminPages/SuperAdminVendorsHistoryPage/index.jsx";
import VendorHistoryDetailSuperAdmin from "../pages/SuperAdminPages/VendorHistoryPageDetail/index.jsx";
import SuperAdminPage from "../pages/SuperAdminPages/SuperAdminPage/index.jsx";
import SuperAdminCompanies from "../pages/SuperAdminPages/SuperAdminCompanies/index.jsx";
import SuperAdminCompanyAdd from "../pages/SuperAdminPages/SuperAdminCompaniesAdd/index.jsx";
import SuperAdminSobe from "../pages/SuperAdminPages/SuperAdminSobe/index.jsx";
import SuperAdminSobeAdd from "../pages/SuperAdminPages/SuperAdminSobeAdd/index.jsx";
import SuperAdminBolme from "../pages/SuperAdminPages/SuperAdminBolme/index.jsx";
import SuperAdminBolmeAdd from "../pages/SuperAdminPages/SuperAdminBolmeAdd/index.jsx";
import SuperAdminBolmePerson from "../pages/SuperAdminPages/SuperAdminBolmePerson/index.jsx";
import SuperAdminVezife from "../pages/SuperAdminPages/SuperAdminVezife/index.jsx";
import SuperAdminVezifeAdd from "../pages/SuperAdminPages/SuperAdminVezifeAdd/index.jsx";
import SuperAdminNotification from "../pages/NotificationPages/SuperAdminNotification/index.jsx";
import OrderHistorySuperAdmin from "../pages/SuperAdminPages/SuperAdminHistoryPage/index.jsx";
import OrderHistoryDetailSuperAdmin from "../pages/SuperAdminPages/SuperAdminHistoryPageDetail/index.jsx";
import OrderHistoryDetailSuperAdminTwo from "../pages/SuperAdminPages/SuperAdminHistoryPageDetailTwo/index.jsx";
import SuperAdminKalkulyasiya from "../pages/SuperAdminPages/SuperAdminKalkulyasiya/index.jsx";
import SuperAdminKalkulyasiyaDetail from "../pages/SuperAdminPages/SuperAdminKalkulyasiyaDetail/index.jsx";
import ProtectedRoute from "../ProtectedRoute.jsx";
import SuperPersonAdd from "../pages/SuperAdminPages/SuperAdminPersonAdd/index.jsx";
import SuperAdminSupplier from "../pages/SuperAdminPages/SuperAdminSupplier/index.jsx";
import SuperSupplierAdd from "../pages/SuperAdminPages/SuperAdminSupplierAdd/index.jsx";
import AdminLogin from "../pages/AdminLoginPage/index.jsx";
import Login from "../pages/LoginPage/index.jsx";
import ProtectedRouteCustomer from "../ProtectedRouteCustomer.jsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Login/>,
    },
    {
        path: '/adminLogin',
        element: <AdminLogin/>,
    },
    {
        path:"/choose-company",
        element:(
            <ProtectedRouteCustomer>
                <CompanyPage/>
            </ProtectedRouteCustomer>
        )
    },
    {
        path:"/choose-company-companyDepartment",
        element:(
            <ProtectedRouteCustomer>
                <CompanyDepartmentPage/>
            </ProtectedRouteCustomer>
        )
    },
    {
        path:"/choose-company-section",
        element:(
            <ProtectedRouteCustomer>
                <CompanySectionPage/>
            </ProtectedRouteCustomer>
        )
    },
    {
        path: "/customer",
        element: (
            <ProtectedRouteCustomer>
                <AdminPage/>
            </ProtectedRouteCustomer>
        ),
        children: [
            {
                path: "/customer/customerAdd",
                element: <CustomerOrderAdd/>
            },
            {
                path: "/customer/history",
                element: <OrderHistory/>
            },
            {
                path: "/customer/history/:id",
                element: <OrderHistoryDetail/>
            },

        ]
    },
    {
        path: "/supplier",
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
                path: "/supplier/history/:id",
                element: <OrderHistoryDetailSuplier/>
            },
            {
                path: "/supplier/products/products",
                element: <SupplierProducts/>
            },
            {
                path: "/supplier/productAdd",
                element: <SupplierProductAdd/>
            },
            {
                path: "/supplier/products/categories",
                element: <SupplierCategories/>
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
                path: "/supplier/vendor/:vendorId/:id",
                element: <VendorHistoryDetailSuplier/>
            }
        ]
    },
    {
        path: "/superAdmin",
        element: (
            <ProtectedRoute>
                <SuperAdminPage/>
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/superAdmin/people",
                element: <SuperAdminPeople/>
            },
            {
                path: "/superAdmin/personAdd",
                element: <SuperPersonAdd/>
            },
            {
                path: "/superAdmin/supplier",
                element: <SuperAdminSupplier/>
            },
            {
                path: "/superAdmin/supplierAdd",
                element: <SuperSupplierAdd/>
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
                path: "/superAdmin/products/products",
                element: <SuperAdminProducts/>
            },
            {
                path: "/superAdmin/productAdd",
                element: <SuperAdminProductsAdd/>
            },
            {
                path: "/superAdmin/products/categories",
                element: <SuperAdminCategories/>
            },
            {
                path: "/superAdmin/categoryAdd",
                element: <SuperAdminCategoryAdd/>
            },
            {
                path: "/superAdmin/products/vendors",
                element: <SuperAdminVendors/>
            },
            {
                path: "/superAdmin/products/vendorAdd",
                element: <SuperAdminVendorsAdd/>
            },
            {
                path: "/superAdmin/vendor/:id",
                element: <VendorHistorySuperAdmin/>
            },
            {
                path: "/superAdmin/vendor/:id/:id",
                element: <VendorHistoryDetailSuperAdmin/>
            },
            {
                path: "/superAdmin/companies",
                element: <SuperAdminCompanies/>
            },
            {
                path: "/superAdmin/companyAdd",
                element: <SuperAdminCompanyAdd/>
            },
            {
                path: "/superAdmin/company/:id/sobe",
                element: <SuperAdminSobe/>
            },
            {
                path: "/superAdmin/company/:id/sobeAdd",
                element: <SuperAdminSobeAdd/>
            },
            {
                path: "/superAdmin/sobe/:id/bolme",
                element: <SuperAdminBolme/>
            },
            {
                path: "/superAdmin/sobe/:id/bolmeAdd",
                element: <SuperAdminBolmeAdd/>
            },
            {
                path: "/superAdmin/bolmePerson",
                element: <SuperAdminBolmePerson/>
            },
            {
                path: "/superAdmin/vezife",
                element: <SuperAdminVezife/>
            },
            {
                path: "/superAdmin/vezifeAdd",
                element: <SuperAdminVezifeAdd/>
            },
            {
                path: "/superAdmin/notification",
                element: <SuperAdminNotification/>
            },
            {
                path: "/superAdmin/history",
                element: <OrderHistorySuperAdmin/>
            },
            {
                path: "/superAdmin/history/:id",
                element: <OrderHistoryDetailSuperAdmin/>
            },
            {
                path: "/superAdmin/historyTwo/:id",
                element: <OrderHistoryDetailSuperAdminTwo/>
            },
            {
                path: "/superAdmin/kalkulyasiya",
                element: <SuperAdminKalkulyasiya/>
            },
            {
                path: "/superAdmin/kalkulyasiya/:id",
                element: <SuperAdminKalkulyasiyaDetail/>
            },
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
