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
                case "supplier":
                    token = Cookies.get("supplierToken");
                    break;
                case "orderer":
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
                url: '/User/login',
                method: 'POST',
                body: credentials,
                headers: { 'Content-Type': 'application/json' },
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
        deleteCustomer: builder.mutation({
            query: (id) => ({
                url: `/Customers/${id}`,
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
    }),
});

// Hookları dışarı açıyoruz:
export const {
    useLoginSuperAdminMutation,
    useLoginUserMutation,
    useGetProtectedDataQuery,

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
    useEditVendorMutation,
    useDeleteVendorMutation,

    useGetAllCustomersQuery,
    useCreateCustomersMutation,
    useDeleteCustomerMutation,
    useEditCustomerMutation,
    useGetByIdCustomersQuery,

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
} = api;
