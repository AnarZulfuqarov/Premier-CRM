import {useState} from 'react';
import './index.scss';
import {NavLink, useParams} from "react-router-dom";
import {useCreateSectionsMutation, useGetDepartmentIdQuery} from "../../../services/adminApi.jsx";
import {usePopup} from "../../../components/Popup/PopupContext.jsx";


const SuperAdminBolmeAdd = () => {
    const {id} = useParams();
    const [rows, setRows] = useState([{name: '', category: '', unit: ''}]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [post] = useCreateSectionsMutation()
    const {data: getDepartmentId} =useGetDepartmentIdQuery(id)
    const department = getDepartmentId?.data
    const handleChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };
    const showPopup = usePopup()
    const addRow = () => {
        setRows([...rows, {name: '', category: '', unit: ''}]);
    };
    const handleSubmit = async () => {
        try {
            const validRows = rows.filter(row => row.name.trim() !== '');

            if (validRows.length === 0) return;

            let success = true;
            for (const row of validRows) {
                const response = await post({ name: row.name, departmentId: id }).unwrap();
                if (response?.statusCode !== 201) {
                    success = false;
                    break;
                }
            }

            if (success) {
                setShowSuccessModal(true);
            } else {
                showPopup("Sistem xətası", "Əməliyyat tamamlanmadı. Təkrar cəhd edin və ya dəstəyə müraciət edin.", "error");
            }

        } catch {
            showPopup("Sistem xətası", "Əməliyyat tamamlanmadı. Təkrar cəhd edin və ya dəstəyə müraciət edin.", "error");
        }
    };


    return (
        <div className="super-admin-bolme-add-main">
            <div className="super-admin-bolme-add">
                <div className="headerr">
                    <div className="head">
                        <h1>Bölmə əlavə edilməsi</h1>
                    </div>
                    <h2>
                        <NavLink className="link" to="/superAdmin/companies">— Şirkətlər</NavLink>
                        <NavLink className="link" to={`/superAdmin/companies/${department?.companyId}/sobe`}>—
                            Şöbə</NavLink>
                        <NavLink className="link" to={`/superAdmin/companies/sobe/${id}/bolme`}>— Bölmə</NavLink>
                        — Bölmə əlavə edilməsi
                    </h2>
                </div>

                <table className="product-table">
                    <thead>
                    <tr>
                        <th>Bölmə adı</th>

                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Bölmə adı daxil et"
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
                                Yeni bölmə əlavə et
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
                                            <path d="M11.771 19.3539L22.1397 8.9852C22.3844 8.74051 22.6699 8.61816 22.9961 8.61816C23.3224 8.61816 23.6078 8.74051 23.8525 8.9852C24.0972 9.22989 24.2196 9.52066 24.2196 9.85752C24.2196 10.1944 24.0972 10.4847 23.8525 10.7286L12.6274 21.9844C12.3827 22.2291 12.0972 22.3514 11.771 22.3514C11.4447 22.3514 11.1592 22.2291 10.9145 21.9844L5.6537 16.7235C5.40901 16.4788 5.29156 16.1885 5.30135 15.8524C5.31113 15.5164 5.43878 15.2256 5.68429 14.9801C5.92979 14.7346 6.22057 14.6123 6.55661 14.6131C6.89265 14.6139 7.18301 14.7362 7.4277 14.9801L11.771 19.3539Z" fill="white"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3>Bölmə uğurla əlavə edildi !</h3>
                        <button
                            className="back-btn"
                            onClick={() => window.location.href = `/superAdmin/companies/sobe/${id}/bolme`}
                        >
                            Bölmə siyahısına qayıt
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
};

export default SuperAdminBolmeAdd;
