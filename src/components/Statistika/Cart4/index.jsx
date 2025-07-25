import { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { useGetMonthlyOrderAmountStatikQuery } from "../../../services/adminApi";
import { skipToken } from "@reduxjs/toolkit/query";

const yearOptions = [2025, 2024, 2023];

const monthOrder = [
    "yanvar", "fevral", "mart", "aprel", "may", "iyun",
    "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"
];

const localizedMonthNames = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
    "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
];

const Chart4 = () => {
    const [selectedYear, setSelectedYear] = useState(2025);
    const companyId = localStorage.getItem("selectedCompanyId");
    const isValidId = companyId && companyId.length === 36;

    const { data, isLoading, isError } = useGetMonthlyOrderAmountStatikQuery(
        isValidId ? { year: selectedYear, companyId } : skipToken
    );

    const transformedData =
        data?.monthlyOrderAmounts
            ? monthOrder.map((key, idx) => ({
                month: localizedMonthNames[idx],
                count: data.monthlyOrderAmounts[key] || 0,
            }))
            : [];

    return (
        <div style={{ width: "100%", height: 320 }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 32,
            }}>
                <h3 style={{ margin: 0 }}>Verilən sifarişlərin məbləği</h3>
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

            {isLoading ? (
                <p>Yüklənir...</p>
            ) : isError ? (
                <p>Xəta baş verdi</p>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={transformedData}>
                        <defs>
                            <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FACC15" stopOpacity={0.6} />
                                <stop offset="100%" stopColor="#FACC15" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => value.toLocaleString()} />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#FACC15"
                            fill="url(#colorYellow)"
                            strokeWidth={2}
                            dot={{ r: 3, stroke: "#FACC15", strokeWidth: 2, fill: "#fff" }}
                            activeDot={{ r: 6 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default Chart4;
