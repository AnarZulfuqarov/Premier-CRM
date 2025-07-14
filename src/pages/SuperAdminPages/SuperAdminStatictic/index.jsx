import "./index.scss"
import drop1 from "/src/assets/statik1.png"
import drop2 from "/src/assets/statik2.png"
import drop3 from "/src/assets/statik3.png"
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

function SuperAdminStatistik() {
    return (
        <div id={"super-admin-static-main"}>
            <div className={'super-admin-static'}>
                <div className={'staticHead'}>
                    <div className={'content'}>
                        <h3>Statistikalar</h3>
                        <p>Sifarişlərin bütün mərhələlər üzrə vəziyyəti bu bölmədə əks olunur.</p>
                    </div>
                    <div className={'drop1'}>
                        <img src={drop1} alt="Statistikalar"/>
                    </div>
                </div>
                <div className={'firstStatik'}>
                    <div className={'chart1'}>
                        <img src={drop2} alt="Statistikalar"/>
                    </div>
                    <div className={'chart2'}>
                        <img src={drop3} alt="Statistikalar"/>
                    </div>
                </div>
                <div className={'secondStatik'}>
                    <div className={'chart3'}>
                        <img src={drop4} alt="Statistikalar"/>
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

export default SuperAdminStatistik;