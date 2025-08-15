import {useState} from 'react';
import './index.scss';
import {NavLink} from "react-router-dom";
import {useCreateCategoriesMutation} from "../../../services/adminApi.jsx";



const SupplierCategoryAdd = () => {
    const [rows, setRows] = useState([{name: '', category: '', unit: ''}]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [post] = useCreateCategoriesMutation()
    const handleChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    const addRow = () => {
        setRows([...rows, {name: '', category: '', unit: ''}]);
    };
    const handleSubmit = async () => {
        try {
            const promises = rows.map(row => post({ name: row.name }));
            await Promise.all(promises); // hamısı tamamlandıqda davam et
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Post xətası:", error);
            // Burada error modalı da göstərə bilərsən
        }
    };
    return (
        <div className="supplier-category-add-main">
            <div className="supplier-category-add">
                <div className="headerr">
                    <div className="head">
                        <h1>Kateqoriya əlavə edilməsi</h1>
                    </div>
                    <h2>
                        <NavLink className="link" to="/supplier/products/categories">— Kateqoriyalar</NavLink> — Kateqoriya əlavə edilməsi
                    </h2>
                </div>

                <table className="product-table">
                    <thead>
                    <tr>
                        <th>Kateqoriya adı</th>

                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Kateqoriya adı daxil et"
                                    value={row.name}
                                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                                    required
                                />
                            </td>

                        </tr>
                    ))}
                    <tr>
                        <td colSpan="3">
                            <button className="add-row-btn" onClick={addRow}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"
                                     fill="none">
                                    <path
                                        d="M12 23C6.21 23 1.5 18.29 1.5 12.5C1.5 6.71 6.21 2 12 2C17.79 2 22.5 6.71 22.5 12.5C22.5 18.29 17.79 23 12 23ZM12 3.5C7.035 3.5 3 7.535 3 12.5C3 17.465 7.035 21.5 12 21.5C16.965 21.5 21 17.465 21 12.5C21 7.535 16.965 3.5 12 3.5Z"
                                        fill="#6C6C6C"/>
                                    <path
                                        d="M12 17.75C11.58 17.75 11.25 17.42 11.25 17V8C11.25 7.58 11.58 7.25 12 7.25C12.42 7.25 12.75 7.58 12.75 8V17C12.75 17.42 12.42 17.75 12 17.75Z"
                                        fill="#6C6C6C"/>
                                    <path
                                        d="M16.5 13.25H7.5C7.08 13.25 6.75 12.92 6.75 12.5C6.75 12.08 7.08 11.75 7.5 11.75H16.5C16.92 11.75 17.25 12.08 17.25 12.5C17.25 12.92 16.92 13.25 16.5 13.25Z"
                                        fill="#6C6C6C"/>
                                </svg>
                                Yeni kateqoriya əlavə et
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <button className="confirm-btn" onClick={handleSubmit}>Təsdiqlə</button>
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
                        <h3>Əlavə etmə istəyiniz uğurla qeydə alındı!</h3>
                        <p>Admin təsdiq etdikdən sonra yeni məhsul yaradılacaq</p>
                        <button className="back-btn" onClick={() => window.location.href = "/supplier/products/categories"}>
                            Əsas səhifəyə qayıt
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SupplierCategoryAdd;
