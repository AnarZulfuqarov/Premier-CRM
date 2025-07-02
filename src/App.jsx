import {RouterProvider} from 'react-router-dom'
import './App.css'
import Cookies from "js-cookie";
import router from './routes/ROUTES'

const App = () => {
    const token = Cookies.get("superAdminToken");
    if (!token) {
        Cookies.set("superAdminToken", "null");
    }

    return (
        <div>
            <RouterProvider router={router}/>
        </div>
    )
}

export default App;