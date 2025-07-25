import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { useGetFighterMonthlyCompletionStatikQuery } from "../../../services/adminApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useState } from "react";

const yearOptions = [2025, 2024, 2023];

const customLegend = () => (
    <div style={{ display: "flex", gap: "24px", marginBottom: 24, marginTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#3b82f6" }}></div>
            <span style={{ fontSize: 14, color: "#555" }}>Natamam sifarişlər</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }}></div>
            <span style={{ fontSize: 14, color: "#555" }}>Tamamlanmış sifarişlər</span>
        </div>
    </div>
);

const StatusBasedBarChart = () => {
    const [selectedYear, setSelectedYear] = useState(2025);
    const fighterId = localStorage.getItem("selectedFighterId");
    const companyId = localStorage.getItem("selectedCompanyId");

    const isValid = fighterId?.length === 36 && companyId?.length === 36;

    const { data, isLoading, isError } = useGetFighterMonthlyCompletionStatikQuery(
        isValid ? { fighterId, year: selectedYear, companyId } : skipToken
    );

    if (!isValid) return <div>Zəhmət olmasa şirkət və təchizatçı seçin</div>;
    if (isLoading) return <div>Yüklənir...</div>;
    if (isError || !data?.monthlyCompletionStats) return <div>Xəta baş verdi</div>;

    const chartData = data.monthlyCompletionStats.map(item => ({
        month: item.month?.charAt(0).toUpperCase() + item.month?.slice(1),
        completed: item.completed,
        pending: item.incomplete,
    }));

    return (
        <div style={{ width: "100%", height: 350 }}>
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

            {customLegend()}

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="pending" fill="#3b82f6" barSize={20} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="completed" fill="#22c55e" barSize={20} radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatusBasedBarChart;
