import './index.scss'
import image from "/src/assets/Frame 1703876910.png"
import {useNavigate} from "react-router-dom";
function ResetPassword(){
    const navigate = useNavigate();
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
                    <input placeholder={"Mobil nömrənizi daxil edin"}/>
                    <label>Yenidən daxil edin</label>
                    <br/>
                    <input placeholder={"Mobil nömrənizi daxil edin"}/>
                </div>
                <button onClick={()=>navigate('/success')}>Təsdiqlə</button>
            </div>
        </div>
    );
}

export default ResetPassword;