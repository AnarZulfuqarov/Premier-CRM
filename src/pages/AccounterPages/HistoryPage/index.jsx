import { useEffect, useMemo, useState } from "react";
import "./index.scss";
import {
    useGetAllCompaniesQuery,
    useGetAllVendorsIdQuery,
    useGetCompanyIdQuery,
    useGetDateBasedPaymentByDateQuery,
} from "../../../services/adminApi.jsx";
import { NavLink, useParams } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const INVALID_MIN_DATES = new Set([
    "01.01.0001",
    "0001-01-01",
    "0001-01-01T00:00:00",
    "1/1/0001",
    "0001-01-01 00:00:00",
]);

function parseAppDate(input) {
    if (!input) return null;
    if (typeof input === "string") {
        const s = input.trim();
        if (!s || INVALID_MIN_DATES.has(s)) return null;
        const m1 = /^(\d{2})\/(\d{2})\/(\d{2})$/.exec(s);
        if (m1) {
            const [, mm, dd, yy] = m1;
            const yyyy = `20${yy}`;
            return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
        }
        const d = new Date(s);
        return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
}

function formatToAZDate(dateStr) {
    if (!dateStr) return "";
    const date = parseAppDate(dateStr);
    if (!date || isNaN(date)) return "";
    const dd = String(date.getDate()).padStart(2, "0");
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}.${MM}.${yyyy}`;
}

const OrderHistoryAccounter = () => {
    const { date } = useParams();
    const [vendorId, setVendorId] = useState(() => localStorage.getItem("vendorId") || "");
    const [borcCompanyId, setBorcCompanyId] = useState(() => localStorage.getItem("borcCompanyId") || "");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeSearch, setActiveSearch] = useState(null); // Tracks which column is being searched

    const { data: getAllCompanies } = useGetCompanyIdQuery(borcCompanyId);
    const companies = getAllCompanies?.data || [];
    const { data: getAllVendorsId } = useGetAllVendorsIdQuery(vendorId);
    const vendors = getAllVendorsId?.data || [];
    const formattedDate = formatToAZDate(date);
    const { data: paymentData, isFetching } = useGetDateBasedPaymentByDateQuery({
        companyId: borcCompanyId,
        vendorId: vendorId,
        date: date,
    });

    const [allOrders, setAllOrders] = useState([]);

    useEffect(() => {
        if (!paymentData?.data) return;
        setAllOrders(paymentData.data);
    }, [paymentData]);

    const orders = useMemo(() => {
        const list = allOrders ?? [];
        return list.map((order) => ({
            id: String(order.orderId || ""),
            supplier: order.fighterName || "—",
            customer: order.customerName || "—",
            product: order.productName || "—",
            category: order.category || "—",
            price: Number(order.price || 0).toFixed(2),
            priceNum: Number(order.price || 0),
            requiredQuantity: Number(order.requiredQuantity || 0).toFixed(2),
            suppliedQuantity: Number(order.suppliedQuantity || 0).toFixed(2),
            orderAmount: Number(order.orderAmount || 0).toFixed(2),
            orderCreatedDate: order.orderCreatedDate || "",
            orderDeliveryDate: order.orderDeliveryDate || "",
        }));
    }, [allOrders]);

    const filteredOrders = useMemo(() => {
        let list = [...orders];
        if (searchTerm.trim() && activeSearch) {
            const q = searchTerm.toLowerCase();
            list = list.filter((o) => {
                const value = String(o[activeSearch] ?? "").toLowerCase();
                return value.includes(q);
            });
        }
        return list;
    }, [orders, searchTerm, activeSearch]);

    // Helper function to render table header with search
    const renderTableHeader = (label, field) => (
        <th>
            {activeSearch === field ? (
                <div className="th-search">
                    <input
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Axtar..."
                    />
                    <FaTimes onClick={() => { setActiveSearch(null); setSearchTerm(""); }} />
                </div>
            ) : (
                <div className="th-label">
                    {label}
                    <svg
                        onClick={() => setActiveSearch(field)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                    >
                        <path
                            d="M20.71 19.3252L17.31 15.9352C18.407 14.5376 19.0022 12.8118 19 11.0352C19 9.45291 18.5308 7.90619 17.6518 6.5906C16.7727 5.275 15.5233 4.24962 14.0615 3.64412C12.5997 3.03862 10.9911 2.8802 9.43928 3.18888C7.88743 3.49756 6.46197 4.25949 5.34315 5.37831C4.22433 6.49713 3.4624 7.92259 3.15372 9.47444C2.84504 11.0263 3.00347 12.6348 3.60897 14.0966C4.21447 15.5584 5.23985 16.8079 6.55544 17.6869C7.87103 18.566 9.41775 19.0352 11 19.0352C12.7767 19.0374 14.5025 18.4421 15.9 17.3452L19.29 20.7452C19.383 20.8389 19.4936 20.9133 19.6154 20.9641C19.7373 21.0148 19.868 21.041 20 21.041C20.132 21.041 20.2627 21.0148 20.3846 20.9641C20.5064 20.9133 20.617 20.8389 20.71 20.7452C20.8037 20.6522 20.8781 20.5416 20.9289 20.4197C20.9797 20.2979 21.0058 20.1672 21.0058 20.0352C21.0058 19.9031 20.9797 19.7724 20.9289 19.6506C20.8781 19.5287 20.8037 19.4181 20.71 19.3252ZM5 11.0352C5 9.84847 5.3519 8.68843 6.01119 7.70174C6.67047 6.71504 7.60755 5.94601 8.7039 5.49188C9.80026 5.03776 11.0067 4.91894 12.1705 5.15045C13.3344 5.38196 14.4035 5.9534 15.2426 6.79252C16.0818 7.63163 16.6532 8.70073 16.8847 9.86462C17.1162 11.0285 16.9974 12.2349 16.5433 13.3313C16.0892 14.4276 15.3201 15.3647 14.3334 16.024C13.3467 16.6833 12.1867 17.0352 11 17.0352C9.4087 17.0352 7.88258 16.403 6.75736 15.2778C5.63214 14.1526 5 12.6265 5 11.0352Z"
                            fill="#7A7A7A"
                        />
                    </svg>
                </div>
            )}
        </th>
    );

    return (
        <div className="order-history-accounter-main">
            <div className="order-history-accounter">
                {/* Başlıq */}
                <div className="headerr">
                    <div className="head">
                        <h2>Sifariş detalları</h2>
                        <p>Siz buradan borcunuzun hansı məhsullardan yarandığına baxa bilərsiniz.</p>
                    </div>
                    <div className="borcDiv">
                        <div className="borcDivMain">
                            <div className="borcIcon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="17"
                                    height="17"
                                    viewBox="0 0 17 17"
                                    fill="none"
                                >
                                    <path
                                        d="M9.5 7.03516C9.5 7.56559 9.28929 8.0743 8.91421 8.44937C8.53914 8.82444 8.03043 9.03516 7.5 9.03516C6.96957 9.03516 6.46086 8.82444 6.08579 8.44937C5.71071 8.0743 5.5 7.56559 5.5 7.03516C5.5 6.50472 5.71071 5.99602 6.08579 5.62094C6.46086 5.24587 6.96957 5.03516 7.5 5.03516C8.03043 5.03516 8.53914 5.24587 8.91421 5.62094C9.28929 5.99602 9.5 6.50472 9.5 7.03516ZM8.5 7.03516C8.5 6.76994 8.39464 6.51559 8.20711 6.32805C8.01957 6.14051 7.76522 6.03516 7.5 6.03516C7.23478 6.03516 6.98043 6.14051 6.79289 6.32805C6.60536 6.51559 6.5 6.76994 6.5 7.03516C6.5 7.30037 6.60536 7.55473 6.79289 7.74226C6.98043 7.9298 7.23478 8.03516 7.5 8.03516C7.76522 8.03516 8.01957 7.9298 8.20711 7.74226C8.39464 7.55473 8.5 7.30037 8.5 7.03516ZM1.5 4.28516C1.5 3.59516 2.06 3.03516 2.75 3.03516H12.25C12.94 3.03516 13.5 3.59516 13.5 4.28516V9.78516C13.5 10.4752 12.94 11.0352 12.25 11.0352H2.75C2.06 11.0352 1.5 10.4752 1.5 9.78516V4.28516ZM2.75 4.03516C2.6837 4.03516 2.62011 4.0615 2.57322 4.10838C2.52634 4.15526 2.5 4.21885 2.5 4.28516V5.03516H3C3.13261 5.03516 3.25979 4.98248 3.35355 4.88871C3.44732 4.79494 3.5 4.66776 3.5 4.53516V4.03516H2.75ZM2.5 9.78516C2.5 9.92316 2.612 10.0352 2.75 10.0352H3.5V9.53516C3.5 9.40255 3.44732 9.27537 3.35355 9.1816C3.25979 9.08783 3.13261 9.03516 3 9.03516H2.5V9.78516ZM4.5 9.53516V10.0352H10.5V9.53516C10.5 9.13733 10.658 8.7558 10.9393 8.4745C11.2206 8.19319 11.6022 8.03516 12 8.03516H12.5V6.03516H12C11.6022 6.03516 11.2206 5.87712 10.9393 5.59582C10.658 5.31451 10.5 4.93298 10.5 4.53516V4.03516H4.5V4.53516C4.5 4.93298 4.34196 5.31451 4.06066 5.59582C3.77936 5.87712 3.39782 6.03516 3 6.03516H2.5V8.03516H3C3.39782 8.03516 3.77936 8.19319 4.06066 8.4745C4.34196 8.7558 4.5 9.13733 4.5 9.53516ZM11.5 10.0352H12.25C12.3163 10.0352 12.3799 10.0088 12.4268 9.96193C12.4737 9.91505 12.5 9.85146 12.5 9.78516V9.03516H12C11.8674 9.03516 11.7402 9.08783 11.6464 9.1816C11.5527 9.27537 11.5 9.40255 11.5 9.53516V10.0352ZM12.5 5.03516V4.28516C12.5 4.21885 12.4737 4.15526 12.4268 4.10838C12.3799 4.0615 12.3163 4.03516 12.25 4.03516H11.5V4.53516C11.5 4.66776 11.5527 4.79494 11.6464 4.88871C11.7402 4.98248 11.8674 5.03516 12 5.03516H12.5ZM5 13.0352C4.68322 13.0353 4.37453 12.9351 4.11818 12.749C3.86184 12.5629 3.67099 12.3004 3.573 11.9992C3.71167 12.0232 3.854 12.0352 4 12.0352H12.25C12.8467 12.0352 13.419 11.7981 13.841 11.3761C14.2629 10.9542 14.5 10.3819 14.5 9.78516V5.12016C14.7926 5.2236 15.0459 5.41524 15.225 5.66867C15.4041 5.92209 15.5002 6.22483 15.5 6.53516V9.78516C15.5 10.212 15.4159 10.6346 15.2526 11.0289C15.0893 11.4232 14.8499 11.7815 14.5481 12.0833C14.2463 12.385 13.888 12.6244 13.4937 12.7878C13.0994 12.9511 12.6768 13.0352 12.25 13.0352H5Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                            <div className="borcText">
                                <h5>
                                    {(paymentData?.data?.reduce((sum, item) => sum + (item.orderAmount || 0), 0) || 0).toFixed(2)} ₼
                                </h5>
                                <p>Ümumi borc</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Breadcrumb */}
                <div className="root">
                    <h2>
                        <NavLink className="link" to="/accounter/borc">
                            — Şirkətlər
                        </NavLink>
                        <NavLink className="link" to={`/accounter/borc/${borcCompanyId}`}>
                            — {companies?.name} ({vendors?.name})
                        </NavLink>
                        <NavLink className="link" to={`/accounter/borc/vendor/${vendorId}`}>
                            — Borc Tarixçəsi
                        </NavLink>
                        — (Borc)
                    </h2>
                </div>

                {/* Cədvəl */}
                <div className="table-wrapper">
                    <div className="table-scroll">
                        <table className="orders-table">
                            <thead>
                            <tr>
                                {renderTableHeader("Order ID", "id")}
                                {renderTableHeader("Təchizatçının adı", "supplier")}
                                {renderTableHeader("Sifarişçinin adı", "customer")}
                                {renderTableHeader("Məhsulun adı", "product")}
                                {renderTableHeader("Kateqoriya", "category")}
                                <th>Məhsulun qiyməti</th>
                                <th>Tələb olunan miqdar</th>
                                <th>Təmin olunan miqdar</th>
                                <th>Ümumi məbləğ</th>
                                {renderTableHeader("Sifarişin yaradılma tarixi", "orderCreatedDate")}
                                {renderTableHeader("Çatdırılma tarixi", "orderDeliveryDate")}
                            </tr>
                            </thead>

                            <tbody>
                            {isFetching ? (
                                <tr>
                                    <td colSpan={11} style={{ textAlign: "center" }}>
                                        Yüklənir...
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={11} style={{ textAlign: "center" }}>
                                        Məlumat yoxdur
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((item, i) => {
                                    const orderIdParts = item.id.split("-");
                                    const firstThree = orderIdParts[0].slice(0, 3); // İlk 3 karakter
                                    const middleThree = orderIdParts[1].slice(1, 4); // Ortadaki 3 karakter (4d7)
                                    const lastThree = orderIdParts[4].slice(-3); // Sondan 3 karakter
                                    const formattedOrderId = `${firstThree}-${middleThree}-${lastThree}`;

                                    return (
                                        <tr key={i}>
                                            <td>{formattedOrderId}</td>
                                            <td>{item.supplier}</td>
                                            <td>{item.customer}</td>
                                            <td>{item.product}</td>
                                            <td>{item.category}</td>
                                            <td>{item.price} ₼</td>
                                            <td>{item.requiredQuantity}</td>
                                            <td>{item.suppliedQuantity}</td>
                                            <td>{item.orderAmount} ₼</td>
                                            <td>{formatToAZDate(item.orderCreatedDate)}</td>
                                            <td>{formatToAZDate(item.orderDeliveryDate)}</td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>

                        {/* Footer */}

                    </div>
                    <div className="table-footer sticky-footer">
                        <span>Ümumi məbləğ:</span>
                        <span>
                {`${filteredOrders
                    .reduce((sum, item) => sum + (Number(item.orderAmount) || 0), 0)
                    .toFixed(2)} ₼`}
              </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryAccounter;