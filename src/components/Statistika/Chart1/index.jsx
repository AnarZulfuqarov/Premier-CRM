import {
    LineChart,
    Line,
    ResponsiveContainer,
} from "recharts";
import "./index.scss";

const Chart1Card = ({
                        title = "Ümumi sifarişlər",
                        total = 2420,
                        trendData = [100, 120, 130, 150, 200], // bu değişebilir
                    }) => {
    const first = trendData[0];
    const last = trendData.at(-1);

    const percentage = first === 0 ? 0 : Math.abs(((last - first) / first) * 100).toFixed(0);

    const isUp = last > first;
    const isDown = last < first;
    const isSame = last === first;

    const trendColor = isUp ? "#27AE60" : isDown ? "#EB5757" : "#999";
    const directionSymbol = isUp ? "↑" : isDown ? "↓" : "–";

    const chartData = trendData.map((val, index) => ({ index, value: val }));

    return (
        <div className="chart1-card">
            <div className="card-content">
                <div className="left-info">
                    <p className="card-title">{title}</p>
                    <h2 className="total">{total.toLocaleString()}</h2>
                    <div className="change-row">
                        <span className="arrow" style={{ color: trendColor }}>{directionSymbol}</span>
                        <span className="percent" style={{ color: trendColor }}>
              {percentage}%
            </span>
                        <span className="compare-text">vs last month</span>
                    </div>
                </div>
                <div className="mini-line-chart-recharts">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
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
