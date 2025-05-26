import {createBrowserRouter} from "react-router-dom";


const router = createBrowserRouter([
    {
        path: '/',
        // element: <MainPage/>,
        children: []
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
        path: "/login",
        // element: <AdminLogin/>
    },
    {
        path: "*",
        // element: <NotFound/>
    }
]);

export default router;
