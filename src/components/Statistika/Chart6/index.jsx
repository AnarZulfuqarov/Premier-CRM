// src/components/Statistika/OrdersByStatusCountTable.jsx
import  { useEffect, useMemo, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
    useGetAllCompaniesQuery,
    useGetMonthlyOrderStatusStatikQuery, // { year, companyId } -> statusCounts[]
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

export default function OrdersByStatusCountTable({
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

    // Statuslar
    const {
        data: statusResp,
        isLoading,
        isError,
    } = useGetMonthlyOrderStatusStatikQuery(q);

    // { ayKey: { pending, completed, canceled } }
    const statusMap = useMemo(() => {
        const arr = statusResp?.statusCounts ?? [];
        const map = {};
        for (const it of arr) {
            const key = String(it.month);
            map[key] = {
                pending:   Number(it.pendingCount ?? 0),
                completed: Number(it.completedCount ?? 0),
                canceled:  Number(it.canceledCount ?? 0),
            };
        }
        return map;
    }, [statusResp]);

    const rows = useMemo(
        () =>
            MONTHS_ORDER.map(({ label, key }) => ({
                monthName: label,
                pending:   statusMap[key]?.pending   ?? 0,
                completed: statusMap[key]?.completed ?? 0,
                canceled:  statusMap[key]?.canceled  ?? 0,
            })),
        [statusMap]
    );

    return (
        <div className="osbc-card">
            <div className="osbc-head">
                <h3 className="osbc-title">Sifarişlərin statusa əsasən sayı</h3>

                <div className="osbc-filters">
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

            <div className="osbc-table-wrap">
                {isLoading ? (
                    <div className="osbc-state">Yüklənir...</div>
                ) : isError ? (
                    <div className="osbc-state error">Xəta baş verdi</div>
                ) : (
                    <table className="osbc-table">
                        <thead>
                        <tr>
                            <th>Aylar</th>
                            <th>Təsdiq gözləyən sifariş sayı</th>
                            <th>Təsdiqlənən sifariş sayı</th>
                            <th>Ləğv edilən sifariş sayı</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((r) => (
                            <tr key={r.monthName}>
                                <td className="month">{r.monthName}</td>
                                <td>{r.pending}</td>
                                <td>{r.completed}</td>
                                <td>{r.canceled}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
