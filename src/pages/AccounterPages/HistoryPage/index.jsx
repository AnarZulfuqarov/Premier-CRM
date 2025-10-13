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
import icon from "/src/assets/Group26.svg"
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
                            <div>
                                <img src={icon}/>
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