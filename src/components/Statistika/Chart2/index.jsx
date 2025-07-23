import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./index.scss";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DoughnutChartCard = ({
                               title = "Ümumi sifarişlər",
                               data = [100, 0, 0],
                               labels = ["Tamamlanmış", "Ləğv edilmiş", "Gözləyən"],
                               colors = ["#7ED957", "#EB5757", "#F2C94C"],
                               legendColors = ["#45DD42", "#FF2D2D", "#FFD256"],
                               centerText = "Tamamlanmış",
                           }) => {
    const doughnutData = {
        labels,
        datasets: [
            {
                data,
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
                display: false // veya bunu hiç yazma
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
                                    <span className={`dot`} style={{ background: legendColors[i] }}></span>
                                    <strong>{data[i]}%</strong> {label} sifarişlər
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

export default DoughnutChartCard;
