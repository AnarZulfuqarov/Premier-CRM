import './index.scss';
import  { useState } from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import MonthPicker from "../../../components/MonthPicker/index.jsx";
import CalculationTable from "../../../components/CalculateTable/index.jsx";

const SuperAdminKalkulyasiyaDetail = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const pageSize = 5;
    const [selectedMonthYear, setSelectedMonthYear] = useState(null);

    const orders = Array.from({ length: 30 }, (_, idx) => ({
        id: `75875058252${idx + 10}`,
        company: 'Şirvanşah',
        person: 'Allahverdiyev Ali',
        amount: 325,
        orderDate: '16/05/25, 13:45',
        deliveryDate: '16/05/25, 13:45',
    }));

    const totalPages = Math.ceil(orders.length / pageSize);

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return pages;
    };

    return (
        <div className="super-admin-kalkulyasiya-detail-main">
            <div className="super-admin-kalkulyasiya-detail">

                <div className={"headerr"}>

                    <div className={"head"}>
                        <h2>Kalkulyasiya</h2>
                        <p>Hesablama əməliyyatlarını idarə edin və nəticələri analiz edin.</p>
                    </div>
                    <MonthPicker onChange={setSelectedMonthYear}/>
                </div>
                <div className={"root"}>
                    <h2 >
                        <NavLink className="link" to="/admin/history">— Şirkətlər</NavLink>{' '}
                        — Şirvanşah
                    </h2>
                </div>
                {
                    selectedMonthYear
                        ? <CalculationTable type="selected" selectedDate={selectedMonthYear} />
                        : <>
                            <CalculationTable type="current" />
                            <CalculationTable type="previous" />
                        </>
                }
                <div className="super-admin-kalkulyasiya-detail__pagination">
                    <button onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}>
                        &lt;
                    </button>
                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            className={page === currentPage ? 'active' : ''}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}>
                        &gt;
                    </button>
                </div>
            </div>
            <div className="xett"></div>
        </div>
    );
};

export default SuperAdminKalkulyasiyaDetail;
