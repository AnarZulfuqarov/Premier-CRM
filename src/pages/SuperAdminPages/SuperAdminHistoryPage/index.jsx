import { useEffect, useRef, useState, useMemo } from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import {
    useGetAllCompaniesQuery,
    useGetOrderByPageQuery,
    useGetOrderByPageByCompanyQuery,
} from "../../../services/adminApi.jsx";

/* ==== Icons ==== */
const Caret = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M7 10l5 5 5-5" stroke="#444" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" stroke="#666" strokeWidth="1.6" />
    </svg>
);

/* ==== Safe Dropdown ==== */
function Dropdown({ label, value, onChange, options = [], placeholder = "Seç", width }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef(null);

    const safeOptions = useMemo(() => {
        if (Array.isArray(options)) return options;
        if (options && typeof options === "object") return Object.values(options);
        return [];
    }, [options]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return safeOptions;
        return safeOptions.filter((o) => String(o).toLowerCase().includes(q));
    }, [safeOptions, query]);

    useEffect(() => {
        const onDocClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const selectAndClose = (val) => {
        onChange(val);
        setOpen(false);
        setQuery("");
    };

    return (
        <div className={`filter-dd ${open ? "open" : ""}`} ref={ref} style={{ width }}>
            <button type="button" className={`dd-btn ${value ? "filled" : ""}`} onClick={() => setOpen((s) => !s)}>
                <span>{value || label}</span>
                <Caret />
            </button>

            {open && (
                <div className="dd-panel">
                    <div className="dd-search">
                        <input placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} />
                    </div>
                    <div className="dd-list">
                        <div className={`dd-item ${value === "" ? "active" : ""}`} onClick={() => selectAndClose("")}>
                            Hamısı
                        </div>
                        {filtered.map((opt) => (
                            <div key={String(opt)} className={`dd-item ${opt === value ? "active" : ""}`} onClick={() => selectAndClose(opt)}>
                                {opt}
                            </div>
                        ))}
                        {filtered.length === 0 && <div className="dd-empty">Nəticə tapılmadı</div>}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ==== Helpers ==== */
const parseAZDate = (s) => {
    if (!s) return null;
    const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(s).trim());
    if (!m) return new Date(s);
    const [, dd, MM, yyyy] = m;
    return new Date(`${yyyy}-${MM}-${dd}T00:00:00`);
};

const OrderHistorySuperAdmin = () => {
    const navigate = useNavigate();

    /* ===== Companies (safe) ===== */
    const { data: getAllCompanies } = useGetAllCompaniesQuery();
    const companies = useMemo(() => {
        const arr = Array.isArray(getAllCompanies?.data) ? getAllCompanies.data : [];
        return arr.map((c) => c?.name).filter(Boolean);
    }, [getAllCompanies]);

    /* ===== Paging + accumulation ===== */
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [allOrders, setAllOrders] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const [selectedCompany, setSelectedCompany] = useState(""); // "" = Hamısı

    const {
        data: allPagedRes,
        isFetching: isFetchingAll,
    } = useGetOrderByPageQuery(
        { page, pageSize },
        { skip: !!selectedCompany }
    );

    const {
        data: byCompanyRes,
        isFetching: isFetchingByCompany,
    } = useGetOrderByPageByCompanyQuery(
        { page, pageSize, companyName: selectedCompany || "all" },
        { skip: !selectedCompany }
    );

    const isFetching = selectedCompany ? isFetchingByCompany : isFetchingAll;
    const pageData = useMemo(() => {
        const raw = selectedCompany ? byCompanyRes?.data : allPagedRes?.data;
        return Array.isArray(raw) ? raw : [];
    }, [selectedCompany, byCompanyRes, allPagedRes]);

    useEffect(() => {
        setAllOrders([]);
        setPage(1);
        setHasMore(true);
    }, [selectedCompany]);

    useEffect(() => {
        if (!isFetching) {
            if (page === 1 && pageData.length === 0) {
                setAllOrders([]);
                setHasMore(false);
                return;
            }
            if (pageData.length) {
                setAllOrders((prev) => {
                    const seen = new Set(prev.map((o) => o.id ?? JSON.stringify(o)));
                    const next = pageData.filter((o) => !seen.has(o.id ?? JSON.stringify(o)));
                    return [...prev, ...next];
                });
                if (pageData.length < pageSize) setHasMore(false);
            } else if (page > 1) {
                setHasMore(false);
            }
        }
    }, [pageData, isFetching, page, pageSize]);

    // IntersectionObserver
    const listRef = useRef(null);
    const sentinelRef = useRef(null);

    useEffect(() => {
        const rootEl = listRef.current;
        const target = sentinelRef.current;
        if (!rootEl || !target) return;

        let ticking = false;
        const io = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !isFetching && hasMore && !ticking) {
                    ticking = true;
                    setPage((p) => p + 1);
                    setTimeout(() => {
                        ticking = false;
                    }, 350);
                }
            },
            {
                root: rootEl,
                rootMargin: "200px 0px",
                threshold: 0.01,
            }
        );

        io.observe(target);
        return () => io.disconnect();
    }, [isFetching, hasMore, selectedCompany]);

    /* ===== Top/Chip filters ===== */
    const [globalSearch, setGlobalSearch] = useState("");
    const [departmentF, setDepartmentF] = useState("");
    const [sectionF, setSectionF] = useState("");
    const [statusF, setStatusF] = useState("");
    const [dateQuickF, setDateQuickF] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [productF, setProductF] = useState("");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");

    const quickDateOptions = ["Bugün", "Dünən", "Bu həftə", "Keçən həftə", "Bu ay", "Keçən ay"];
    const statusOptions = ["Təchizatçıdan təsdiq gözləyən", "Sifarişçidən təhvil gözləyən", "Tamamlanmış"];

    const getQuickRange = (label) => {
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
    };

    /* ===== Shape data (safe) ===== */
    const shaped = useMemo(() => {
        const src = Array.isArray(allOrders) ? allOrders : [];
        return src.map((order) => {
            let status = "";
            if (order.employeeConfirm && order.fighterConfirm && order.employeeDelivery) status = "Tamamlanmış";
            else if (order.employeeConfirm && order.fighterConfirm) status = "Sifarişçidən təhvil gözləyən";
            else if (order.employeeConfirm && !order.fighterConfirm) status = "Təchizatçıdan təsdiq gözləyən";

            const items = Array.isArray(order.items) ? order.items : [];
            const totalPrice =
                items.reduce((sum, item) => sum + (Number(item?.suppliedQuantity ?? 0) * Number(item?.price ?? 0)), 0) ?? 0;

            const productNames = Array.from(new Set(items.map((i) => i?.product?.name).filter(Boolean)));

            return {
                id: order?.id, // full ID (naviqasiya üçün)
                orderIdShort: String(order?.id ?? "").slice(0, 8), // qısa göstərim üçün
                createdAt: parseAZDate(order?.createdDate),
                createdDateText: order?.createdDate || "",
                companyName: order?.section?.companyName ?? "",
                amountNum: +(+totalPrice).toFixed(2),
                amountText: `${(+totalPrice).toFixed(2)} ₼`,
                customer: `${order?.adminInfo?.name ?? ""} ${order?.adminInfo?.surname ?? ""}`.trim(),
                supplier: `${order?.fighterInfo?.name ?? ""} ${order?.fighterInfo?.surname ?? ""}`.trim(),
                status,
                department: order?.section?.departmentName ?? "",
                section: order?.section?.name ?? "",
                products: productNames,
            };
        });
    }, [allOrders]);

    // dynamic option lists
    const departments = useMemo(() => {
        const arr = Array.isArray(shaped) ? shaped : [];
        return Array.from(new Set(arr.map((o) => o?.department).filter(Boolean))).sort();
    }, [shaped]);

    const sections = useMemo(() => {
        const arr = Array.isArray(shaped) ? shaped : [];
        return Array.from(new Set(arr.map((o) => o?.section).filter(Boolean))).sort();
    }, [shaped]);

    const products = useMemo(() => {
        const arr = Array.isArray(shaped) ? shaped : [];
        return Array.from(new Set(arr.flatMap((o) => o?.products || []).filter(Boolean))).sort();
    }, [shaped]);

    /* ===== Filtering ===== */
    const filtered = useMemo(() => {
        let list = Array.isArray(shaped) ? [...shaped] : [];

        if (globalSearch.trim()) {
            const q = globalSearch.trim().toLowerCase();
            list = list.filter(
                (r) =>
                    String(r.companyName ?? "").toLowerCase().includes(q) ||
                    String(r.customer ?? "").toLowerCase().includes(q) ||
                    String(r.supplier ?? "").toLowerCase().includes(q) ||
                    String(r.status ?? "").toLowerCase().includes(q) ||
                    String(r.amountText ?? "").toLowerCase().includes(q) ||
                    String(r.amountNum ?? "").includes(q) ||
                    (Array.isArray(r.products) && r.products.some((p) => String(p).toLowerCase().includes(q))) ||
                    String(r.id ?? "").toLowerCase().includes(q) // ID ilə də axtarış ola bilsin
            );
        }

        if (statusF) list = list.filter((r) => r.status === statusF);
        if (departmentF) list = list.filter((r) => r.department === departmentF);
        if (sectionF) list = list.filter((r) => r.section === sectionF);
        if (productF) list = list.filter((r) => Array.isArray(r.products) && r.products.includes(productF));

        // date quick / range
        let from = dateFrom ? new Date(dateFrom) : null;
        let to = dateTo ? new Date(dateTo) : null;
        if (dateQuickF) {
            const [qs, qe] = getQuickRange(dateQuickF);
            from = qs;
            to = qe;
        }
        if (from || to) {
            list = list.filter((r) => {
                const d = r.createdAt ? new Date(r.createdAt) : null;
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

        // price range
        const pMin = priceMin !== "" ? Number(priceMin) : null;
        const pMax = priceMax !== "" ? Number(priceMax) : null;
        if (pMin !== null) list = list.filter((r) => r.amountNum >= pMin);
        if (pMax !== null) list = list.filter((r) => r.amountNum <= pMax);

        return list;
    }, [shaped, globalSearch, statusF, departmentF, sectionF, productF, dateQuickF, dateFrom, dateTo, priceMin, priceMax]);

    /* ===== Render ===== */
    return (
        <div className="order-history-super-admin-main">
            <div className="order-history-super-admin">
                <h2>Tarixçə</h2>
                <p>Sifarişlərin bütün mərhələlər üzrə vəziyyəti bu bölmədə əks olunur.</p>

                {/* ==== TOP BAR ==== */}
                <div className="filterbar">
                    <div className="searchbox">
                        <SearchIcon />
                        <input
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            placeholder="Axtarış edin..."
                        />
                    </div>

                    <Dropdown
                        label="Status seç"
                        value={statusF}
                        onChange={setStatusF}
                        options={["Təchizatçıdan təsdiq gözləyən", "Sifarişçidən təhvil gözləyən", "Tamamlanmış"]}
                        placeholder="Status"
                        width="200px"
                    />
                </div>

                {/* ==== CHIP/FILTER ROW ==== */}
                <div className="filter-row">
                    <Dropdown
                        label="Şirkət seçin"
                        value={selectedCompany}
                        onChange={(v) => setSelectedCompany(v || "")}
                        options={companies}
                        placeholder="Şirkət"
                    />
                    <Dropdown label="Şöbə seç" value={departmentF} onChange={setDepartmentF} options={departments} />
                    <Dropdown label="Bölmə seç" value={sectionF} onChange={setSectionF} options={sections} />
                    <Dropdown label="Tarix seç" value={dateQuickF} onChange={setDateQuickF} options={quickDateOptions} />

                    <div className="range-dd">
                        <div className="range-label">Tarix aralığı seç</div>
                        <div className="range-row">
                            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                            <span>—</span>
                            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                        </div>
                    </div>

                    <Dropdown label="Məhsul seç" value={productF} onChange={setProductF} options={products} />

                    <div className="range-dd">
                        <div className="range-label">Qiymət aralığı seç</div>
                        <div className="range-row">
                            <input type="number" min="0" placeholder="min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
                            <span>—</span>
                            <input type="number" min="0" placeholder="max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* ==== TABLE ==== */}
                <div className="order-history-super-admin__table-wrap" ref={listRef}>
                    <table className="ohsa-table">
                        <thead>
                        <tr>
                            <th>Tarixi</th>
                            <th>Şirkət adı</th>
                            <th>Ümumi məbləğ</th>
                            <th>Sifarişçinin adı</th>
                            <th>Təchizatçının adı</th>
                            <th>Order ID</th>
                            <th className="status-col">Status</th>
                            <th className="sticky-right">Sifariş detalı</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((o, i) => (
                            <tr key={o.id ?? i} onClick={() => navigate(`/superAdmin/history/${o.id}`)}>
                                <td>{o.createdDateText}</td>
                                <td>{o.companyName}</td>
                                <td>{o.amountText}</td>
                                <td>{o.customer || "-"}</td>
                                <td>{o.supplier || "-"}</td>
                                <td>{o.orderIdShort || String(o.id ?? "").slice(0, 8)}</td>
                                <td className="status-col">
        <span className={"status-badge " + (o.status === "Tamamlanmış" ? "completed" : "pending")}>
          {o.status}
        </span>
                                </td>
                                <td className="sticky-right sticky-col">
                                    <button
                                        className="detail-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/superAdmin/history/${o.id}`);
                                        }}
                                    >
                                        Detallı bax
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>

                    </table>

                    {!isFetching && filtered.length === 0 && (
                        <div className="ohsa-empty">Məlumat tapılmadı</div>
                    )}

                    {/* Infinite scroll üçün sentinel */}
                    <div ref={sentinelRef} className="io-sentinel" />
                </div>
            </div>
        </div>
    );
};

export default OrderHistorySuperAdmin;
