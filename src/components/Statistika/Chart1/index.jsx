import "./index.scss";
import {
    LineChart,
    Line,
    ResponsiveContainer,
} from "recharts";
import { useGetTotalOrdersStatikQuery } from "../../../services/adminApi"; // path sənə görə dəyişə bilər
import { skipToken } from "@reduxjs/toolkit/query";

const Chart1Card = () => {
    const companyId = localStorage.getItem("selectedCompanyId");
    const isValidId = companyId && companyId.length === 36; // basic UUID yoxlaması

    const { data, isLoading, isError } = useGetTotalOrdersStatikQuery(
        isValidId ? companyId : skipToken // skipToken üçün import lazımdır
    );
    console.log(data)
    if (isLoading) return <div>Yüklənir...</div>;
    if (isError || !data) return <div>Xəta baş verdi</div>;
    if (!isValidId) return <div>Zəhmət olmasa şirkət seçin</div>;

    const total = data.totalConfirmedOrders || 0;
    const percentage = data.percentGrowth || 0;

    const isUp = percentage > 0;
    const isDown = percentage < 0;

    const trendColor = isUp ? "#27AE60" : isDown ? "#EB5757" : "#999";
    const directionSymbol = isUp ? "↑" : isDown ? "↓" : "–";

    return (
        <div className="chart1-card">
            <div className="card-content">
                <div className="left-info">
                    <p className="card-title">Ümumi sifarişlər</p>
                    <h2 className="total">{total.toLocaleString()}</h2>
                    <div className="change-row">
                        <span className="arrow" style={{ color: trendColor }}>{directionSymbol}</span>
                        <span className="percent" style={{ color: trendColor }}>
              {Math.abs(percentage)}%
            </span>
                        <span className="compare-text">vs last month</span>
                    </div>
                </div>

                {/* Sadəcə dekor üçün chart, data olmadan */}
                <div className="mini-line-chart-recharts">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[{ value: 1 }, { value: 2 }, { value: 3 }]}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={trendColor}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Chart1Card;
