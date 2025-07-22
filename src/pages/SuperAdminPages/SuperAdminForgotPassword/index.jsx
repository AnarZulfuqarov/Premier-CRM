import './index.scss'
import image from "/src/assets/Frame 1703876910.png"
import {useNavigate} from "react-router-dom";
import {useForgotPasswordMutation} from "../../../services/adminApi.jsx";
import {useState} from "react";
import {usePopup} from "../../../components/Popup/PopupContext.jsx";
function ForgotPassword(){
    const navigate = useNavigate();
    const [forgotPass, { isLoading }] = useForgotPasswordMutation();
    const [phoneNumber, setPhoneNumber] = useState("");
    const showPopup = usePopup()
    const handleSubmit = async () => {
        try {
            await forgotPass({ phoneNumber }).unwrap();
            showPopup("Sorğunuz qəbul olundu","Link Whatsapp üzərindən göndərildi","success");
            navigate("/adminLogin");
        } catch {
            showPopup("Xəta baş verdi", "İstifadəçi əlavə olunmadı", "error")
        }
    };
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
                    <input
                        placeholder="Mobil nömrənizi daxil edin"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Göndərilir..." : "Giriş linkini göndər"}
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;