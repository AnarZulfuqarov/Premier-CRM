import { useEffect, useMemo, useRef, useState } from "react";
import "./index.scss";
import {
    useGetAllCompaniesQuery,
    useGetDateBasedPaymentByDateQuery, // Yeni query
} from "../../../services/adminApi.jsx";
import { NavLink, useNavigate, useParams } from "react-router-dom";
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
        const m1 =
            /^(\d{2})\.(\d{2})\.(\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(s);
        if (m1) {
            const [, dd, mm, yyyy, hh = "00", mi = "00", ss = "00"] = m1;
            return new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(mi), Number(ss));
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

function getQuickRange(label) {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);
    const dow = now.getDay() || 7;
    if (label === "Bugün") {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
    } else if (label === "Dünən") {
        start.setDate(now.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(now.getDate() - 1);
        end.setHours(23, 59, 59, 999);
    } else if (label === "Bu həftə") {
        start.setDate(now.getDate() - (dow - 1));
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
    } else if (label === "Keçən həftə") {
        start.setDate(now.getDate() - (dow - 1) - 7);
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
    } else if (label === "Bu ay") {
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(now.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
    } else if (label === "Keçən ay") {
        start.setMonth(now.getMonth() - 1, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(now.getMonth(), 0);
        end.setHours(23, 59, 59, 999);
    } else return [null, null];
    return [start, end];
}

const OrderHistoryAccounter = () => {
    const navigate = useNavigate();
    const { date } = useParams(); // Tarixi URL-dən alırıq
    const [vendorId, setVendorId] = useState(() => localStorage.getItem("vendorId") || "");
    const [borcCompanyId, setBorcCompanyId] = useState(() => localStorage.getItem("borcCompanyId") || "");

    // State-lər
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("all");
    const [filter, setFilter] = useState("all");
    const [globalSearch, setGlobalSearch] = useState("");
    const [activeSearch, setActiveSearch] = useState(null);

    // Tarix filterləri
    const [dateFilterOpen, setDateFilterOpen] = useState(false);
    const [dateQuickF, setDateQuickF] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // Əlavə filtrlər
    const [statusFilterOpen, setStatusFilterOpen] = useState(false);
    const [statusF, setStatusF] = useState("");
    const [departmentF, setDepartmentF] = useState("");
    const [sectionF, setSectionF] = useState("");
    const [productF, setProductF] = useState("");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");

    // Registry-lər
    const sectionRegistryRef = useRef(new Map());
    const sectionToDepartmentRef = useRef(new Map());
    const seenIdsRef = useRef(new Set());

    // Companies
    const { data: getAllCompanies } = useGetAllCompaniesQuery();
    const companies = getAllCompanies?.data || [];

    // Companies-dən şirkət -> şöbə xəritəsi
    const companyToDepartments = useMemo(() => {
        const map = new Map();
        for (const c of companies) {
            const cname = c?.name || c?.companyName || "";
            const deps = (c?.departments || []).map((d) => d?.name).filter(Boolean);
            if (cname) map.set(cname, new Set(deps));
        }
        return map;
    }, [companies]);

    // name -> id xəritəsi
    const nameToId = useMemo(() => {
        const m = new Map();
        for (const c of companies) {
            const name = c?.name || c?.companyName || c?.title || "";
            const id = c?.id ?? c?.companyId ?? c?._id;
            if (name && id) m.set(name, String(id));
        }
        return m;
    }, [companies]);

    // Master department/section siyahıları
    const allDepartmentsMaster = useMemo(() => {
        const all = new Set();
        for (const set of companyToDepartments.values()) for (const d of set) all.add(d);
        return Array.from(all).sort();
    }, [companyToDepartments]);

    // Data çəkilməsi
    const formattedDate = formatToAZDate(date);
    const { data: paymentData, isFetching } = useGetDateBasedPaymentByDateQuery(
        {
            companyId: borcCompanyId,
            vendorId: vendorId,
            date: formattedDate,
        },
        { skip: !vendorId || !borcCompanyId || !formattedDate }
    );

    // Yığıcı state
    const [allOrders, setAllOrders] = useState([]);

    // Data işlənməsi
    useEffect(() => {
        if (!paymentData?.data) return;

        setAllOrders((prev) => {
            const base = prev;
            seenIdsRef.current = new Set();
            const next = [];
            for (const it of paymentData.data) {
                const id = String(it?.id || "");
                if (!id || seenIdsRef.current.has(id)) continue;
                seenIdsRef.current.add(id);
                next.push(it);
            }
            return next;
        });

        // Section registry-ni update et
        const reg = sectionRegistryRef.current;
        const s2d = sectionToDepartmentRef.current;
        for (const o of paymentData.data) {
            const compName = o?.companyName || "";
            const sec = o?.section?.name || "";
            const dep = o?.section?.departmentName || "";
            if (compName && sec) {
                if (!reg.has(compName)) reg.set(compName, new Set());
                reg.get(compName).add(sec);
            }
            if (sec && dep && !s2d.has(sec)) s2d.set(sec, dep);
        }
    }, [paymentData]);

    // Orders mapping
    const orders = useMemo(() => {
        const list = allOrders ?? [];
        return list.map((order) => {
            const isPaid = order.paymentAmount > 0 && order.remainingDebt === 0;
            const isUnpaid = order.remainingDebt > 0;

            let status = "";
            if (isPaid) status = "Ödənilib";
            else if (isUnpaid) status = "Ödənilməyib";
            else status = "—";

            return {
                id: String(order.id || ""),
                product: order.invoices?.join(", ") || "—", // Fakturalar məhsul kimi göstərilir
                productSingle: order.invoices?.[0] || "—",
                itemCount: order.invoices?.length || 0,
                status,
                price: Number(order.paymentAmount || 0).toFixed(2),
                priceNum: Number(order.paymentAmount || 0),
                customer: order.vendorName || "—",
                supplier: order.vendorName || "—",
                paymentStatus: status,
                companyName: order.companyName || "—",
                companyId: String(order.companyId || ""),
                department: order.section?.departmentName || "",
                section: order.section?.name || "",
                deliveredAt: order.paymentDate || "",
                order, // raw
            };
        });
    }, [allOrders]);

    // Dinamik dropdown siyahıları
    const departmentsFromData = useMemo(
        () => Array.from(new Set(orders.map((o) => o.department).filter(Boolean))).sort(),
        [orders]
    );
    const sectionsFromData = useMemo(
        () => Array.from(new Set(orders.map((o) => o.section).filter(Boolean))).sort(),
        [orders]
    );

    // Relations
    const relations = useMemo(() => {
        const departmentToCompany = new Map();
        for (const [cname, deps] of companyToDepartments.entries()) {
            for (const d of deps) if (!departmentToCompany.has(d)) departmentToCompany.set(d, cname);
        }
        const sectionToCompany = new Map();
        const reg = sectionRegistryRef.current;
        for (const [cname, secs] of reg.entries()) {
            for (const s of secs) if (!sectionToCompany.has(s)) sectionToCompany.set(s, cname);
        }
        return {
            companyToDepartments,
            sectionRegistry: reg,
            departmentToCompany,
            sectionToCompany,
            sectionToDepartment: sectionToDepartmentRef.current,
        };
    }, [companyToDepartments, allOrders]);

    // Filtr nəticəsi
    const filteredOrders = useMemo(() => {
        let list = [...orders];

        if (globalSearch.trim()) {
            const q = globalSearch.trim().toLowerCase();
            list = list.filter((o) =>
                [o.id, o.product, o.customer, o.supplier, o.companyName, o.status]
                    .map((v) => String(v ?? "").toLowerCase())
                    .some((s) => s.includes(q))
            );
        }

        if (searchTerm.trim()) {
            const qs = searchTerm.toLowerCase();
            list = list.filter(
                (o) => o.id.toLowerCase().includes(qs) || (o.product || "").toLowerCase().includes(qs)
            );
        }

        if (filter !== "all") {
            list = list.filter(
                (o) =>
                    (filter === "unpaid" && o.status === "Ödənilməyib") ||
                    (filter === "paid" && o.status === "Ödənilib")
            );
        }

        if (selectedCompany !== "all") {
            list = list.filter((o) => o.companyName === selectedCompany);
        }

        if (departmentF) list = list.filter((o) => o.department === departmentF);
        if (sectionF) list = list.filter((o) => o.section === sectionF);
        if (productF) list = list.filter((o) => o.productSingle === productF);
        if (statusF) list = list.filter((o) => o.status === statusF);

        let from = dateFrom ? new Date(dateFrom) : null;
        let to = dateTo ? new Date(dateTo) : null;
        if (dateQuickF) {
            const [qs, qe] = getQuickRange(dateQuickF);
            from = qs;
            to = qe;
        }
        if (from || to) {
            list = list.filter((o) => {
                const d = parseAppDate(o.deliveredAt);
                if (!d) return false;
                if (from && d < from) return false;
                if (to) {
                    const t = new Date(to);
                    t.setHours(23, 59, 59, 999);
                    if (d > t) return false;
                }
                return true;
            });
        }

        const pMin = priceMin !== "" ? Number(priceMin) : null;
        const pMax = priceMax !== "" ? Number(priceMax) : null;
        if (pMin !== null && !Number.isNaN(pMin)) list = list.filter((o) => o.priceNum >= pMin);
        if (pMax !== null && !Number.isNaN(pMax)) list = list.filter((o) => o.priceNum <= pMax);

        return list;
    }, [
        orders,
        globalSearch,
        searchTerm,
        filter,
        selectedCompany,
        departmentF,
        sectionF,
        productF,
        statusF,
        dateQuickF,
        dateFrom,
        dateTo,
        priceMin,
        priceMax,
    ]);

    return (
        <div className="order-history-accounter-main">
            <div className="order-history-accounter">
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
                                <h5>{(paymentData?.data?.reduce((sum, item) => sum + (item.totalDebt || 0), 0) || 325).toFixed(2)} ₼</h5>
                                <p>Ümumi borc</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="root">
                    <h2>
                        <NavLink className="link" to="/accounter/borc">
                            — Şirkətlər
                        </NavLink>{" "}
                        — (Borc)
                    </h2>
                </div>

                {/* ==== CƏDVƏL ==== */}
                <div className="table-wrapper">
                    <div className="table-scroll">
                        <table className="orders-table">
                            <thead>
                            <tr>
                                <th>
                                    {activeSearch === "id" ? (
                                        <div className="th-search">
                                            <input
                                                autoFocus
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Axtar..."
                                            />
                                            <FaTimes
                                                onClick={() => {
                                                    setActiveSearch(null);
                                                    setSearchTerm("");
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="th-label">
                                            Order İD
                                            <svg
                                                onClick={() => setActiveSearch("id")}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <path
                                                    d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
                                                    fill="#7A7A7A"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </th>
                                <th>
                                    {activeSearch === "vendor" ? (
                                        <div className="th-search">
                                            <input
                                                autoFocus
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Axtar..."
                                            />
                                            <FaTimes
                                                onClick={() => {
                                                    setActiveSearch(null);
                                                    setSearchTerm("");
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="th-label">
                                            Təchizatçının adı
                                            <svg
                                                onClick={() => setActiveSearch("vendor")}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <path
                                                    d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
                                                    fill="#7A7A7A"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </th>
                                <th>
                                    {activeSearch === "invoices" ? (
                                        <div className="th-search">
                                            <input
                                                autoFocus
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Axtar..."
                                            />
                                            <FaTimes
                                                onClick={() => {
                                                    setActiveSearch(null);
                                                    setSearchTerm("");
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="th-label">
                                            Fakturalar
                                            <svg
                                                onClick={() => setActiveSearch("invoices")}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <path
                                                    d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
                                                    fill="#7A7A7A"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </th>
                                <th>Ödəniş məbləği</th>
                                <th>Geri qaytarılan məbləğ</th>
                                <th>Ödəniş üsulu</th>
                                <th>Ödəniş tarixi</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {isFetching ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center" }}>
                                        Yüklənir...
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center" }}>
                                        Məlumat yoxdur
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((item, i) => (
                                    <tr key={item.id || i}>
                                        <td>{item.id}</td>
                                        <td>{item.supplier}</td>
                                        <td>{item.product}</td>
                                        <td>{item.price} ₼</td>
                                        <td>{Number(item.order.reverseAmount || 0).toFixed(2)} ₼</td>
                                        <td>{item.order.paymentMethod || "—"}</td>
                                        <td>{formatToAZDate(item.deliveredAt)}</td>
                                        <td>{item.status}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>

                        <div className="table-footer sticky-footer">
                            <span>Ümumi məbləğ:</span>
                            <span>
                {`${filteredOrders
                    .reduce((sum, item) => sum + (item.priceNum || 0), 0)
                    .toFixed(2)} ₼`}
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryAccounter;