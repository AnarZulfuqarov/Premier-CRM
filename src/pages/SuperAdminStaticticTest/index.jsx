import "./index.scss"
import drop4 from "/src/assets/statik4.png"
import drop5 from "/src/assets/statik5.png"
import drop6 from "/src/assets/statik6.png"
import drop7 from "/src/assets/statik7.png"
import drop8 from "/src/assets/statik8.png"
import drop9 from "/src/assets/statik9.png"
import drop10 from "/src/assets/statik10.png"
import drop11 from "/src/assets/statik11.png"
import drop12 from "/src/assets/statik12.png"
import drop13 from "/src/assets/statik13.png"
import drop14 from "/src/assets/statik14.png"
import drop15 from "/src/assets/statik15.png"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {useState} from "react";
import DoughnutChartCard from "../../components/Statistika/Chart2/index.jsx";
import Chart1Card from "../../components/Statistika/Chart1/index.jsx";
import {useGetAllCompaniesQuery} from "../../services/adminApi.jsx";
import MonthlyOrdersChart from "../../components/Statistika/Cart3/index.jsx";
ChartJS.register(ArcElement, Tooltip, Legend);
function SuperAdminStatistikTest() {
    const { data: getAllCompanies, isLoading } = useGetAllCompaniesQuery();
    const companies = getAllCompanies?.data;
    console.log(companies);
    const [selectedBranch, setSelectedBranch] = useState(""); // id olarak başlat
    const allData = {
        2025: [
            { month: "Yanvar", count: 22 },
            { month: "Fevral", count: 25 },
            { month: "Mart", count: 48 },
            { month: "Aprel", count: 20 },
            { month: "May", count: 30 },
            { month: "Iyun", count: 68 },
            { month: "Iyul", count: 25 },
            { month: "Avqust", count: 90 },
            { month: "Sentyabr", count: 80 },
            { month: "Oktybar", count: 85 },
            { month: "Noyabr", count: 95 },
            { month: "Dekabr", count: 150 },
        ],
        2024: [
            { month: "Yanvar", count: 30 },
            { month: "Fevral", count: 35 },
        ],
    };



    return (
        <div id={"super-admin-static-main"}>
            <div className={'super-admin-static'}>
                <div className={"staticHead"}>
                    <div className={"content"}>
                        <h3>Statistikalar</h3>
                        <p>
                            Sifarişlərin bütün mərhələlər üzrə vəziyyəti bu bölmədə əks olunur.
                        </p>
                    </div>
                    <div className="dropdownSelect">
                        {isLoading ? (
                            <p>Yüklənir...</p>
                        ) : (
                            <select
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                            >
                                {companies?.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                </div>
                <div className={"firstStatik"}>
                    <div className={"chart1"}>
                        <Chart1Card
                            title="Ümumi sifarişlər"
                            total={2420}
                            percentage={40}
                            trendData={[100, 150, 120, 180, 220, 200, 240]}
                        />
                    </div>

                    <div className={"chart2"}>
                        <DoughnutChartCard />
                    </div>
                </div>
                <div className={'secondStatik'}>
                    <div className={'chart3'}>
                        <MonthlyOrdersChart allData={allData} />

                    </div>

                </div>
                <div className={'thirdStatik'}>
                    <div className={'chart4'}>
                        <img src={drop5} alt="Statistikalar"/>
                    </div>
                    <div className={'chart5'}>
                        <img src={drop6} alt="Statistikalar"/>
                    </div>
                </div>
                <div className={'fourStatik'}>
                    <div className={'chart6'}>
                        <img src={drop7} alt="Statistikalar"/>
                    </div>
                    <div className={'chart7'}>
                        <img src={drop8} alt="Statistikalar"/>
                    </div>
                </div>
                <div className={'fifthStatik'}>
                    <div className={'chart8'}>
                        <img src={drop9} alt="Statistikalar"/>
                    </div>
                    <div className={'chart9'}>
                        <img src={drop10} alt="Statistikalar"/>
                    </div>
                </div>
                <div className={'sixStatik'}>
                    <div className={'chart10'}>
                        <img src={drop11} alt="Statistikalar"/>
                    </div>
                    <div className={"staticc"}>
                        <div className={'chart11'}>
                            <img src={drop12} alt="Statistikalar"/>
                        </div>
                        <div className={'chart12'}>
                            <img src={drop13} alt="Statistikalar"/>
                        </div>
                    </div>
                </div>
                <div className={'sevenStatik'}>
                    <div className={'chart13'}>
                        <img src={drop14} alt="Statistikalar"/>
                    </div>
                    <div className={'chart14'}>
                        <img src={drop15} alt="Statistikalar"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuperAdminStatistikTest;