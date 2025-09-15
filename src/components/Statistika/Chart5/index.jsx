// src/components/Statistika/OrdersSupplyStatusTable.jsx
import React, { useEffect, useMemo, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
    useGetAllCompaniesQuery,
    useGetFighterMonthlyCompletionStatikQuery, // /Statistics/fighter-monthly-completion/{year}/{companyId}
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

export default function OrdersSupplyStatusTable({
                                                    initialCompanyId = "",
                                                    defaultYear = new Date().getFullYear(),
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

    // Yeni endpoint
    const { data: statusResp, isLoading, isError } = useGetFighterMonthlyCompletionStatikQuery(q);

    // BE: { statusCode, monthlyCompletionStats: [{ month, completed, incomplete }, ...] }
    const rawArr = Array.isArray(statusResp?.monthlyCompletionStats)
        ? statusResp.monthlyCompletionStats
        : [];

    // { ayKey: { pending, completed } } xəritəsi
    const statusMap = useMemo(() => {
        const map = {};
        for (const it of rawArr) {
            const m = String(it.month).toLowerCase(); // "yanvar", ...
            map[m] = {
                pending: Number(it.incomplete ?? 0),
                completed: Number(it.completed ?? 0),
            };
        }
        return map;
    }, [rawArr]);

    const rows = useMemo(
        () =>
            MONTHS_ORDER.map(({ label, key }) => ({
                monthName: label,
                pending: statusMap[key]?.pending ?? 0,
                completed: statusMap[key]?.completed ?? 0,
            })),
        [statusMap]
    );

    return (
        <div className="oss-card">
            <div className="oss-head">
                <h3 className="oss-title">Sifarişlərin təchiz olunmaya görə statusu</h3>

                <div className="oss-filters">
                    <div className="filter">
                        <span className="label">Şirkətin adı:</span>
                        <div className="select-wrap">
                            <select value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
                                {companies.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filter">
                        <span className="label">İl seçimi:</span>
                        <div className="select-wrap">
                            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                {yearOptions.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="oss-table-wrap">
                {isLoading ? (
                    <div className="oss-state">Yüklənir...</div>
                ) : isError ? (
                    <div className="oss-state error">Xəta baş verdi</div>
                ) : (
                    <table className="oss-table">
                        <thead>
                        <tr>
                            <th>Aylar</th>
                            <th>Natamam sifariş sayı</th>
                            <th>Tamamlanan sifariş sayı</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((r) => (
                            <tr key={r.monthName}>
                                <td className="month">{r.monthName}</td>
                                <td>{r.pending}</td>
                                <td>{r.completed}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
