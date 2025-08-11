import { useState } from 'react';
import Cookies from 'js-cookie';
import './index.scss';
import {Link, useNavigate} from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import {useLoginSuperAdminMutation} from "../../services/adminApi.jsx";
import {usePopup} from "../../components/Popup/PopupContext.jsx";

function AdminLogin() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const showPopup = usePopup();
    const [loginSuperAdmin, { isLoading, error }] = useLoginSuperAdminMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔴 1. Eski cookie'leri temizle
        Cookies.remove('role');
        Cookies.remove('superAdminToken');
        Cookies.remove('supplierToken');
        Cookies.remove('ordererToken');
        Cookies.remove('accountToken');

        try {
            const response = await loginSuperAdmin({ phoneNumber, password });

            if ('data' in response) {
                const { token, role } = response.data.data;

                // ✅ 2. Yeni verileri set et
                Cookies.set('superAdminToken', token);
                Cookies.set('role', role);

                showPopup('Giriş uğurludur', 'Sistemə daxil oldunuz', 'success');
                navigate('/superAdmin/people');
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
                        <h2>Logo and name</h2>
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
                                Şifrəni unutmusunuz?
                                <Link to='/forgotPassword' > Bərpa etmək üçün buraya klikləyin.</Link>
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
                    <p>Sistemə giriş yalnız icazəli şəxslər üçün mümkündür.</p>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;