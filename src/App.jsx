import {RouterProvider} from 'react-router-dom'
import './App.css'
import Cookies from "js-cookie";
import router from './routes/ROUTES'
import {ToastContainer} from "react-toastify";

const App = () => {
    const token = Cookies.get("premierCRMToken");

    if (!token) {
        Cookies.set("premierCRMToken", "null");
    }

    return (
        <div>
            <ToastContainer/>
            <RouterProvider router={router}/>
        </div>
    )
}

export default App