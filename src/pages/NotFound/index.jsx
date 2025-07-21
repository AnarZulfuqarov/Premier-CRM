import './index.scss'
import image from "/src/assets/NoNavigation.png"
import {useNavigate} from "react-router-dom";
function NotFound() {
    const navigate = useNavigate();
    return (
        <div id={"notFound"}>
            <div className={"notFound"}>
                <div className={"image"}>
                    <img src={image} />
                </div>
                <button onClick={()=>navigate('/')}>Əsas səhifəyə qayıt</button>
            </div>
        </div>
    );
}

export default NotFound;