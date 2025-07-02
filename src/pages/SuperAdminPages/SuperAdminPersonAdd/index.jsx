import {useState} from 'react';
import './index.scss';
import {NavLink} from "react-router-dom";
import CustomDropdown from "../../../components/Supplier/CustomDropdown/index.jsx";

const categories = ['Meyvə', 'Tərəvəz', 'Ət'];
const units = ['Kg', 'Litr', 'Ədəd'];

const SuperPersonAdd = () => {
    const positions = ['Müdür', 'Mühasib', 'Operator'];
    const departments = ['Satış', 'Marketinq', 'Anbar'];

    const [rows, setRows] = useState([{ name: '', surname: '', position: '', department: '', password: '', phone: '' }]);

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    const addRow = () => {
        setRows([...rows, {
            name: '',
            surname: '',
            position: '',
            department: '',
            password: '',
            phone: ''
        }]);
    };

    return (
        <div className="super-admin-person-add-main">
            <div className="super-admin-person-add">
                <div className="headerr">
                    <div className="head">
                        <h1>İstifadəçi əlavə edilməsi</h1>
                    </div>
                    <h2>
                        <NavLink className="link" to="/admin/history">— İstifadəçi</NavLink> — İstifadəçi əlavə edilməsi
                    </h2>
                </div>

                <table className="product-table">
                    <thead>
                    <tr>
                        <th>Ad</th>
                        <th>Soyad</th>
                        <th>Vəzifə</th>
                        <th>Bölmə</th>
                        <th>Şifrə</th>
                        <th>Nömrə</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Ad daxil et"
                                    value={row.name}
                                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Soyad daxil et"
                                    value={row.surname}
                                    onChange={(e) => handleChange(index, 'surname', e.target.value)}
                                />
                            </td>
                            <td>
                                <CustomDropdown
                                    options={positions}
                                    selected={row.position}
                                    onSelect={(value) => handleChange(index, 'position', value)}
                                    placeholder="Vəzifə seç"
                                />
                            </td>
                            <td>
                                <CustomDropdown
                                    options={departments}
                                    selected={row.department}
                                    onSelect={(value) => handleChange(index, 'department', value)}
                                    placeholder="Bölmə seç"
                                />
                            </td>
                            <td>
                                <input
                                    type="password"
                                    placeholder="Şifrə daxil et"
                                    value={row.password}
                                    onChange={(e) => handleChange(index, 'password', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Nömrə daxil et"
                                    value={row.phone}
                                    onChange={(e) => handleChange(index, 'phone', e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="6">
                            <button className="add-row-btn" onClick={addRow}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                    <path d="M12.5 23C6.71 23 2 18.29 2 12.5C2 6.71 6.71 2 12.5 2C18.29 2 23 6.71 23 12.5C23 18.29 18.29 23 12.5 23ZM12.5 3.5C7.535 3.5 3.5 7.535 3.5 12.5C3.5 17.465 7.535 21.5 12.5 21.5C17.465 21.5 21.5 17.465 21.5 12.5C21.5 7.535 17.465 3.5 12.5 3.5Z" fill="#6C6C6C"/>
                                    <path d="M12.5 17.75C12.08 17.75 11.75 17.42 11.75 17V8C11.75 7.58 12.08 7.25 12.5 7.25C12.92 7.25 13.25 7.58 13.25 8V17C13.25 17.42 12.92 17.75 12.5 17.75Z" fill="#6C6C6C"/>
                                    <path d="M17 13.25H8C7.58 13.25 7.25 12.92 7.25 12.5C7.25 12.08 7.58 11.75 8 11.75H17C17.42 11.75 17.75 12.08 17.75 12.5C17.75 12.92 17.42 13.25 17 13.25Z" fill="#6C6C6C"/>
                                </svg> Yeni istifadəçi əlavə et
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>


                <button className="confirm-btn" onClick={() => setShowSuccessModal(true)}>Təsdiqlə</button>
            </div>
            <div className="xett"></div>
            {showSuccessModal && (
                <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
                    <div className="success-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="close-btn" onClick={() => setShowSuccessModal(false)}>✕</div>
                        <div className="check-icon">
                            <div className={"circleOne"}>
                                <div className="circle pulse">
                                    <div className="circle-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">
                                            <path d="M12.2714 19.3539L22.6402 8.9852C22.8849 8.74051 23.1704 8.61816 23.4966 8.61816C23.8229 8.61816 24.1083 8.74051 24.353 8.9852C24.5977 9.22989 24.7201 9.52066 24.7201 9.85752C24.7201 10.1944 24.5977 10.4847 24.353 10.7286L13.1279 21.9844C12.8832 22.2291 12.5977 22.3514 12.2714 22.3514C11.9452 22.3514 11.6597 22.2291 11.415 21.9844L6.15419 16.7235C5.9095 16.4788 5.79205 16.1885 5.80183 15.8524C5.81162 15.5164 5.93927 15.2256 6.18477 14.9801C6.43028 14.7346 6.72105 14.6123 7.0571 14.6131C7.39314 14.6139 7.6835 14.7362 7.92819 14.9801L12.2714 19.3539Z" fill="white"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3>İstifadəçi uğurla əlavə edildi !</h3>
                        <button className="back-btn" onClick={() => window.location.href = "/supplier"}>
                            Əsas səhifəyə qayıt
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SuperPersonAdd;
