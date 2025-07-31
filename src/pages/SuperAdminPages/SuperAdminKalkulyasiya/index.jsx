import React, { useState } from 'react';
import './index.scss';
import icon from "../../../assets/ph_building-light.svg";
import {useGetAllCompaniesQuery} from "../../../services/adminApi.jsx";
import { useNavigate } from 'react-router-dom';

const SuperAdminKalkulyasiya = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const {data:getAllCompanies} = useGetAllCompaniesQuery()
    const companies = getAllCompanies?.data

    const filteredOrders = companies?.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filter === 'all' ||
            (filter === 'pending' && order.status === 'Sifarişçidən təhvil gözləyən') ||
            (filter === 'completed' && order.status === 'Tamamlanmış') ||
            (filter === 'pending' && order.status === 'Təchizatçıdan təsdiq gözləyən');
        return matchesSearch && matchesFilter;
    });

    const [selectedCompany, setSelectedCompany] = useState(null);



    const handleCompanySelect = (companyId) => {
        setSelectedCompany(companyId);
    };

    const navigate = useNavigate();

    const handleContinue = () => {
        if (selectedCompany) {
            navigate(`/superAdmin/kalkulyasiya/${selectedCompany}`);
        } else {
            alert("Zəhmət olmasa bir şirkət seçin");
        }
    };

    return (
        <div className={"super-admin-kalkulyasiya-main"}>
            <div className="super-admin-kalkulyasiya">
                <h2>Kalkulyasiya</h2>
                <p>Davam etmək üçün işləmək istədiyiniz şirkəti seçin. Seçimdən sonra həmin şirkətə aid əməliyyatlar təqdim olunacaq.</p>
                <div className="choose">
                    {companies?.map((company) => (
                        <div
                            key={company.id}
                            className={`company ${selectedCompany === company.id ? 'selected' : ''}`}
                            onClick={() => handleCompanySelect(company.id)}
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handleCompanySelect(company.id)}
                            role="button"
                        >
                            <img src={icon} alt={company.name} />
                            <p className={'p'}>{company.name}</p>
                        </div>
                    ))}
                </div>
                <div className="kalkulyasiya-button-wrapper">
                    <button className="kalkulyasiya-continue-btn" onClick={handleContinue}>

                        Davam et
                    </button>
                </div>
            </div>


        </div>
    );
};

export default SuperAdminKalkulyasiya;