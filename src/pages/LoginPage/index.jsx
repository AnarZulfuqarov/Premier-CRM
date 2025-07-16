import { useState } from 'react';
import Cookies from 'js-cookie';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useLoginUserMutation} from "../../services/adminApi.jsx";
import {usePopup} from "../../components/Popup/PopupContext.jsx";
import logo from "/src/assets/Mask group.png"
function Login() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const showPopup = usePopup();

    const [loginUser, { isLoading, error }] = useLoginUserMutation();


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser({ phoneNumber, password });

            if ('data' in response) {
                const { token, role } = response.data.data;

                Cookies.set('role', role);
                showPopup('Giriş uğurludur', 'Sistemə daxil oldunuz', 'success');
                if (role === 'Fighter') {
                    Cookies.set('supplierToken', token);
                    navigate('/supplier/activeOrder');
                } else if (role === 'Customer') {
                    Cookies.set('ordererToken', token);
                    navigate('/choose-company');
                } else {
                    showPopup('Naməlum rol', 'Təyin olunmamış rol: ' + role, 'warning');
                }
            } else {
                showPopup('Giriş uğursuz oldu', 'Məlumatları yoxlayın.', 'error');
            }
        } catch (err) {
            console.error(err);
            showPopup('Xəta baş verdi', 'Sistem daxil olarkən problem oldu.', 'error');
        }
    };


    return (
        <div id="login">
            <div className="login-panel">
                <div>
                    <div className="header">
                        <img src={logo} className="logo" alt="logo" />
                    </div>
                    <div className="login-form">
                        <div className="title">
                            <h1>Sistemə daxil olun</h1>
                            <p>
                                Sistemdəki funksiyalara və məlumatlara çıxış əldə etmək üçün aşağıdakı formanı istifadə edərək hesabınıza daxil olun.
                            </p>
                        </div>

                        <form className="form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Telefon nömrəsi</label>
                                <input
                                    type="text"
                                    placeholder="Telefon nömrənizi daxil edin"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group password-group">
                                <label>Şifrə</label>
                                <div className="password-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Şifrənizi daxil edin"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? 'Şifrəni gizlə' : 'Şifrəni göstər'}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="submit" disabled={isLoading}>
                                {isLoading ? 'Yoxlanılır...' : 'Giriş et'}
                            </button>


                            <div className="problem">
                                Problemlə üzləşdiniz?
                                <a href="mailto:admin@example.com"> Sistem administratoru ilə əlaqə saxlayın</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="copyRight">
                    <p>Copyright@2025</p>
                </div>
                <div className="terms">
                    <p>Sistemə giriş yalnız icazəl şəxslər üçün mümkündür.</p>
                </div>
            </div>
        </div>
    );
}

export default Login;