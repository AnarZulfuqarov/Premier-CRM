// CompanyPage.jsx
import './index.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import icon from '/src/assets/ph_building-light.svg';

function CompanyPage() {
    const navigate = useNavigate();
    const [selectedCompany, setSelectedCompany] = useState(null);

    const companies = [
        { id: 1, name: 'Şirvanşah 1' },
        { id: 2, name: 'Şirvanşah 2' },
        { id: 3, name: 'Şirvanşah 3' },
        { id: 4, name: 'Şirvanşah 4' },
    ];

    const handleCompanySelect = (companyId) => {
        setSelectedCompany(companyId);
    };

    const handleSubmit = () => {
        if (selectedCompany) {
            console.log('Selected company ID:', selectedCompany);
            navigate('/dashboard');
        }
    };

    return (
        <div id="company">
            <div className="header">
                <h2>Logo and name</h2>
            </div>
            <div className="company-panel">
                <div>

                    <div className="company-form">
                        <div className="title">
                            <h1>Şirkətlər</h1>
                            <p>
                                Zəhmət olmasa, işləməyə davam etmək üçün daxil olmaq istədiyiniz şirkəti
                                siyahıdan seçin. Seçiminizə uyğun olaraq sizə aid məlumatlar və funksiyalar
                                göstəriləcək.
                            </p>
                        </div>
                        <div className="choose">
                            {companies.map((company) => (
                                <div
                                    key={company.id}
                                    className={`company ${selectedCompany === company.id ? 'selected' : ''}`}
                                    onClick={() => handleCompanySelect(company.id)}
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCompanySelect(company.id)}
                                    role="button"
                                >
                                    <img src={icon} alt={company.name} />
                                    <p>{company.name}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="submit"
                            disabled={selectedCompany === null}
                            onClick={handleSubmit}
                        >
                            Davam et
                        </button>
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

export default CompanyPage;
