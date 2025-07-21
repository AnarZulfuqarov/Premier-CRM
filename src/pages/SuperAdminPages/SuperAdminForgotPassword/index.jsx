import './index.scss'
import image from "/src/assets/Frame 1703876910.png"
import {useNavigate} from "react-router-dom";
function ForgotPassword(){
    const navigate = useNavigate();
    return (
        <div id={"forgotPassword"}>
            <div className={'forgotPassword'}>
                <div className={'image'}>
                    <img src={image} alt=""/>
                </div>
                <div className={'content'}>
                    <h3>Şifrəni unutmusunuz?</h3>
                    <p>Telefon nömrənizi daxil edin. Şifrəni sıfırlamaq üçün təsdiq linki sizə WhatsApp vasitəsilə göndəriləcək.</p>
                </div>
                <div className={'form'}>
                    <label>Mobil nömrə</label>
                    <br/>
                    <input placeholder={"Mobil nömrənizi daxil edin"}/>
                </div>
                <button onClick={()=>navigate("/resetPassword")}>Giriş linkini göndər</button>
            </div>
        </div>
    );
}

export default ForgotPassword;