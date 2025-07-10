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
                url: `/Fighters/getUser`,
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
        createFighters: builder.mutation({
            query: (fighter) => ({
                url: '/Fighters/register',
                method: 'POST',
                body: fighter,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        deleteFighter: builder.mutation({
            query: (email) => ({
                url: `/Fighters/${email}`,
                method: 'DELETE',
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
        deleteOrder: builder.mutation({
            query: (id) => ({
                url: `/Orders/${id}`,
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

    useCreateOrdersMutation,
    useGetMyOrdersQuery,
    useGetMyOrdersIdQuery,
    useDeleteOrderMutation,
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

} = api;
