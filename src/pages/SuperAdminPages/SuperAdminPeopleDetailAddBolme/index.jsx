import './index.scss';
import  {useEffect, useState} from 'react';
import {NavLink, useNavigate, useParams} from 'react-router-dom';
import {
    useAddBolmeCustomersMutation,
    useGetAllSectionsQuery,
    useGetByIdCustomersQuery
} from "../../../services/adminApi.jsx";

const SuperAdminPeopleDetailAddBolme = () => {
    const {id} = useParams();
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedSectionIds, setSelectedSectionIds] = useState([]);
    const [initialSectionIds, setInitialSectionIds] = useState([]);

    const navigate = useNavigate();
    const {data: getByIdCustomers,refetch} = useGetByIdCustomersQuery(id);
    const customer = getByIdCustomers?.data;

    const {data:getAllSections} = useGetAllSectionsQuery()
    const sections = getAllSections?.data || [];

    const [postSection] = useAddBolmeCustomersMutation()
    const filtered = sections.filter(section => {
        const byName = section.name?.toLowerCase().includes(searchName.toLowerCase());
        const byCat = section.departmentName?.toLowerCase().includes(searchCategory.toLowerCase());
        return byName && byCat;
    });


    useEffect(() => {
        if (customer?.sections) {
            const ids = customer.sections.map(s => s.id);
            setInitialSectionIds(ids);
            setSelectedSectionIds(ids); // checkbox'ları işaretle
        }
    }, [customer]);

    const handleCheckboxChange = (sectionId) => {
        if (initialSectionIds.includes(sectionId)) return; // zaten atanmışsa değiştirme

        setSelectedSectionIds(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId) // kaldır
                : [...prev, sectionId]               // ekle
        );
    };

    const handleSubmit = async () => {
        const newSectionIds = selectedSectionIds.filter(id => !initialSectionIds.includes(id));
        if (newSectionIds.length === 0) {
            alert("Yeni bir bölmə seçilmədi.");
            return;
        }

        try {
            await postSection({
                customerId: id,
                sectionIds: newSectionIds
            });

            setShowSuccessModal(true);
            refetch(); // müşteri bilgilerini güncelle (opsiyonel)
        } catch (err) {
            console.error("Bölmə əlavə edilərkən xəta baş verdi:", err);
            alert("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
        }
    };




    return (
        <div className="super-admin-people-detail-add-bolme-main">

            <div className="super-admin-people-detail-add-bolme">
                <div className={"headerr"}>
                    <div className={"head"}>
                        <h2>Sifarişçiyə yeni bölmə əlavə et</h2>
                        <p>Əlavə etmək istədiyiniz bölməni aşağıdan seçin.</p>
                    </div>
                </div>
                <div className={"path"}>
                    <h2>
                        <NavLink className="link" to="/superAdmin/people">— Sifarişçilər</NavLink>{' '}
                        <NavLink to={`/superAdmin/people/${id}`} className={"link"} >— {customer?.name} {customer?.surname}</NavLink>
                        — Bölmə əlavə et
                    </h2>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <input
                        type="text"
                        placeholder="Bölmə axtar..."
                        style={{
                            width: '60%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            fontSize: '14px',
                        }}
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>


                <div className="table-wrapper">
                    <div className="table-scroll">
                        <table className="order-history-detail-supplier__table">
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>Şöbə</th>
                                <th>Bölmə</th>
                                <th>Şirkət</th>
                                <th>Seç</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map((section, index) => (
                                <tr key={section.id}>
                                    <td>{index + 1}</td>
                                    <td>{section.departmentName}</td>
                                    <td>{section.name}</td>
                                    <td>{section.companyName}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            style={{ cursor: initialSectionIds.includes(section.id) ? 'not-allowed' : 'pointer' }}
                                            checked={selectedSectionIds.includes(section.id)}
                                            onChange={() => handleCheckboxChange(section.id)}
                                            disabled={initialSectionIds.includes(section.id)} // disable edilmişse tıklanamaz
                                        />

                                    </td>
                                </tr>
                            ))}
                            </tbody>


                        </table>
                        <div className="fixed-submit-btn">
                            <button className="submitBolme" onClick={handleSubmit}>
                                Təsdiqlə
                            </button>
                        </div>

                    </div>
                </div>


            </div>


            {deleteIndex !== null && (
                <div className="modal-overlay" onClick={() => setDeleteIndex(null)}>
                    <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon-wrapper">
                            <div className={"delete-icon-circle-one"}>
                                <div className="delete-icon-circle">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="44" viewBox="0 0 45 44" fill="none">
                                        <path d="M22.5008 24.566L27.8175 29.8827C28.1536 30.2188 28.5814 30.3869 29.1009 30.3869C29.6203 30.3869 30.0481 30.2188 30.3842 29.8827C30.7203 29.5466 30.8884 29.1188 30.8884 28.5994C30.8884 28.0799 30.7203 27.6522 30.3842 27.3161L25.0675 21.9994L30.3842 16.6827C30.7203 16.3466 30.8884 15.9188 30.8884 15.3994C30.8884 14.8799 30.7203 14.4521 30.3842 14.116C30.0481 13.7799 29.6203 13.6119 29.1009 13.6119C28.5814 13.6119 28.1536 13.7799 27.8175 14.116L22.5008 19.4327L17.1842 14.116C16.8481 13.7799 16.4203 13.6119 15.9008 13.6119C15.3814 13.6119 14.9536 13.7799 14.6175 14.116C14.2814 14.4521 14.1133 14.8799 14.1133 15.3994C14.1133 15.9188 14.2814 16.3466 14.6175 16.6827L19.9342 21.9994L14.6175 27.3161C14.2814 27.6522 14.1133 28.0799 14.1133 28.5994C14.1133 29.1188 14.2814 29.5466 14.6175 29.8827C14.9536 30.2188 15.3814 30.3869 15.9008 30.3869C16.4203 30.3869 16.8481 30.2188 17.1842 29.8827L22.5008 24.566ZM22.5008 40.3327C19.9647 40.3327 17.5814 39.8512 15.3508 38.8881C13.1203 37.925 11.18 36.619 9.52999 34.9702C7.87999 33.3215 6.57404 31.3812 5.61215 29.1494C4.65026 26.9176 4.16871 24.5343 4.16748 21.9994C4.16626 19.4645 4.64782 17.0811 5.61215 14.8494C6.57649 12.6176 7.88243 10.6773 9.52999 9.02852C11.1775 7.37974 13.1178 6.0738 15.3508 5.11068C17.5838 4.14757 19.9672 3.66602 22.5008 3.66602C25.0345 3.66602 27.4179 4.14757 29.6509 5.11068C31.8839 6.0738 33.8241 7.37974 35.4717 9.02852C37.1193 10.6773 38.4258 12.6176 39.3914 14.8494C40.3569 17.0811 40.8379 19.4645 40.8342 21.9994C40.8305 24.5343 40.349 26.9176 39.3895 29.1494C38.4301 31.3812 37.1241 33.3215 35.4717 34.9702C33.8193 36.619 31.879 37.9256 29.6509 38.8899C27.4227 39.8542 25.0394 40.3352 22.5008 40.3327Z" fill="#E60D0D"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="delete-message">Məhsulun silinməsi üçün administratora bildiriş göndəriləcək.</p>
                        <p className="delete-sub">Silinmə yalnız təsdiqdən sonra həyata keçiriləcək.</p>
                        <div className="delete-modal-actions">
                            <button className="cancel-btn" onClick={() => setDeleteIndex(null)}>Ləğv et</button>
                            <button
                                className="confirm-btn"
                                onClick={() => {
                                    const updated = [...orderItems];
                                    updated.splice(deleteIndex, 1);
                                    setOrderItems(updated);
                                    setDeleteIndex(null);
                                }}
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                        <h3>Bölmə uğurla əlavə edildi !</h3>
                        <button className="back-btn" onClick={() => window.location.href = `/superAdmin/people/${id}`}>
                            Əsas səhifəyə qayıt
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminPeopleDetailAddBolme;
