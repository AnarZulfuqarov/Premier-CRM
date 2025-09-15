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
import ProtectedRouteSupplier from "../ProtectedRouteSupplier.jsx";
import SupplierNotification from "../pages/NotificationPages/SupplierNotification/index.jsx";
import CustomerNotification from "../pages/NotificationPages/CustomerNotification/index.jsx";
import MobileCartPage from "../pages/CustomerPage/CustomerBasketPage/index.jsx";
import NotFound from "../pages/NotFound/index.jsx";
import ForgotPassword from "../pages/SuperAdminPages/SuperAdminForgotPassword/index.jsx";
import ResetPassword from "../pages/SuperAdminPages/SuperAdminResetPassword/index.jsx";
import SuccessResetPass from "../pages/SuperAdminPages/SuperAdminSuccess/index.jsx";
import SuperAdminStatistikTest from "../pages/SuperAdminStaticticTest/index.jsx";
import HrPage from "../pages/HRPages/HrPage/index.jsx";
import HrPeople from "../pages/HRPages/HrPeople/index.jsx";
import HrEmployment from "../pages/HRPages/HrEmployment/index.jsx";
import HrDirector from "../pages/HRPages/HrDirector/index.jsx";
import HrDirectorAdd from "../pages/HRPages/HrDirectorAdd/index.jsx";
import HrSalary from "../pages/HRPages/HrSalary/index.jsx";
import SuperAdminAccounter from "../pages/SuperAdminPages/SuperAdminAccounter/index.jsx";
import SuperAccounterAdd from "../pages/SuperAdminPages/SuperAdminAccounterAdd/index.jsx";
import AccounterPage from "../pages/AccounterPages/AccounterPage/index.jsx";
import OrderHistoryAccounter from "../pages/AccounterPages/HistoryPage/index.jsx";
import SuperAdminSupplierDetail from "../pages/SuperAdminPages/SuperAdminSupplierDetail/index.jsx";
import SuperAdminSupplierDetailAddBolme from "../pages/SuperAdminPages/SuperAdminSupplierDetailAddBolme/index.jsx";
import CompanyPageFighter from "../pages/SupplierPages/CompanyPageFighte/index.jsx";
import InCompleteOrders from "../pages/SupplierPages/InCompleteOrders/index.jsx";
import InCompleteOrdersDetail from "../pages/SupplierPages/InCompleteOrdersDetail/index.jsx";
import OrderHistoryDetailAccounter from "../pages/AccounterPages/AccounterHistoryPageDetail/index.jsx";
import AccounterBorc from "../pages/AccounterPages/AccounterBorc/index.jsx";
import AccounterBorcTarixce from "../pages/AccounterPages/AccounterBorcTarixce/index.jsx";
import AccounterNotification from "../pages/NotificationPages/AccounterNotification/index.jsx";
import SuperAdminAccounterBorc from "../pages/SuperAdminPages/SuperAdminAccounterBorc/index.jsx";
import SuperAdminBorcTarixce from "../pages/SuperAdminPages/SuperAdminBorcTarixce/index.jsx";


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
        path:"/choose-company-fighter",
        element:(
            <ProtectedRouteSupplier>
                <CompanyPageFighter/>
            </ProtectedRouteSupplier>
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
            {
                path: "/customer/notification",
                element: <CustomerNotification/>
            },
            {
                path: '/customer/basket',
                element: <MobileCartPage/>
            }

        ]
    },
    {
        path: "/supplier",
        element: (
            <ProtectedRouteSupplier>
            <SupplierPage/>
            </ProtectedRouteSupplier>
        ),
        children: [
            {
                path: "/supplier/activeOrder",
                element: <ActiveOrders/>
            },
            {
                path: "/supplier/inComplete",
                element: <InCompleteOrders/>
            },
            {
                path: "/supplier/activeOrder/:id",
                element: <ActiveOrdersDetail/>
            },
            {
                path: "/supplier/inComplete/:id",
                element: <InCompleteOrdersDetail/>
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
            },
            {
                path: "/supplier/notification",
                element: <SupplierNotification/>
            },
        ]
    },
    {
        path: "/forgotPassword",
        element: <ForgotPassword/>
    },
    {
        path: "/resetPassword",
        element: <ResetPassword/>
    },
    {
        path: "/success",
        element: <SuccessResetPass/>
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
                path: "/superAdmin/people/personAdd",
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
                path: "/superAdmin/accounter/accounter",
                element: <SuperAdminAccounter/>
            },
            {
                path: "/superAdmin/accounter/borc",
                element: <SuperAdminAccounterBorc/>
            },
            {
                path: "/superAdmin/accounter/borc/:id",
                element: <SuperAdminBorcTarixce/>
            },
            {
                path: "/superAdmin/accounter/accounterAdd",
                element: <SuperAccounterAdd/>
            },
            {
                path: "/superAdmin/people/:id",
                element: <SuperAdminPeopleDetail/>
            },
            {
                path: "/superAdmin/supplier/:id",
                element: <SuperAdminSupplierDetail/>
            },
            {
                path: "/superAdmin/people/:id/bolmeAdd",
                element: <SuperAdminPeopleDetailAddBolme/>
            },
            {
                path: "/superAdmin/supplier/:id/bolmeAdd",
                element: <SuperAdminSupplierDetailAddBolme/>
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
                path: "/superAdmin/vendor/:vendorId/:id",
                element: <VendorHistoryDetailSuperAdmin/>
            },
            {
                path: "/superAdmin/companies",
                element: <SuperAdminCompanies/>
            },
            {
                path: "/superAdmin/companies/companyAdd",
                element: <SuperAdminCompanyAdd/>
            },
            {
                path: "/superAdmin/companies/:id/sobe",
                element: <SuperAdminSobe/>
            },
            {
                path: "/superAdmin/companies/:id/sobeAdd",
                element: <SuperAdminSobeAdd/>
            },
            {
                path: "/superAdmin/companies/sobe/:id/bolme",
                element: <SuperAdminBolme/>
            },
            {
                path: "/superAdmin/companies/sobe/:id/bolmeAdd",
                element: <SuperAdminBolmeAdd/>
            },
            {
                path: "/superAdmin/companies/bolme/persons/:id",
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
            {
                path: "/superAdmin/statistik",
                element: <SuperAdminStatistikTest/>
            }
        ]
    },
    {
        path: "/test",
        element:<SuperAdminStatistikTest/>
    },
    {
        path: "*",
        element: <NotFound/>
    },
    {
        path:"/hr",
        element: <HrPage/>,
        children:[
            {
                path: "/hr/people",
                element: <HrPeople/>
            },
            {
                path: "/hr/employment",
                element: <HrEmployment/>
            },
            {
                path: "/hr/director",
                element: <HrDirector/>
            },
            {
                path: "/hr/directorAdd",
                element: <HrDirectorAdd/>
            },
            {
                path: "/hr/salary",
                element: <HrSalary/>
            }
        ]
    },
    {
        path: "/accounter",
        element: (
                <AccounterPage/>
        ),
        children: [

            {
                path: "/accounter/history",
                element: <OrderHistoryAccounter/>
            },
            {
                path: "/accounter/history/:id",
                element: <OrderHistoryDetailAccounter/>
            },
            {
                path: "/accounter/borc",
                element: <AccounterBorc/>
            },
            {
                path: "/accounter/borc/:id",
                element: <AccounterBorcTarixce/>
            },
            {
                path: "/accounter/notification",
                element: <AccounterNotification/>
            },
        ]
    },
]);

export default router;
