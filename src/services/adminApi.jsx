import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://crmsystem-production-0232.up.railway.app/api/',
        prepareHeaders: (headers, { endpoint, args }) => {
            const role = Cookies.get("role");

            let token = null;

            switch(role){
                case "SuperAdmin":
                    token = Cookies.get("superAdminToken");
                    break;
                case "Fighter":
                    token = Cookies.get("supplierToken");
                    break;
                case "Customer":
                    token = Cookies.get("ordererToken");
                    break;
                case "Accountant":
                    token = Cookies.get("accountToken");
                    break;
                default:
                    token = null;
            }

            if(token && token !== "null"){
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },

    }),
    endpoints: (builder) => ({
        loginSuperAdmin: builder.mutation({
            query: (credentials) => ({
                url: '/Admins/login',
                method: 'POST',
                body: credentials,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: '/Accounts/login',
                method: 'POST',
                body: credentials,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        getUser: builder.query({
            query: () => ({
                url: `/Customers/getUser`,
            }),
        }),

        getUserFighters: builder.query({
            query: () => ({
                url: `/Fighters/me`,
            }),
        }),
        getUserAccountants: builder.query({
            query: () => ({
                url: `/Accountants/getUser`,
            }),
        }),
        forgotPassword: builder.mutation({
            query: ({phoneNumber}) => ({
                url: `/Admins/reset-password/send-link?phoneNumber=${phoneNumber}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        resetPassword: builder.mutation({
            query: (pass) => ({
                url: '/Admins/reset-password/confirm',
                method: 'POST',
                body: pass,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        getUserCompanies: builder.query({
            query: () => ({
                url: `/Customers/companies`,
            }),
        }),
        getUserCompaniesDepartment: builder.query({
            query: ({companyId}) => ({
                url: `/Customers/departments?companyId=${companyId}`,
            }),
        }),
        getUserCompaniesDepartmentBolme: builder.query({
            query: ({departmentId}) => ({
                url: `/Customers/sections?departmentId=${departmentId}`,
            }),
        }),
        getSectionsId: builder.query({
            query: (id) => ({
                url: `/Sections/${id}`,
            }),
        }),
        getAllCompanies: builder.query({
            query: () => ({
                url: `/Companies`,
            }),
        }),
        getCompanyId: builder.query({
            query: (id) => ({
                url: `/Companies/${id}`,
            }),
        }),
        createCompany: builder.mutation({
            query: (company) => ({
                url: '/Companies',
                method: 'POST',
                body: company,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        editCompany: builder.mutation({
            query: (company) => ({
                url: '/Companies',
                method: 'PUT',
                body: company,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        deleteCompany: builder.mutation({
            query: (id) => ({
                url: `/Companies/${id}`,
                method: 'DELETE',
            }),
        }),
        getAllJobs: builder.query({
            query: () => ({
                url: `/Jobs`,
            }),
        }),
        getJobsId: builder.query({
            query: (id) => ({
                url: `/Jobs/${id}`,
            }),
        }),
        createJobs: builder.mutation({
            query: (job) => ({
                url: '/Jobs',
                method: 'POST',
                body: job,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        editJob: builder.mutation({
            query: (job) => ({
                url: '/Jobs',
                method: 'PUT',
                body: job,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        deleteJob: builder.mutation({
            query: (id) => ({
                url: `/Jobs/${id}`,
                method: 'DELETE',
            }),
        }),
        getSobeBYCompanyId: builder.query({
            query: (companyId) => ({
                url: `/Departments/by-company/${companyId}`,
            }),
        }),
        createDepartment: builder.mutation({
            query: (department) => ({
                url: '/Departments',
                method: 'POST',
                body: department,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        editDepartment: builder.mutation({
            query: (department) => ({
                url: '/Departments',
                method: 'PUT',
                body: department,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        deleteDepartment: builder.mutation({
            query: (id) => ({
                url: `/Departments/${id}`,
                method: 'DELETE',
            }),
        }),
        getDepartmentId: builder.query({
            query: (id) => ({
                url: `/Departments/${id}`,
            }),
        }),
        getSobeBYDepartmentId: builder.query({
            query: (departmentId) => ({
                url: `/Sections/by-department/${departmentId}`,
            }),
        }),
        getAllSections: builder.query({
            query: () => ({
                url: `/Sections`,
            }),
        }),
        createSections: builder.mutation({
            query: (section) => ({
                url: '/Sections',
                method: 'POST',
                body: section,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        editSection: builder.mutation({
            query: (section) => ({
                url: '/Sections',
                method: 'PUT',
                body: section,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        deleteSection: builder.mutation({
            query: (id) => ({
                url: `/Sections/${id}`,
                method: 'DELETE',
            }),
        }),
        getAllVendors: builder.query({
            query: () => ({
                url: `/Vendors`,
            }),
        }),
        getAllVendorsId: builder.query({
            query: (id) => ({
                url: `/Vendors/${id}`,
            }),
        }),
        createVendors: builder.mutation({
            query: (section) => ({
                url: '/Vendors',
                method: 'POST',
                body: section,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        editVendor: builder.mutation({
            query: (vendor) => ({
                url: '/Vendors',
                method: 'PUT',
                body: vendor,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        deleteVendor: builder.mutation({
            query: (id) => ({
                url: `/Vendors/${id}`,
                method: 'DELETE',
            }),
        }),
        getAllCustomers: builder.query({
            query: () => ({
                url: `/Customers`,
            }),
        }),
        getByIdCustomers: builder.query({
            query: (id) => ({
                url: `/Customers/${id}`,
            }),
        }),
        createCustomers: builder.mutation({
            query: (customer) => ({
                url: '/Customers',
                method: 'POST',
                body: customer,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        addBolmeCustomers: builder.mutation({
            query: ({ customerId, sectionIds }) => ({
                url: `/Customers/${customerId}/assign-sections`,
                method: 'POST',
                body: { sectionIds },
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
        deleteCustomer: builder.mutation({
            query: (id) => ({
                url: `/Customers/${id}`,
                method: 'DELETE',
            }),
        }),
        deleteCustomerBolme: builder.mutation({
            query: ({customerId,sectionId}) => ({
                url: `/Customers/${customerId}/sections/${sectionId}`,
                method: 'DELETE',
            }),
        }),
        editCustomer: builder.mutation({
            query: (customer) => ({
                url: '/Customers',
                method: 'PUT',
                body: customer,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        getAllCategories: builder.query({
            query: () => ({
                url: `/Categories`,
            }),
        }),
        createCategories: builder.mutation({
            query: (category) => ({
                url: '/Categories/request-create',
                method: 'POST',
                body: category,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        updateCategories: builder.mutation({
            query: (category) => ({
                url: '/Categories/request-update',
                method: 'POST',
                body: category,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        deleteCategories: builder.mutation({
            query: (id) => ({
                url: `/Categories/request-delete/${id}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        getAllProducts: builder.query({
            query: () => ({
                url: `/Products`,
            }),
        }),
        createProducts: builder.mutation({
            query: (product) => ({
                url: '/Products/request-create',
                method: 'POST',
                body: product,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        updateProducts: builder.mutation({
            query: (product) => ({
                url: '/Products/request-update',
                method: 'POST',
                body: product,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        deleteProducts: builder.mutation({
            query: (id) => ({
                url: `/Products/request-delete/${id}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        getAllFighters: builder.query({
            query: () => ({
                url: `/Fighters`,
            }),
        }),
        getByIdFighters: builder.query({
            query: (id) => ({
                url: `/Fighters/${id}`,
            }),
        }),
        getByIdFightersCompanies: builder.query({
            query: () => ({
                url: `/Fighters/companies`,
            }),
        }),
        createFighters: builder.mutation({
            query: (fighter) => ({
                url: '/Fighters/register',
                method: 'POST',
                body: fighter,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        deleteFighter: builder.mutation({
            query: (phoneNumber) => ({
                url: `/Fighters/by-phone/${phoneNumber}`,
                method: 'DELETE',
            }),
        }),
        deleteFighterBolme: builder.mutation({
            query: ({fighterId,companyId}) => ({
                url: `/Fighters/${fighterId}/companies/${companyId}`,
                method: 'DELETE',
            }),
        }),
        addBolmeFighters: builder.mutation({
            query: (body) => ({
                url: `/Fighters/companies`,
                method: 'POST',
                body,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
        editFighter: builder.mutation({
            query: (fighter) => ({
                url: '/Fighters',
                method: 'PUT',
                body: fighter,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        createOrders: builder.mutation({
            query: (order) => ({
                url: '/Orders',
                method: 'POST',
                body: order,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        getMyOrders: builder.query({
            query: () => ({
                url: `/Orders/my-orders`,
            }),
        }),
        getOrders: builder.query({
            query: () => ({
                url: `/Orders`,
            }),
        }),
        getOrdersVendor: builder.query({
            query: (vendorId) => ({
                url: `/Orders/by-vendor?vendorId=${vendorId}`,
            }),
        }),
        getMyOrdersId: builder.query({
            query: (id) => ({
                url: `/Orders/${id}`,
            }),
        }),
        getMyOrdersIdAccounter: builder.query({
            query: (orderId) => ({
                url: `/Orders/accountant/${orderId}`,
            }),
        }),
        deleteOrder: builder.mutation({
            query: (id) => ({
                url: `/Orders/${id}`,
                method: 'DELETE',
            }),
        }),
        deleteOrderAdmin: builder.mutation({
            query: (id) => ({
                url: `/Orders/admin/${id}`,
                method: 'DELETE',
            }),
        }),
        orderComplate: builder.mutation({
            query: (order) => ({
                url: '/Orders/fighter',
                method: 'POST',
                body: order,
            }),
        }),
        orderConfirm: builder.mutation({
            query: (orderId) => ({
                url: `/Orders/confirm-delivery/${orderId}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        getProductAddPending: builder.query({
            query: () => ({
                url: `/Products/pending/adds`,
            }),
        }),
        getProductAddMyPending: builder.query({
            query: () => ({
                url: `/Products/my-pending/adds`,
            }),
        }),
        getProductDeletePending: builder.query({
            query: () => ({
                url: `/Products/pending/deletes`,
            }),
        }),
        getProductDeleteMyPending: builder.query({
            query: () => ({
                url: `/Products/my-pending/deletes`,
            }),
        }),
        getProductUpdatePending: builder.query({
            query: () => ({
                url: `/Products/pending/updates`,
            }),
        }),
        getProductUpdateMyPending: builder.query({
            query: () => ({
                url: `/Products/my-pending/updates`,
            }),
        }),
        getCategorieAddPending: builder.query({
            query: () => ({
                url: `/Categories/pending/adds`,
            }),
        }),
        getCategorieAddMyPending: builder.query({
            query: () => ({
                url: `/Categories/my-pending/adds`,
            }),
        }),
        getCategorieDeletePending: builder.query({
            query: () => ({
                url: `/Categories/pending/deletes`,
            }),
        }),
        getCategorieDeleteMyPending: builder.query({
            query: () => ({
                url: `/Categories/my-pending/deletes`,
            }),
        }),
        getCategorieUpdatePending: builder.query({
            query: () => ({
                url: `/Categories/pending/updates`,
            }),
        }),
        getCategorieUpdateMyPending: builder.query({
            query: () => ({
                url: `/Categories/my-pending/updates`,
            }),
        }),
        createCategoriesConfirm: builder.mutation({
            query: (categoryId) => ({
                url: `/Categories/approve-create/${categoryId}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        createCategoriesReject: builder.mutation({
            query: (categoryId) => ({
                url: `/Categories/reject-create/${categoryId}`,
                method: 'DELETE',
            }),
        }),
        deleteCategoriesConfirm: builder.mutation({
            query: (categoryId) => ({
                url: `/Categories/approve-delete/${categoryId}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        deleteCategoriesReject: builder.mutation({
            query: (categoryId) => ({
                url: `/Categories/reject-delete/${categoryId}`,
                method: 'DELETE',
            }),
        }),
        editCategoriesConfirm: builder.mutation({
            query: (categoryId) => ({
                url: `/Categories/approve-update/${categoryId}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        editCategoriesReject: builder.mutation({
            query: (categoryId) => ({
                url: `/Categories/reject-update/${categoryId}`,
                method: 'DELETE',
            }),
        }),
        createProductsConfirm: builder.mutation({
            query: (categoryId) => ({
                url: `/Products/approve-create/${categoryId}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        createProductsReject: builder.mutation({
            query: (categoryId) => ({
                url: `/Products/reject-create/${categoryId}`,
                method: 'DELETE',
            }),
        }),
        deleteProductsConfirm: builder.mutation({
            query: (categoryId) => ({
                url: `/Products/approve-delete/${categoryId}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        deleteProductsReject: builder.mutation({
            query: (categoryId) => ({
                url: `/Products/reject-delete/${categoryId}`,
                method: 'DELETE',
            }),
        }),
        editProductsConfirm: builder.mutation({
            query: (categoryId) => ({
                url: `/Products/approve-update/${categoryId}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        editProductsReject: builder.mutation({
            query: (categoryId) => ({
                url: `/Products/reject-update/${categoryId}`,
                method: 'DELETE',
            }),
        }),
        changePasswordFighters: builder.mutation({
            query: (pass) => ({
                url: `/Fighters/change-password`,
                method: 'POST',
                body:pass,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        changePasswordCustomers: builder.mutation({
            query: (pass) => ({
                url: `/Customers/change-password`,
                method: 'POST',
                body:pass,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        editCalculation: builder.mutation({
            query: ({companyId,newAmount}) => ({
                url: `/Calculations/edit-initial?companyId=${companyId}&newAmount=${newAmount}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        getCalculation: builder.query({
            query: (companyId) => ({
                url: `/Calculations/get-current-and-previous?companyId=${companyId}`,
            }),
        }),
        getCalculationFilter: builder.query({
            query: ({companyId,year,month}) => ({
                url: `/Calculations/filter?companyId=${companyId}&year=${year}&month=${month}`,
            }),
        }),
        getAdminNotificationsSuperAdmin: builder.query({
            query: () => ({
                url: `/AdminNotifications/superAdmin`,
            }),
        }),
        getAdminNotificationsFighter: builder.query({
            query: () => ({
                url: `/AdminNotifications/fighter`,
            }),
        }),
        getAdminNotificationsCustomer: builder.query({
            query: () => ({
                url: `/AdminNotifications/customer`,
            }),
        }),
        getAdminNotificationsAccountant: builder.query({
            query: () => ({
                url: `/AdminNotifications/accountant`,
            }),
        }),
        getAdminNotificationsCustomerId: builder.query({
            query: (customerId) => ({
                url: `/AdminNotifications/customer/${customerId}`,
            }),
        }),
        markAsRead: builder.mutation({
            query: (id) => ({
                url: `/AdminNotifications/mark-as-read/${id}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        getOrderStatusPercantageStatik: builder.query({
            query: (companyId) => ({
                url: `/Statistics/order-status-percentages/${companyId}`,
            }),
        }),
        getTotalOrdersStatik: builder.query({
            query: (companyId) => ({
                url: `/Statistics/total-orders/${companyId}`,
            }),
        }),
        getMonthlyOrderStatusStatik: builder.query({
            query: ({year,companyId}) => ({
                url: `/Statistics/monthly-order-status/${year}/${companyId}`,
            }),
        }),
        getMonthlyOrderAmountStatik: builder.query({
            query: ({year,companyId}) => ({
                url: `/Statistics/monthly-order-amounts/${year}/${companyId}`,
            }),
        }),
        getMonthlyOrderStatik: builder.query({
            query: ({year,companyId}) => ({
                url: `/Statistics/monthly-orders/${year}/${companyId}`,
            }),
        }),
        getFighterOrderStatusStatik: builder.query({
            query: ({fighterId,companyId}) => ({
                url: `/Statistics/fighter-order-status/${fighterId}/${companyId}`,
            }),
        }),
        getFighterOrderCountStatik: builder.query({
            query: ({fighterId,companyId}) => ({
                url: `/Statistics/fighter-order-count/${fighterId}/${companyId}`,
            }),
        }),
        getFighterMonthlyCompletionStatik: builder.query({
            query: ({year,companyId}) => ({
                url: `/Statistics/fighter-monthly-completion/${year}/${companyId}`,
            }),
        }),
        getMonthlyProductQuantityStatik: builder.query({
            query: ({companyId,categoryId,productId,year,}) => ({
                url: `/Statistics/monthly-product-quantity/${companyId}/${categoryId}/${productId}/${year}`,
            }),
        }),
        getOrderByPage: builder.query({
            query: ({page,pageSize}) => ({
                url: `/Orders/paged?page=${page}&pageSize=${pageSize}`,
            }),
        }),
        getOrderCompanyByPage: builder.query({
            query: (companyId) => ({
                url: `/Orders/active-by-company?companyId=${companyId}`,
            }),
        }),
        getOrderCompanyInComplete: builder.query({
            query: (companyId) => ({
                url: `/Orders/incomplete-by-company?companyId=${companyId}`,
            }),
        }),
        getOrderByPageByCompany: builder.query({
            query: ({companyName,page,pageSize}) => ({
                url: `/Orders/paged?companyName=${companyName}&page=${page}&pageSize=${pageSize}`,
            }),
        }),
        getProductByPage: builder.query({
            query: ({page,pageSize}) => ({
                url: `/Products/paged?page=${page}&pageSize=${pageSize}`,
            }),
        }),
        getAllAccountants: builder.query({
            query: () => ({
                url: `/Accountants`,
            }),
        }),
        createAccountants: builder.mutation({
            query: (accountant) => ({
                url: '/Accountants',
                method: 'POST',
                body: accountant,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        deleteAccountant: builder.mutation({
            query: (id) => ({
                url: `/Accountants/${id}`,
                method: 'DELETE',
            }),
        }),
        editAccountant: builder.mutation({
            query: (accountant) => ({
                url: '/Accountants',
                method: 'PUT',
                body: accountant,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        getOrderByPageAccounter: builder.query({
            query: ({page,pageSize}) => ({
                url: `/Orders/accountant/paged?page=${page}&pageSize=${pageSize}`,
            }),
        }),
        getOrderByPageFighter: builder.query({
            query: ({fighterId,companyId}) => ({
                url: `/Orders/by-fighter-and-company?fighterId=${fighterId}&companyId=${companyId}`,
            }),
        }),
        getOrderByPageByCompanyAccounter: builder.query({
            query: ({companyName,page,pageSize}) => ({
                url: `/Orders/paged?companyName=${companyName}&page=${page}&pageSize=${pageSize}`,
            }),
        }),
        getOrderByPageByCompanyAccounterHistory: builder.query({
            query: ({companyId,page,pageSize}) => ({
                url: `/Orders/accountant/by-company/${companyId}/paged?page=${page}&pageSize=${pageSize}`,
            }),
        }),

        getOrderByPageByCompanyFighter: builder.query({
            query: ({fighterId,companyId,page,pageSize}) => ({
                url: `/Orders/paged-by-fighter-and-company?fighterId=${fighterId}&companyId=${companyId}&page=${page}&pageSize=${pageSize}`,
            }),
        }),
        getAdminNotificationFighter: builder.query({
            query: ({fighterId,companyId}) => ({
                url: `/AdminNotifications/${fighterId}/${companyId}`,
            }),
        }),
        getVendorDebts: builder.query({
            query: (companyId) => ({
                url: `/VendorDebts?companyId=${companyId}`,
            }),
        }),
        editVendorDebts: builder.mutation({
            query: (debts) => ({
                url: '/VendorDebts',
                method: 'PUT',
                body: debts,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        setLastDeliveryDate: builder.mutation({
            query: ({orderId,date}) => ({
                url: `/Orders/${orderId}/set-last-delivery-date?date=${date}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
    }),
});

// Hookları dışarı açıyoruz:
export const {
    useLoginSuperAdminMutation,
    useLoginUserMutation,
    useGetUserQuery,
    useGetUserFightersQuery,
    useGetProtectedDataQuery,
    useGetUserCompaniesQuery,
    useGetUserCompaniesDepartmentQuery,
    useGetUserCompaniesDepartmentBolmeQuery,

    useGetAllCompaniesQuery,
    useCreateCompanyMutation,
    useGetCompanyIdQuery,
    useEditCompanyMutation,
    useDeleteCompanyMutation,
    useGetAllJobsQuery,
    useCreateJobsMutation,

    useGetSobeBYCompanyIdQuery,
    useCreateDepartmentMutation,
    useGetDepartmentIdQuery,
    useGetSobeBYDepartmentIdQuery,
    useCreateSectionsMutation,
    useEditDepartmentMutation,
    useEditSectionMutation,
    useDeleteDepartmentMutation,
    useDeleteSectionMutation,
    useEditJobMutation,
    useDeleteJobMutation,
    useGetJobsIdQuery,
    useGetSectionsIdQuery,

    useGetAllVendorsQuery,
    useCreateVendorsMutation,
    useGetAllVendorsIdQuery,
    useEditVendorMutation,
    useDeleteVendorMutation,

    useGetAllCustomersQuery,
    useCreateCustomersMutation,
    useDeleteCustomerMutation,
    useEditCustomerMutation,
    useGetByIdCustomersQuery,
    useDeleteCustomerBolmeMutation,
    useAddBolmeCustomersMutation,

    useGetAllCategoriesQuery,
    useCreateCategoriesMutation,
    useUpdateCategoriesMutation,
    useDeleteCategoriesMutation,


    useGetAllProductsQuery,
    useCreateProductsMutation,
    useUpdateProductsMutation,
    useDeleteProductsMutation,
    useGetAllSectionsQuery,

    useGetAllFightersQuery,
    useCreateFightersMutation,
    useDeleteFighterMutation,
    useEditFighterMutation,
    useGetByIdFightersQuery,
    useDeleteFighterBolmeMutation,
    useAddBolmeFightersMutation,
    useGetByIdFightersCompaniesQuery,

    useCreateOrdersMutation,
    useGetMyOrdersQuery,
    useGetMyOrdersIdQuery,
    useDeleteOrderMutation,
    useDeleteOrderAdminMutation,
    useGetOrdersQuery,
    useGetOrdersVendorQuery,
    useOrderComplateMutation,
    useOrderConfirmMutation,

    useGetProductAddPendingQuery,
    useGetProductAddMyPendingQuery,
    useGetProductDeletePendingQuery,
    useGetProductDeleteMyPendingQuery,
    useGetProductUpdatePendingQuery,
    useGetProductUpdateMyPendingQuery,
    useCreateProductsConfirmMutation,
    useCreateProductsRejectMutation,
    useDeleteProductsConfirmMutation,
    useDeleteProductsRejectMutation,
    useEditProductsConfirmMutation,
    useEditProductsRejectMutation,

    useGetCategorieAddPendingQuery,
    useGetCategorieAddMyPendingQuery,
    useGetCategorieDeletePendingQuery,
    useGetCategorieDeleteMyPendingQuery,
    useGetCategorieUpdatePendingQuery,
    useGetCategorieUpdateMyPendingQuery,
    useCreateCategoriesConfirmMutation,
    useCreateCategoriesRejectMutation,
    useDeleteCategoriesConfirmMutation,
    useDeleteCategoriesRejectMutation,
    useEditCategoriesConfirmMutation,
    useEditCategoriesRejectMutation,


    useChangePasswordFightersMutation,
    useChangePasswordCustomersMutation,

    useGetCalculationQuery,
    useGetCalculationFilterQuery,
    useEditCalculationMutation,


    useGetAdminNotificationsSuperAdminQuery,
    useGetAdminNotificationsFighterQuery,
    useGetAdminNotificationsCustomerQuery,
    useGetAdminNotificationsCustomerIdQuery,
    useMarkAsReadMutation,

    useResetPasswordMutation,
    useForgotPasswordMutation,

    useGetOrderStatusPercantageStatikQuery,
    useGetTotalOrdersStatikQuery,
    useGetMonthlyOrderStatusStatikQuery,
    useGetMonthlyOrderAmountStatikQuery,
    useGetMonthlyOrderStatikQuery,
    useGetFighterOrderStatusStatikQuery,
    useGetFighterOrderCountStatikQuery,
    useGetFighterMonthlyCompletionStatikQuery,
    useGetMonthlyProductQuantityStatikQuery,

    useGetOrderByPageQuery,
    useGetOrderByPageByCompanyQuery,
    useGetProductByPageQuery,

    useGetAllAccountantsQuery,
    useCreateAccountantsMutation,
    useDeleteAccountantMutation,
    useEditAccountantMutation,
    useGetOrderByPageAccounterQuery,
    useGetOrderByPageByCompanyAccounterQuery,

    useGetUserAccountantsQuery,
    useGetOrderCompanyByPageQuery,
    useGetOrderCompanyInCompleteQuery,
    useGetOrderByPageFighterQuery,
    useGetOrderByPageByCompanyFighterQuery,
    useGetAdminNotificationFighterQuery,

    useGetMyOrdersIdAccounterQuery,

    useGetVendorDebtsQuery,
    useGetOrderByPageByCompanyAccounterHistoryQuery,
    useSetLastDeliveryDateMutation,
    useEditVendorDebtsMutation,
    useGetAdminNotificationsAccountantQuery,
} = api;