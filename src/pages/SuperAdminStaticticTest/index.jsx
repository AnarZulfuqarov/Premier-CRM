import "./index.scss"

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
import ProductMonthlyTable from "../../components/Statistika/Cart3/index.jsx";
import OrdersTotalCountAmountTable from "../../components/Statistika/Cart4/index.jsx";
import OrdersSupplyStatusTable from "../../components/Statistika/Chart5/index.jsx";
import OrdersByStatusCountTable from "../../components/Statistika/Chart6/index.jsx";
ChartJS.register(ArcElement, Tooltip, Legend);
function SuperAdminStatistikTest() {
    const { data: getAllCompanies, isLoading } = useGetAllCompaniesQuery();
    const companies = getAllCompanies?.data;
    const [selectedBranch, setSelectedBranch] = useState("");

    // Component mount olanda localStorage-dan oxu
    useEffect(() => {
        const savedCompanyId = localStorage.getItem("selectedCompanyId");

        if (companies?.length > 0) {
            if (savedCompanyId) {
                setSelectedBranch(savedCompanyId);
            } else {
                const firstCompanyId = companies[0].id;
                setSelectedBranch(firstCompanyId);
                localStorage.setItem("selectedCompanyId", firstCompanyId);
            }
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
                    <ProductMonthlyTable companyId={selectedBranch} />
                </div>
                <div className={'thirdStatik'}>
                    <OrdersTotalCountAmountTable />

                </div>
                <div className={'fourStatik'}>
                    <div className={'chart6'}>
                        <OrdersSupplyStatusTable  />
                    </div>

                </div>
                <div className={'fifthStatik'}>
                    <OrdersByStatusCountTable  />
                </div>
                {/*<div className="sixStatik">*/}
                {/*    <div className="staticHead">*/}
                {/*        <div className="content">*/}
                {/*            <h3>Təchizat</h3>*/}
                {/*            <p>*/}
                {/*                Bu hissədə təchizat sifarişlərinin vəziyyəti və ümumi həcmi əks olunur.*/}
                {/*            </p>*/}
                {/*        </div>*/}
                {/*        <div className="dropdownSelect">*/}
                {/*            <select*/}
                {/*                value={selectedFighter}*/}
                {/*                onChange={handleFighterChange}*/}
                {/*                style={{*/}
                {/*                    border: "1px solid #ccc",*/}
                {/*                    borderRadius: 6,*/}
                {/*                    padding: "4px 12px",*/}
                {/*                    fontSize: 14,*/}
                {/*                    backgroundColor: "#f5f5f5",*/}
                {/*                    cursor: "pointer",*/}
                {/*                }}*/}
                {/*            >*/}
                {/*                <option value="">Techizatçı seçin</option>*/}
                {/*                {allFighters?.data?.map((fighter) => (*/}
                {/*                    <option key={fighter.id} value={fighter.id}>*/}
                {/*                        {fighter.name}*/}
                {/*                    </option>*/}
                {/*                ))}*/}
                {/*            </select>*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*    <div className="firstStatik"> /!* reuse the same layout structure *!/*/}
                {/*        <div className="chart2">*/}
                {/*            <DoughnutChartCard2*/}

                {/*            />*/}
                {/*        </div>*/}

                {/*        <div className="chart1">*/}
                {/*            <Chart11Card*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div className={'sevenStatik'}>*/}
                {/*    <StatusBasedBarChart  />*/}
                {/*</div>*/}
            </div>
        </div>
    );
}

export default SuperAdminStatistikTest;