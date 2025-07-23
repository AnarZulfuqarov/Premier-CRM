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

const yearOptions = [2025, 2024, 2023];

const MonthlyOrdersChart = ({ allData = {} }) => {
    const [selectedYear, setSelectedYear] = useState(2025);
    const filteredData = allData?.[selectedYear] ?? [];

    return (
        <div style={{ width: "100%", height: 300 }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 32,
            }}>
                <h3 style={{ margin: 0 }}>Verilən sifarişlərin sayı</h3>
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

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredData}>
                    <defs>
                        <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        fill="url(#colorBlue)"
                        strokeWidth={2}
                        dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
                        activeDot={{ r: 6 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyOrdersChart;
