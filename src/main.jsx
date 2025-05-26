import {createRoot} from 'react-dom/client'
import './index.scss'
import App from './App.jsx'
import {Provider} from "react-redux";
import {store} from "./services/store.jsx";
import {PopupProvider} from "./components/Popup/PopupContext.jsx";


createRoot(document.getElementById('root')).render(
    <PopupProvider>
        <Provider store={store}>
            <App/>
        </Provider>
    </PopupProvider>
)
