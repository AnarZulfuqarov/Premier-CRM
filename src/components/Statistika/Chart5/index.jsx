import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useGetMonthlyOrderStatusStatikQuery } from "../../../services/adminApi";
import { skipToken } from "@reduxjs/toolkit/query";

const yearOptions = [2025, 2024, 2023];

const monthMap = {
    yanvar: "Yanvar",
    fevral: "Fevral",
    mart: "Mart",
    aprel: "Aprel",
    may: "May",
    iyun: "İyun",
    iyul: "İyul",
    avqust: "Avqust",
    sentyabr: "Sentyabr",
    oktyabr: "Oktyabr",
    noyabr: "Noyabr",
    dekabr: "Dekabr",
};

const StatusBarChart = () => {
    const [selectedYear, setSelectedYear] = useState(2025);
    const companyId = localStorage.getItem("selectedCompanyId");

    const { data, isLoading, isError } = useGetMonthlyOrderStatusStatikQuery(
        companyId ? { year: selectedYear, companyId } : skipToken
    );

    const transformedData =
        data?.statusCounts?.map((item) => ({
            month: monthMap[item.month] || item.month,
            completed: item.completedCount,
            canceled: item.canceledCount,
            pending: item.pendingCount,
        })) || [];

    return (
        <div style={{ width: "100%", height: 360 }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
            }}>
                <h3 style={{ margin: 0 }}>Sifarişlərin statusa əsasən statistikası</h3>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        padding: "4px 12px",
                        fontSize: 14,
                        backgroundColor: "#f5f5f5",
                        cursor: "pointer",
                    }}
                >
                    {yearOptions.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            {/* Legend header altı */}
            <div style={{
                display: "flex",
                gap: "24px",
                marginBottom: 16,
                fontSize: 14,
                color: "#555",
                fontWeight: 500,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{
                        width: 12,
                        height: 12,
                        borderRadius: 999,
                        background: "#facc15"
                    }}></div>
                    Təsdiq gözləyən sifarişlər
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{
                        width: 12,
                        height: 12,
                        borderRadius: 999,
                        background: "#93c5fd"
                    }}></div>
                    Ləğv edilmiş sifarişlər
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{
                        width: 12,
                        height: 12,
                        borderRadius: 999,
                        background: "#3b82f6"
                    }}></div>
                    Tamamlanmış sifarişlər
                </div>
            </div>

            {isLoading ? (
                <p>Yüklənir...</p>
            ) : isError ? (
                <p>Xəta baş verdi</p>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={transformedData}
                        barCategoryGap={10}
                        barGap={2}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="pending" fill="#facc15" radius={[20, 20, 0, 0]} />
                        <Bar dataKey="canceled" fill="#93c5fd" radius={[20, 20, 0, 0]} />
                        <Bar dataKey="completed" fill="#3b82f6" radius={[20, 20, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default StatusBarChart;
