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

               await post(payload).unwrap();

                // Əgər backend-dən gələn cavab uğurlu deyilsə

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
    const isFormValid = () => {
        return rows.every(row =>
            row.name.trim() &&
            row.surname.trim() &&
            row.fin.trim() &&
            row.position &&
            Array.isArray(row.departments) && row.departments.length > 0 &&
            row.password.trim() &&
            row.phone.trim()
        );
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
                                <input
                                    type="text"
                                    placeholder="FİN daxil et"
                                    value={row.fin}
                                    onChange={(e) => handleChange(index, 'fin', e.target.value)}
                                    required
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
                                    required
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Nömrə daxil et"
                                    value={row.phone}
                                    onChange={(e) => handleChange(index, 'phone', e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                    ))}

                    </tbody>
                </table>

                <button  className={`confirm-btn ${!isFormValid() ? 'disabled' : ''}`} onClick={handleSubmit} disabled={!isFormValid()}>
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
