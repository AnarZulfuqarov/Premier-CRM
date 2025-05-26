import { useState } from 'react';
import Cookies from 'js-cookie';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import SomeComponent from "../../components/Same.jsx";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // Basic handleSubmit for testing; replace with actual API call
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // Simulate login logic
    //     try {
    //         // Replace with actual postAdminLogin call when ready
    //         console.log('Login attempted with:', { username, password });
    //         Cookies.set('premierCRMToken', 'sample-token', { expires: 1 });
    //         setTimeout(() => navigate('/'), 1000);
    //     } catch {
    //         alert('Giriş zamanı xəta baş verdi');
    //     }
    // };

    return (
        <div id="login">
            <SomeComponent/>

            <div className="login-panel">
                <div>
                    <div className="header">
                        {/*<div className="login-logo">*/}
                        {/*    <img src="/path/to/logo.png" alt="Logo" /> /!* Update with actual logo path *!/*/}
                        {/*</div>*/}
                        <h2>Logo and name</h2>
                    </div>
                    <div className="login-form">
                        <div className="title">
                            <h1>Sistemə daxil olun</h1>
                            <p>
                                Sistemdəki funksiyalara və məlumatlara çıxış əldə etmək üçün aşağıdakı formanı istifadə edərək hesabınıza daxil olun.
                            </p>
                        </div>

                        <form className="form" onSubmit={"handleSubmit"}>
                            <div className="form-group">
                                <label>İstifadəçi adı</label>
                                <input
                                    type="text"
                                    placeholder="İstifadəçi adınızı daxil edin"
                                    value={username} // Fixed from value={use}
                                    onChange={(e) => setUsername(e.target.value)}
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

                            <button type="submit" className="submit">
                                Giriş et
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
                    <p>Sistemə giriş yalnız icazəli şəxslər üçün mümkündür.</p>
                </div>
            </div>
        </div>
    );
}

export default Login;