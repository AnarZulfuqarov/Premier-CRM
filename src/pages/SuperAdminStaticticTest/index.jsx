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
import {useEffect, useState} from "react";
import DoughnutChartCard from "../../components/Statistika/Chart2/index.jsx";
import Chart1Card from "../../components/Statistika/Chart1/index.jsx";
import {useGetAllCompaniesQuery, useGetAllFightersQuery} from "../../services/adminApi.jsx";
import MonthlyOrdersChart from "../../components/Statistika/Cart3/index.jsx";
import Chart4 from "../../components/Statistika/Cart4/index.jsx";
import StatusBarChart from "../../components/Statistika/Chart5/index.jsx";
import ProductChart from "../../components/Statistika/Chart6/index.jsx";
import StatusBasedBarChart from "../../components/Statistika/Chart7/index.jsx";
import Chart11Card from "../../components/Statistika/Chart11/index.jsx";
import DoughnutChartCard2 from "../../components/Statistika/Chart22/index.jsx";
ChartJS.register(ArcElement, Tooltip, Legend);
function SuperAdminStatistikTest() {
    const { data: getAllCompanies, isLoading } = useGetAllCompaniesQuery();
    const companies = getAllCompanies?.data;
    const [selectedBranch, setSelectedBranch] = useState("");

    // Component mount olanda localStorage-dan oxu
    useEffect(() => {
        const savedCompanyId = localStorage.getItem("selectedCompanyId");
        if (savedCompanyId) {
            setSelectedBranch(savedCompanyId);
        } else if (companies.length > 0) {
            setSelectedBranch(companies[0].id); // default olaraq ilkini seç
        }
    }, [companies]);

    const handleCompanyChange = (e) => {
        const selectedId = e.target.value;
        setSelectedBranch(selectedId);
        localStorage.setItem("selectedCompanyId", selectedId); // localStorage-a yaz
    };

    const { data: allFighters, isLoading: loadingFighters } = useGetAllFightersQuery();
    const [selectedFighter, setSelectedFighter] = useState(
        localStorage.getItem("selectedFighterId") || ""
    );

// dəyişiklik zamanı həm state, həm localStorage yazılır
    const handleFighterChange = (e) => {
        const id = e.target.value;
        setSelectedFighter(id);
        localStorage.setItem("selectedFighterId", id);
    };
    const statusChartData = {
        2025: [
            { month: "Yanvar", pending: 28, canceled: 20, completed: 36 },
            { month: "Fevral", pending: 45, canceled: 20, completed: 60 },
            { month: "Mart", pending: 28, canceled: 20, completed: 36 },
            { month: "Aprel", pending: 30, canceled: 20, completed: 36 },
            { month: "May", pending: 30, canceled: 20, completed: 36 },
            { month: "İyun", pending: 30, canceled: 20, completed: 36 },
            { month: "İyul", pending: 45, canceled: 20, completed: 60 },
            { month: "Avqust", pending: 28, canceled: 20, completed: 36 },
            { month: "Sentyabr", pending: 45, canceled: 20, completed: 60 },
            { month: "Oktyabr", pending: 45, canceled: 70, completed: 30 },
            { month: "Noyabr", pending: 60, canceled: 30, completed: 18 },
            { month: "Dekabr", pending: 28, canceled: 20, completed: 36 },
        ],
    };
    const productData = {
        2025: [
            { month: "Yanvar", count: 38 },
            { month: "Fevral", count: 58 },
            { month: "Mart", count: 68 },
            { month: "Aprel", count: 39 },
            { month: "May", count: 29 },
            { month: "İyun", count: 68 },
            { month: "İyul", count: 38 },
            { month: "Avqust", count: 58 },
            { month: "Sentyabr", count: 68 },
            { month: "Oktyabr", count: 39 },
            { month: "Noyabr", count: 58 },
            { month: "Dekabr", count: 0 },
        ]
    };

    const barChartData = [
        { month: "Yanvar", pending: 28, completed: 33 },
        { month: "Fevral", pending: 46, completed: 58 },
        { month: "Mart", pending: 18, completed: 38 },
        { month: "Aprel", pending: 15, completed: 16 },
        { month: "May", pending: 44, completed: 67 },
        { month: "İyun", pending: 24, completed: 28 },
        { month: "İyul", pending: 58, completed: 33 },
        { month: "Avqust", pending: 28, completed: 33 },
        { month: "Sentyabr", pending: 49, completed: 61 },
        { month: "Oktyabr", pending: 14, completed: 15 },
        { month: "Noyabr", pending: 28, completed: 33 },
        { month: "Dekabr", pending: 39, completed: 48 },
    ];

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
                            <select value={selectedBranch} onChange={handleCompanyChange}>
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
                        <Chart1Card />
                    </div>

                    <div className={"chart2"}>
                        <DoughnutChartCard />
                    </div>
                </div>
                <div className={'secondStatik'}>
                    <div className={'chart3'}>
                        <MonthlyOrdersChart  />

                    </div>

                </div>
                <div className={'thirdStatik'}>
                    <div className={'chart4'}>
                        <Chart4 />
                    </div>

                </div>
                <div className={'fourStatik'}>
                    <div className={'chart6'}>
                        <StatusBarChart allData={statusChartData} />
                    </div>

                </div>
                <div className={'fifthStatik'}>
                    <ProductChart allData={productData} />
                </div>
                <div className="sixStatik">
                    <div className="staticHead">
                        <div className="content">
                            <h3>Təchizat</h3>
                            <p>
                                Bu hissədə təchizat sifarişlərinin vəziyyəti və ümumi həcmi əks olunur.
                            </p>
                        </div>
                        <div className="dropdownSelect">
                            <select
                                value={selectedFighter}
                                onChange={handleFighterChange}
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: 6,
                                    padding: "4px 12px",
                                    fontSize: 14,
                                    backgroundColor: "#f5f5f5",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="">Techizatçı seçin</option>
                                {allFighters?.data?.map((fighter) => (
                                    <option key={fighter.id} value={fighter.id}>
                                        {fighter.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="firstStatik"> {/* reuse the same layout structure */}
                        <div className="chart2">
                            <DoughnutChartCard2

                            />
                        </div>

                        <div className="chart1">
                            <Chart11Card
                            />
                        </div>
                    </div>
                </div>

                <div className={'sevenStatik'}>
                    <StatusBasedBarChart data={barChartData} />
                </div>
            </div>
        </div>
    );
}

export default SuperAdminStatistikTest;