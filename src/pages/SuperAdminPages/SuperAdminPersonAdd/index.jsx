import {useState} from 'react';
import './index.scss';
import {NavLink} from "react-router-dom";
import CustomDropdown from "../../../components/Supplier/CustomDropdown/index.jsx";
import {useCreateCustomersMutation, useGetAllJobsQuery, useGetAllSectionsQuery} from "../../../services/adminApi.jsx";
import Select from 'react-select';
import {usePopup} from "../../../components/Popup/PopupContext.jsx";

const SuperPersonAdd = () => {
    const [rows, setRows] = useState([
        { name: '', surname: '', fin: '', position: '', department: '', password: '', phone: '' }
    ]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const showPopup = usePopup()
    const {data: getAllJobs} = useGetAllJobsQuery();
    const {data: getAllSections} = useGetAllSectionsQuery();

    const positions = getAllJobs?.data || [];
    const departments = getAllSections?.data || [];

    const [post] = useCreateCustomersMutation()
    const handleChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    const addRow = () => {
        setRows([...rows, {
            name: '', surname: '', fin: '', position: '', department: '', password: '', phone: ''
        }]);
    };
    const handleSubmit = async () => {
        try {
            for (const row of rows) {
                const selectedJob = positions.find(p => p.name === row.position);

                const selectedSectionIds = departments
                    .filter(d => row.departments?.includes(d.id))
                    .map(d => d.id);

                const payload = {
                    name: row.name,
                    surname: row.surname,
                    password: row.password,
                    finCode: row.fin,
                    jobId: selectedJob?.id || '',
                    phoneNumber: row.phone,
                    sectionIds: selectedSectionIds
                };

                const response = await post(payload).unwrap();

                // Əgər backend-dən gələn cavab uğurlu deyilsə
                if (response?.statusCode !== 200) {
                    showPopup("Xəta baş verdi", "İstifadəçi əlavə olunmadı", "error")
                    return;
                }
            }

            // Hər şey uğurlu oldusa modal aç
            setShowSuccessModal(true);
            setRows([{
                name: '', surname: '', fin: '', position: '', departments: [], password: '', phone: ''
            }]);
        } catch  {
            showPopup("Xəta baş verdi", "İstifadəçi əlavə olunmadı", "error")
        }
    };


    return (
        <div className="super-admin-person-add-main">
            <div className="super-admin-person-add">
                <div className="headerr">
                    <div className="head">
                        <h1>İstifadəçi əlavə edilməsi</h1>
                    </div>
                    <h2>
                        <NavLink className="link" to="/superAdmin/people">— İstifadəçi</NavLink> — İstifadəçi əlavə edilməsi
                    </h2>
                </div>

                <table className="product-table">
                    <thead>
                    <tr>
                        <th>Ad</th>
                        <th>Soyad</th>
                        <th>FİN</th>
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
                                <input
                                    type="text"
                                    placeholder="FİN daxil et"
                                    value={row.fin}
                                    onChange={(e) => handleChange(index, 'fin', e.target.value)}
                                />
                            </td>
                            <td>
                                <CustomDropdown
                                    options={positions.map(p => p.name)}
                                    selected={row.position}
                                    onSelect={(value) => handleChange(index, 'position', value)}
                                    placeholder="Vəzifə seç"
                                />
                            </td>
                            <td>
                                <Select
                                    isMulti
                                    placeholder="Bölmə seç"
                                    options={departments.map(dep => ({
                                        value: dep.id,
                                        label: dep.name
                                    }))}
                                    value={departments
                                        .filter(dep => row.departments?.includes(dep.id))
                                        .map(dep => ({
                                            value: dep.id,
                                            label: dep.name
                                        }))
                                    }
                                    onChange={(selectedOptions) =>
                                        handleChange(index, 'departments', selectedOptions.map(opt => opt.value))
                                    }
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
                        <td colSpan="7">
                            <button className="add-row-btn" onClick={addRow}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                    <path d="M12.5 23C6.71 23 2 18.29 2 12.5C2 6.71 6.71 2 12.5 2C18.29 2 23 6.71 23 12.5C23 18.29 18.29 23 12.5 23ZM12.5 3.5C7.535 3.5 3.5 7.535 3.5 12.5C3.5 17.465 7.535 21.5 12.5 21.5C17.465 21.5 21.5 17.465 21.5 12.5C21.5 7.535 17.465 3.5 12.5 3.5Z" fill="#6C6C6C"/>
                                    <path d="M12.5 17.75C12.08 17.75 11.75 17.42 11.75 17V8C11.75 7.58 12.08 7.25 12.5 7.25C12.92 7.25 13.25 7.58 13.25 8V17C13.25 17.42 12.92 17.75 12.5 17.75Z" fill="#6C6C6C"/>
                                    <path d="M17 13.25H8C7.58 13.25 7.25 12.92 7.25 12.5C7.25 12.08 7.58 11.75 8 11.75H17C17.42 11.75 17.75 12.08 17.75 12.5C17.75 12.92 17.42 13.25 17 13.25Z" fill="#6C6C6C"/>
                                </svg>
                                Yeni istifadəçi əlavə et
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <button className="confirm-btn" onClick={handleSubmit}>
                    Təsdiqlə
                </button>

            </div>

            <div className="xett"></div>

            {showSuccessModal && (
                <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
                    <div className="success-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="close-btn" onClick={() => setShowSuccessModal(false)}>✕</div>
                        <div className="check-icon">
                            <div className="circleOne">
                                <div className="circle pulse">
                                    <div className="circle-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">
                                            <path d="M11.7714 19.353L22.1402 8.98422C22.3849 8.73953 22.6704 8.61719 22.9966 8.61719C23.3229 8.61719 23.6083 8.73953 23.853 8.98422C24.0977 9.22891 24.2201 9.51969 24.2201 9.85654C24.2201 10.1934 24.0977 10.4838 23.853 10.7276L12.6279 21.9834C12.3832 22.2281 12.0977 22.3504 11.7714 22.3504C11.4452 22.3504 11.1597 22.2281 10.915 21.9834L5.65419 16.7226C5.4095 16.4779 5.29205 16.1875 5.30183 15.8515C5.31162 15.5154 5.43927 15.2246 5.68477 14.9791C5.93028 14.7336 6.22105 14.6113 6.5571 14.6121C6.89314 14.6129 7.1835 14.7353 7.42819 14.9791L11.7714 19.353Z" fill="white"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3>İstifadəçi uğurla əlavə edildi !</h3>
                        <button className="back-btn" onClick={() => window.location.href = "/superAdmin/people"}>
                            Əsas səhifəyə qayıt
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperPersonAdd;
