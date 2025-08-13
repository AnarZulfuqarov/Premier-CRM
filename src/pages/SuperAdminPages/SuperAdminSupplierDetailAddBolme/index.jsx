import './index.scss';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
    useAddBolmeFightersMutation,
    useGetAllCompaniesQuery,
    useGetByIdFightersQuery
} from "../../../services/adminApi.jsx";
import { usePopup } from "../../../components/Popup/PopupContext.jsx";

const SuperAdminSupplierDetailAddBolme = () => {
    const { id } = useParams();
    const [searchName, setSearchName] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);
    const [initialCompanyIds, setInitialCompanyIds] = useState([]);
    const navigate = useNavigate();
    const { data: getByIdCustomers, refetch } = useGetByIdFightersQuery(id);
    const customer = getByIdCustomers?.data;
    const { data: getAllCompanies } = useGetAllCompaniesQuery();
    const companies = getAllCompanies?.data || [];
    const [postCompany] = useAddBolmeFightersMutation();
    const { showPopup } = usePopup();

    const filtered = companies.filter(company => {
        const byName = company.name?.toLowerCase().includes(searchName.toLowerCase());
        return byName;
    });

    useEffect(() => {
        if (customer?.companyDtos) {
            const ids = customer.companyDtos.map(c => c.id);
            setInitialCompanyIds(ids);
            setSelectedCompanyIds(ids);
        }
    }, [customer]);

    const handleCheckboxChange = (companyId) => {
        if (initialCompanyIds.includes(companyId)) return;

        setSelectedCompanyIds(prev =>
            prev.includes(companyId)
                ? prev.filter(id => id !== companyId)
                : [...prev, companyId]
        );
    };

    const handleSubmit = async () => {
        const newCompanyIds = selectedCompanyIds.filter(id => !initialCompanyIds.includes(id));
        if (newCompanyIds.length === 0) {
            showPopup("Xəta", "Yeni bir şirkət seçilmədi.", "error");
            return;
        }

        try {
            await postCompany({
                fighterId: id,
                companyIds: newCompanyIds
            }).unwrap();

            setShowSuccessModal(true);
            refetch();
        } catch (err) {
            console.error("Şirkət əlavə edilərkən xəta baş verdi:", err);
            showPopup("Sistem xətası", "Əməliyyat tamamlanmadı. Təkrar cəhd edin və ya dəstəyə müraciət edin.", "error");
        }
    };

    return (
        <div className="super-admin-supplier-detail-add-bolme-main">
            <div className="super-admin-supplier-detail-add-bolme">
                <div className="headerr">
                    <div className="head">
                        <h2>Təchizatçıya yeni şirkət əlavə et</h2>
                        <p>Əlavə etmək istədiyiniz şirkəti aşağıdan seçin.</p>
                    </div>
                </div>
                <div className="path">
                    <h2>
                        <NavLink className="link" to="/superAdmin/supplier">— Təchizatçılar</NavLink>{' '}
                        <NavLink to={`/superAdmin/supplier/${id}`} className="link">— {customer?.name} {customer?.surname}</NavLink>
                        — Şirkət əlavə et
                    </h2>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <input
                        type="text"
                        placeholder="Şirkət axtar..."
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
                                <th>Şirkət</th>
                                <th>Seç</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map((company) => (
                                <tr key={company.id}>
                                    <td>{company.name}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            style={{ cursor: initialCompanyIds.includes(company.id) ? 'not-allowed' : 'pointer' }}
                                            checked={selectedCompanyIds.includes(company.id)}
                                            onChange={() => handleCheckboxChange(company.id)}
                                            disabled={initialCompanyIds.includes(company.id)}
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
            {showSuccessModal && (
                <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
                    <div className="success-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="close-btn" onClick={() => setShowSuccessModal(false)}>✕</div>
                        <div className="check-icon">
                            <div className="circleOne">
                                <div className="circle pulse">
                                    <div className="circle-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">
                                            <path d="M12.2714 19.3539L22.6402 8.9852C22.8849 8.74051 23.1704 8.61816 23.4966 8.61816C23.8229 8.61816 24.1083 8.74051 24.353 8.9852C24.5977 9.22989 24.7201 9.52066 24.7201 9.85752C24.7201 10.1944 24.5977 10.4847 24.353 10.7286L13.1279 21.9844C12.8832 22.2291 12.5977 22.3514 12.2714 22.3514C11.9452 22.3514 11.6597 22.2291 11.415 21.9844L6.15419 16.7235C5.9095 16.4788 5.79205 16.1885 5.80183 15.8524C5.81162 15.5164 5.93927 15.2256 6.18477 14.9801C6.43028 14.7346 6.72105 14.6123 7.0571 14.6131C7.39314 14.6139 7.6835 14.7362 7.92819 14.9801L12.2714 19.3539Z" fill="white"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3>Şirkət uğurla əlavə edildi!</h3>
                        <button className="back-btn" onClick={() => navigate(`/superAdmin/supplier/${id}`)}>
                            Əsas səhifəyə qayıt
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminSupplierDetailAddBolme;