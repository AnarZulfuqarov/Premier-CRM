import './index.scss'
import image from "/src/assets/Group 1000005969.png"
import {useNavigate} from "react-router-dom";
function SuccessResetPass(){
    const navigate = useNavigate();
    return (
        <div id={"successResetPass"}>
            <div className={'successResetPass'}>
                <div className={'image'}>
                    <img src={image} alt=""/>
                </div>
                <div className={'content'}>
                    <h3>Şifrə uğurla yeniləndi!</h3>
                    <p>İndi yeni şifrənizlə hesabınıza daxil ola bilərsiniz.</p>
                </div>

                <button onClick={()=>navigate("/adminLogin")}>Hesabına daxil ol</button>
            </div>
        </div>
    );
}

export default SuccessResetPass;