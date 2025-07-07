import { useState } from 'react';
import Cookies from 'js-cookie';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import {useLoginSuperAdminMutation} from "../../services/adminApi.jsx";

function AdminLogin() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [loginSuperAdmin, { isLoading, error }] = useLoginSuperAdminMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await loginSuperAdmin({ phoneNumber, password });

            if ('data' in response ) {
                Cookies.set('superAdminToken', response.data.data.token);
                Cookies.set('role', response.data.data.role);
                navigate('/superAdmin/people');
            } else {
                alert('Giriş uğursuz oldu, məlumatları yoxlayın!');
            }
        } catch (err) {
            console.error(err);
            alert('Bir xəta baş verdi!');
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

                            {error && <div className="error">Xəta: Məlumatlar səhvdir!</div>}

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
                    <p>Sistemə giriş yalnız icazəli şəxslər üçün mümkündür.</p>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;