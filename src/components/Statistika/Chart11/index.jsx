import "./index.scss";
import {
    LineChart,
    Line,
    ResponsiveContainer,
} from "recharts";
import { useGetFighterOrderCountStatikQuery } from "../../../services/adminApi";
import { skipToken } from "@reduxjs/toolkit/query";

const Chart11Card = () => {
    const companyId = localStorage.getItem("selectedCompanyId");
    const fighterId = localStorage.getItem("selectedFighterId");

    const isValidCompany = companyId && companyId.length === 36;
    const isValidFighter = fighterId && fighterId.length === 36;

    const queryEnabled = isValidCompany && isValidFighter;

    const { data, isLoading, isError } = useGetFighterOrderCountStatikQuery(
        queryEnabled ? { fighterId, companyId } : skipToken
    );

    if (!queryEnabled) return <div>Zəhmət olmasa şirkət və təchizatçı seçin</div>;
    if (isLoading) return <div>Yüklənir...</div>;
    if (isError || !data?.confirmedOrderCount) return <div>Xəta baş verdi</div>;

    const total = data.confirmedOrderCount.totalCount || 0;
    const percentage = data.confirmedOrderCount.growthPercentage || 0;

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

export default Chart11Card;
