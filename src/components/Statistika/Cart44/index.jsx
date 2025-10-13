// src/components/Statistika/OrdersTotalCountAmountTable.jsx
import  { useEffect, useMemo, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
    useGetAllCompaniesQuery, useGetDateBasedPaymentTotalQuery,
} from "/src/services/adminApi.jsx";
import "./index.scss";



export default function OrdersTotalCountAmountTable2({
                                                        initialCompanyId = ""
                                                    }) {
    // Şirkətlər
    const { data: companiesResp } = useGetAllCompaniesQuery();
    const companies = companiesResp?.data ?? companiesResp ?? [];

    const [companyId, setCompanyId] = useState(initialCompanyId || (companies?.[0]?.id ?? ""));
    useEffect(() => {
        if (!initialCompanyId && companies?.length) setCompanyId(companies[0].id);
    }, [companies, initialCompanyId]);


    const isValidId = Boolean(companyId);



    const { data: getDateBasedPaymentTotal } = useGetDateBasedPaymentTotalQuery(companyId);
    const basedPay = getDateBasedPaymentTotal?.data;



    return (
        <div className="otca-card">
            <div className="otca-head">
                <h3 className="otca-title">Verilən sifarişlərin ümumi sayı və məbləği</h3>

                <div className="otca-filters">
                    <div className="filter">
                        <span className="label">Şirkətin adı:</span>
                        <div className="select-wrap">
                            <select value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
                                {companies.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="otca-table-wrap">

                    <table className="otca-table2">
                        <thead>
                        <tr>
                            <th>Vendor adı</th>
                            <th>Ümumi borc</th>
                            <th>Qalıq borc</th>
                        </tr>
                        </thead>
                        <tbody>
                        {basedPay?.map(r => (
                            <tr key={r.monthName}>
                                <td >{r.vendorName}</td>
                                <td>{r.totalDebt}</td>
                                <td style={{
                                    fontWeight:"500"
                                }}>{r.remainingDebt }</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

            </div>
        </div>
    );
}
