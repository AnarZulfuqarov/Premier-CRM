// src/components/Statistika/OrdersTotalCountAmountTable.jsx
import React, { useEffect, useMemo, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
    useGetMonthlyOrderAmountStatikQuery,    // { year, companyId } -> monthlyOrderAmounts {yanvar: number, ...}
    useGetMonthlyOrderStatusStatikQuery,    // { year, companyId } -> statusCounts [{month:'yanvar', completedCount,...}]
    useGetAllCompaniesQuery,                // şirkət dropdown-u üçün
} from "/src/services/adminApi.jsx";
import "./index.scss";

const MONTHS_ORDER = [
    { label: "Yanvar",   key: "yanvar"   },
    { label: "Fevral",   key: "fevral"   },
    { label: "Mart",     key: "mart"     },
    { label: "Aprel",    key: "aprel"    },
    { label: "May",      key: "may"      },
    { label: "İyun",     key: "iyun"     },
    { label: "İyul",     key: "iyul"     },
    { label: "Avqust",   key: "avqust"   },
    { label: "Sentyabr", key: "sentyabr" },
    { label: "Oktyabr",  key: "oktyabr"  },
    { label: "Noyabr",   key: "noyabr"   },
    { label: "Dekabr",   key: "dekabr"   },
];

const yearOptions = (() => {
    const y = new Date().getFullYear();
    return [y - 2, y - 1, y, y + 1, y + 2];
})();

export default function OrdersTotalCountAmountTable({
                                                        initialCompanyId = "",                 // istəsən parent-dən ver
                                                        defaultYear = new Date().getFullYear()
                                                    }) {
    // Şirkətlər
    const { data: companiesResp } = useGetAllCompaniesQuery();
    const companies = companiesResp?.data ?? companiesResp ?? [];

    const [companyId, setCompanyId] = useState(initialCompanyId || (companies?.[0]?.id ?? ""));
    useEffect(() => {
        if (!initialCompanyId && companies?.length) setCompanyId(companies[0].id);
    }, [companies, initialCompanyId]);

    const [selectedYear, setSelectedYear] = useState(defaultYear);
    const isValidId = Boolean(companyId);

    const q = isValidId ? { year: Number(selectedYear), companyId } : skipToken;

    // A) Məbləğ
    const {
        data: amountResp,
        isLoading: isLoadingAmount,
        isError: isErrorAmount
    } = useGetMonthlyOrderAmountStatikQuery(q);

    // B) Status -> toplam say
    const {
        data: statusResp,
        isLoading: isLoadingStatus,
        isError: isErrorStatus
    } = useGetMonthlyOrderStatusStatikQuery(q);

    const amountObj = amountResp?.monthlyOrderAmounts ?? {};
    const countsMap = useMemo(() => {
        const arr = statusResp?.statusCounts ?? [];
        const map = {};
        for (const it of arr) {
            const total = Number(it.completedCount ?? 0) + Number(it.pendingCount ?? 0) + Number(it.canceledCount ?? 0);
            map[String(it.month)] = total;
        }
        return map; // { 'yanvar': 0, ... }
    }, [statusResp]);

    const rows = useMemo(() => {
        return MONTHS_ORDER.map(({ label, key }) => ({
            monthName: label,
            count: Number(countsMap[key] ?? 0),
            amount: Number(amountObj[key] ?? 0),
        }));
    }, [countsMap, amountObj]);

    const isLoading = isLoadingAmount || isLoadingStatus;
    const isError = isErrorAmount || isErrorStatus;

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

                    <div className="filter">
                        <span className="label">İl seçimi:</span>
                        <div className="select-wrap">
                            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="otca-table-wrap">
                {isLoading ? (
                    <div className="otca-state">Yüklənir...</div>
                ) : isError ? (
                    <div className="otca-state error">Xəta baş verdi</div>
                ) : (
                    <table className="otca-table">
                        <thead>
                        <tr>
                            <th>Aylar</th>
                            <th>Sifariş sayı</th>
                            <th>Sifariş məbləği</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map(r => (
                            <tr key={r.monthName}>
                                <td className="month">{r.monthName}</td>
                                <td>{r.count}</td>
                                <td>{r.amount.toLocaleString("az-AZ")} ₼</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
