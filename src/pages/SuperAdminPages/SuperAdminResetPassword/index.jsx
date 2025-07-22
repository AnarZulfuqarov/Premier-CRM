import './index.scss'
import image from "/src/assets/Frame 1703876910.png"
import {useNavigate, useSearchParams} from "react-router-dom";
import {useResetPasswordMutation} from "../../../services/adminApi.jsx";
import {useState} from "react";
import {usePopup} from "../../../components/Popup/PopupContext.jsx";
function ResetPassword(){
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    console.log(searchParams);
    const phoneNumber = searchParams.get("phonenumber");
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [resetPass, { isLoading }] = useResetPasswordMutation();
    const showPopup = usePopup();

    const handleSubmit = async () => {
        try {
            await resetPass({ phoneNumber, token, newPassword }).unwrap();
            showPopup("Uğurlu", "Şifrəniz yeniləndi", "success");
            navigate('/success');
        } catch  {
            showPopup("Xəta", "Şifrə yenilənmədi", "error");
        }
    };

    const isDisabled =
        !newPassword ||
        !confirmPassword ||
        newPassword !== confirmPassword ||
        isLoading;

    return (
        <div id={"resetPassword"}>
            <div className={'resetPassword'}>
                <div className={'image'}>
                    <img src={image} alt=""/>
                </div>
                <div className={'content'}>
                    <h3>Şifrənizi yeniləyin</h3>
                </div>
                <div className={'form'}>
                    <label>Yeni şifrə</label>
                    <br/>
                    <input
                        type="password"
                        placeholder="Yeni şifrəni daxil edin"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <label>Yenidən daxil edin</label>
                    <br/>
                    <input
                        type="password"
                        placeholder="Yeni şifrəni təkrar daxil edin"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button onClick={handleSubmit} disabled={isDisabled}>
                    {isLoading ? "Göndərilir..." : "Təsdiqlə"}
                </button>
            </div>
        </div>
    );
}

export default ResetPassword;