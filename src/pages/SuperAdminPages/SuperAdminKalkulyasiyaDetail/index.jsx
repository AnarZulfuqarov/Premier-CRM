import './index.scss';
import  { useState } from 'react';
import {NavLink, useNavigate, useParams} from 'react-router-dom';
import MonthPicker from "../../../components/MonthPicker/index.jsx";
import CalculationTable from "../../../components/CalculateTable/index.jsx";
import {
    useGetCalculationFilterQuery,
    useGetCalculationQuery
} from "../../../services/adminApi.jsx";
import { skipToken } from '@reduxjs/toolkit/query';

const SuperAdminKalkulyasiyaDetail = () => {
    const {id} = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const pageSize = 5;
    const [selectedMonthYear, setSelectedMonthYear] = useState(null);
    const {data:getCalculation} = useGetCalculationQuery(id)
    const currentCalc = getCalculation?.data;
    const isSameAsCurrent =
        selectedMonthYear &&
        Number(selectedMonthYear.month) === Number(currentCalc?.[0]?.month) &&
        Number(selectedMonthYear.year) === Number(currentCalc?.[0]?.year);

    const {
        data: getCalculationFilter
    } = useGetCalculationFilterQuery(
        selectedMonthYear && !isSameAsCurrent
            ? {
                companyId: id,
                year: selectedMonthYear.year,
                month: selectedMonthYear.month,
            }
            : skipToken // eyni ay/il seçilibsə, heç çağırma
    );

    const filterCalc = getCalculationFilter?.data





    const totalPages = Math.ceil(currentCalc?.length / pageSize);



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
                        <NavLink className="link" to="/superAdmin/kalkulyasiya">— Şirkətlər</NavLink>{' '}
                        — {currentCalc?.[0]?.companyName}
                    </h2>
                </div>
                {
                    selectedMonthYear && !isSameAsCurrent ? (
                        <CalculationTable
                            type="selected"
                            selectedDate={selectedMonthYear}
                            data={getCalculationFilter?.data?.[0] || []}
                        />
                    ) : (
                        <>
                            <CalculationTable type="current" data={currentCalc?.[0]} companyId={id} />
                            {currentCalc && currentCalc?.[0]?.monthName?.toLowerCase() !== 'iyul' && (
                                <CalculationTable type="previous" />
                            )}
                        </>
                    )
                }


            </div>
        </div>
    );
};

export default SuperAdminKalkulyasiyaDetail;
