import {useState} from 'react';
import './index.scss';
import {NavLink} from "react-router-dom";
import {useCreateFightersMutation, useGetAllCompaniesQuery} from "../../../services/adminApi.jsx";
import {usePopup} from "../../../components/Popup/PopupContext.jsx";
import CustomDropdown from "../../../components/Supplier/CustomDropdown/index.jsx";



const SuperSupplierAdd = () => {
    const [postSupplier] = useCreateFightersMutation()
    const showPopup = usePopup();
    const {data:getAllCompanies} = useGetAllCompaniesQuery()
    const companies = getAllCompanies?.data
    const [rows, setRows] = useState([
        { name: '', surname: '', finCode: '', password: '', phoneNumber: '', companyId: '' }  // Add companyId to row state
    ]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };


    const isFormValid = () => {
        return rows.every(row =>
            row.name.trim() &&
            row.surname.trim() &&
            row.finCode.trim() &&
            row.password.trim() &&
            row.phoneNumber.trim() &&
            row.companyId.trim()  // Check if companyId is selected
        );
    };


    return (
        <div className="super-admin-supplier-add-main">
            <div className="super-admin-supplier-add">
                <div className="headerr">
                    <div className="head">
                        <h1>Təchizatçı əlavə edilməsi</h1>
                    </div>
                    <h2>
                        <NavLink className="link" to="/superAdmin/supplier">— Təchizatçı</NavLink> — Təchizatçı əlavə edilməsi
                    </h2>
                </div>

                <table className="product-table">
                    <thead>
                    <tr>
                        <th>Ad</th>
                        <th>Soyad</th>
                        <th>Şirkət</th>
                        <th>FIN</th>
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
                                    required
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Soyad daxil et"
                                    value={row.surname}
                                    onChange={(e) => handleChange(index, 'surname', e.target.value)}
                                    required
                                />
                            </td>
                            <td>
                                <select
                                    value={row.companyId}
                                    onChange={(e) => handleChange(index, 'companyId', e.target.value)}
                                    required
                                >
                                    <option value="">Şirkət seçin</option>
                                    {companies?.map(company => (
                                        <option key={company.id} value={company.id}>{company.name}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="FIN daxil et"
                                    value={row.finCode}
                                    onChange={(e) => handleChange(index, 'finCode', e.target.value)}
                                    required
                                />
                            </td>
                            <td>
                                <input
                                    type="password"
                                    placeholder="Şifrə daxil et"
                                    value={row.password}
                                    onChange={(e) => handleChange(index, 'password', e.target.value)}
                                    required
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    placeholder="Nömrə daxil et"
                                    value={row.phoneNumber}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value)) {
                                            handleChange(index, 'phoneNumber', value);
                                        }
                                    }}
                                    required
                                />

                            </td>
                        </tr>

                    ))}

                    </tbody>
                </table>


                <button
                    className={`confirm-btn ${!isFormValid() ? 'disabled' : ''}`}
                    onClick={async () => {
                        try {
                            for (const row of rows) {
                                const response = await postSupplier({
                                    name: row.name,
                                    surname: row.surname,
                                    password: row.password,
                                    finCode: row.finCode,
                                    phoneNumber: row.phoneNumber,
                                    companyIds: [row.companyId]
                                }).unwrap();


                            }

                            setShowSuccessModal(true);
                            setRows([{ name: '', surname: '', finCode: '', password: '', phoneNumber: '' }]);
                        } catch (err) {
                            console.error('POST error:', err);
                            showPopup(
                                "Xəta baş verdi",
                                "Təchizatçı əlavə edilərkən sistemdə nasazlıq oldu. Zəhmət olmasa yenidən cəhd edin.",
                                "error"
                            );
                        }
                    }}


                    disabled={!isFormValid()}
                >
                    Təsdiqlə
                </button>

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
                        <h3>Təchizatçı uğurla əlavə edildi !</h3>
                        <button className="back-btn" onClick={() => window.location.href = "/superAdmin/supplier"}>
                            Əsas səhifəyə qayıt
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SuperSupplierAdd;
