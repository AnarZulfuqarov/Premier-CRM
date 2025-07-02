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
        createCompany: builder.mutation({
            query: (company) => ({
                url: '/Companies',
                method: 'POST',
                body: company,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        getAllJobs: builder.query({
            query: () => ({
                url: `/Jobs`,
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
    }),
});

// Hookları dışarı açıyoruz:
export const {
    useLoginSuperAdminMutation,
    useLoginUserMutation,
    useGetProtectedDataQuery,

    useGetAllCompaniesQuery,
    useCreateCompanyMutation,

    useGetAllJobsQuery,
    useCreateJobsMutation,
} = api;
