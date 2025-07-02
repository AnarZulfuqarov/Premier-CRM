import { useState } from 'react';
import './index.scss';
import { NavLink } from "react-router-dom";
import {useCreateJobsMutation} from "../../../services/adminApi.jsx";

const SuperAdminVezifeAdd = () => {
    const [rows, setRows] = useState([{ name: '' }]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createPosition, { isLoading }] = useCreateJobsMutation();

    const handleChange = (index, value) => {
        const updatedRows = [...rows];
        updatedRows[index].name = value;
        setRows(updatedRows);
    };

    const addRow = () => {
        setRows([...rows, { name: '' }]);
    };

    const handleSubmit = async () => {
        try {
            for (const row of rows) {
                if (row.name.trim() !== '') {
                    const response = await createPosition({ name: row.name });
                    if (!('data' in response)) {
                        throw new Error('Bir və ya bir neçə vəzifə əlavə edilə bilmədi.');
                    }
                }
            }
            setShowSuccessModal(true);
        } catch (error) {
            console.error(error);
            alert('Bir xəta baş verdi!');
        }
    };

    return (
        <div className="super-admin-vezife-add-main">
            <div className="super-admin-vezife-add">
                <div className="headerr">
                    <div className="head">
                        <h1>Vəzifə əlavə edilməsi</h1>
                    </div>
                    <h2>
                        <NavLink className="link" to="/admin/history">— Vəzifə</NavLink> — Vəzifə əlavə edilməsi
                    </h2>
                </div>

                <table className="product-table">
                    <thead>
                    <tr>
                        <th>Vəzifə adı</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Vəzifə adı daxil et"
                                    value={row.name}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>
                            <button className="add-row-btn" onClick={addRow}>
                                Yeni vəzifə əlavə et
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <button className="confirm-btn" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? 'Göndərilir...' : 'Təsdiqlə'}
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
                                        ✓
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3>Vəzifə uğurla əlavə edildi !</h3>
                        <button className="back-btn" onClick={() => window.location.href = "/supplier"}>
                            Əsas səhifəyə qayıt
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminVezifeAdd;