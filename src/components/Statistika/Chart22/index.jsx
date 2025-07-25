import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./index.scss";
import { useGetFighterOrderStatusStatikQuery } from "../../../services/adminApi";
import { skipToken } from "@reduxjs/toolkit/query";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DoughnutChartCard2 = ({
                                title = "Ümumi sifarişlər",
                                labels = ["Tamamlanmış", "Ləğv edilmiş", "Gözləyən"],
                                colors = ["#7ED957", "#EB5757", "#F2C94C"],
                                legendColors = ["#45DD42", "#FF2D2D", "#FFD256"],
                            }) => {
    const companyId = localStorage.getItem("selectedCompanyId");
    const fighterId = localStorage.getItem("selectedFighterId");

    const isValidCompany = companyId && companyId.length === 36;
    const isValidFighter = fighterId && fighterId.length === 36;

    const queryEnabled = isValidCompany && isValidFighter;

    const { data, isLoading, isError } = useGetFighterOrderStatusStatikQuery(
        queryEnabled ? { fighterId, companyId } : skipToken
    );

    if (!queryEnabled) return <div>Zəhmət olmasa şirkət və təchizatçı seçin</div>;
    if (isLoading) return <div>Yüklənir...</div>;
    if (isError) return <div>Xəta baş verdi</div>;

    const chartValues = [
        data?.completedPercent ?? 0,
        data?.canceledPercent ?? 0,
        data?.waitingPercent ?? 0,
    ];

    const centerText =
        chartValues[0] >= chartValues[1] && chartValues[0] >= chartValues[2]
            ? "Tamamlanmış"
            : chartValues[1] >= chartValues[2]
                ? "Ləğv edilmiş"
                : "Gözləyən";

    const doughnutData = {
        labels,
        datasets: [
            {
                data: chartValues,
                backgroundColor: colors,
                borderWidth: 0,
            },
        ],
    };

    const doughnutOptions = {
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (context) {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        return `${label}: ${value}%`;
                    },
                },
            },
            datalabels: {
                display: false,
            },
        },
        cutout: "70%",
    };

    return (
        <div className="chart-card">
            <div className="chart-content">
                <div>
                    <p className="card-title">{title}</p>
                    <div className="chart-left">
                        <ul className="legend-list">
                            {labels.map((label, i) => (
                                <li key={i}>
                                    <span className="dot" style={{ background: legendColors[i] }}></span>
                                    <strong>{chartValues[i]}%</strong> {label} sifarişlər
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="chart-right">
                    <div style={{ width: "160px", height: "160px", position: "relative" }}>
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                        <div className="chart-center-label">{centerText}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoughnutChartCard2;
