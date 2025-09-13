import { useEffect, useMemo, useRef, useState } from "react";
import "./index.scss";
import {
    useGetAllCompaniesQuery,
    useGetOrderByPageByCompanyFighterQuery,
    useGetOrderByPageByCompanyQuery,
    useGetUserFightersQuery,
} from "../../../services/adminApi.jsx";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

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

/* ==== Reusable Dropdown ==== */
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
                        <div className={`dd-item ${value === "" ? "active" : ""}`} onClick={() => selectAndClose("")}>Hamısı</div>
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
const computeStatus = (order) => {
    if (order.employeeConfirm && order.fighterConfirm) {
        return order.employeeDelivery ? "Tamamlanmış" : "Sifarişçidən təhvil gözləyən";
    }
    return "—";
};

const toViewModel = (order) => {
    const items = Array.isArray(order.items) ? order.items : [];
    const totalPrice = items.reduce((sum, it) => sum + Number(it?.suppliedQuantity ?? 0) * Number(it?.price ?? 0), 0) ?? 0;

    const names = items.map((i) => i.product?.name).filter(Boolean);
    const product = names.length > 2 ? names.slice(0, 2).join(", ") + "..." : names.join(", ");

    const uniqueCategories = Array.from(new Set(items.map((i) => i.product?.categoryName).filter(Boolean)));

    const customerFullName = `${order?.adminInfo?.name ?? ""} ${order?.adminInfo?.surname ?? ""}`.trim();
    const supplierFullName = `${order?.fighterInfo?.name ?? ""} ${order?.fighterInfo?.surname ?? ""}`.trim();

    return {
        id: order.id,
        createdDateText: order?.createdDate || "",
        companyName: order?.section?.companyName || "",
        product,
        itemCount: items.length,
        categoryCount: uniqueCategories.length,
        amountNum: +(+totalPrice).toFixed(2),
        amountText: `${(+totalPrice).toFixed(2)} ₼`,
        customer: customerFullName || "-",
        supplier: supplierFullName || "-",
        status: computeStatus(order),
        _raw: order,
    };
};

const OrderHistorySupplier = () => {
    const navigate = useNavigate();

    /* User & company context */
    const { data: getUserFighters } = useGetUserFightersQuery();
    const fighterId = getUserFighters?.data?.id;
    const companyId = Cookies.get("companyId");

    /* Companies */
    const { data: getAllCompanies } = useGetAllCompaniesQuery();
    const companyNames = useMemo(() => {
        const arr = Array.isArray(getAllCompanies?.data) ? getAllCompanies.data : [];
        return arr.map((c) => c?.name).filter(Boolean).sort();
    }, [getAllCompanies]);

    /* Paging state */
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [selectedCompany, setSelectedCompany] = useState(""); // "" = Hamısı
    const [allOrders, setAllOrders] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    // Data queries (both called, controlled by skip)
    const { data: fighterRes, isFetching: isFetchingFighter } = useGetOrderByPageByCompanyFighterQuery(
        { fighterId, companyId, page, pageSize },
        { skip: !!selectedCompany }
    );
    const { data: byCompanyRes, isFetching: isFetchingCompany } = useGetOrderByPageByCompanyQuery(
        { page, pageSize, companyName: selectedCompany || "all" },
        { skip: !selectedCompany }
    );

    const isFetching = selectedCompany ? isFetchingCompany : isFetchingFighter;
    const pageData = useMemo(() => {
        const raw = selectedCompany ? byCompanyRes?.data : fighterRes?.data;
        return Array.isArray(raw) ? raw : [];
    }, [selectedCompany, byCompanyRes, fighterRes]);

    // Reset when company changes
    useEffect(() => {
        setAllOrders([]);
        setPage(1);
        setHasMore(true);
    }, [selectedCompany]);

    // Accumulate pages + dedupe
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

    /* Filters */
    const [globalSearch, setGlobalSearch] = useState("");
    const [statusF, setStatusF] = useState("");
    const [dateQuickF, setDateQuickF] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");

    const statusOptions = ["Sifarişçidən təhvil gözləyən", "Tamamlanmış"];
    const quickDateOptions = ["Bugün", "Dünən", "Bu həftə", "Keçən həftə", "Bu ay", "Keçən ay"];

    const getQuickRange = (label) => {
        const now = new Date();
        const start = new Date(now);
        const end = new Date(now);
        const dow = now.getDay() || 7;
        if (label === "Bugün") { start.setHours(0,0,0,0); end.setHours(23,59,59,999); }
        else if (label === "Dünən") { start.setDate(now.getDate()-1); start.setHours(0,0,0,0); end.setDate(now.getDate()-1); end.setHours(23,59,59,999); }
        else if (label === "Bu həftə") { start.setDate(now.getDate()-(dow-1)); start.setHours(0,0,0,0); end.setDate(start.getDate()+6); end.setHours(23,59,59,999); }
        else if (label === "Keçən həftə") { start.setDate(now.getDate()-(dow-1)-7); start.setHours(0,0,0,0); end.setDate(start.getDate()+6); end.setHours(23,59,59,999); }
        else if (label === "Bu ay") { start.setDate(1); start.setHours(0,0,0,0); end.setMonth(now.getMonth()+1,0); end.setHours(23,59,59,999); }
        else if (label === "Keçən ay") { start.setMonth(now.getMonth()-1,1); start.setHours(0,0,0,0); end.setMonth(now.getMonth(),0); end.setHours(23,59,59,999); }
        else { return [null,null]; }
        return [start,end];
    };

    // shape
    const shaped = useMemo(() => {
        const src = Array.isArray(allOrders) ? allOrders : [];
        return src
            .filter((o) => o.employeeConfirm && o.fighterConfirm)
            .map(toViewModel);
    }, [allOrders]);

    // filter
    const filtered = useMemo(() => {
        let list = [...shaped];

        const q = globalSearch.trim().toLowerCase();
        if (q) {
            list = list.filter((r) =>
                String(r.id ?? "").toLowerCase().includes(q) ||
                String(r.product ?? "").toLowerCase().includes(q) ||
                String(r.customer ?? "").toLowerCase().includes(q) ||
                String(r.companyName ?? "").toLowerCase().includes(q) ||
                String(r.amountText ?? "").toLowerCase().includes(q) ||
                String(r.status ?? "").toLowerCase().includes(q)
            );
        }
        if (statusF) list = list.filter((r) => r.status === statusF);
        if (selectedCompany) list = list.filter((r) => r.companyName === selectedCompany);

        // date filters
        let from = dateFrom ? new Date(dateFrom) : null;
        let to = dateTo ? new Date(dateTo) : null;
        if (dateQuickF) {
            const [qs, qe] = getQuickRange(dateQuickF);
            from = qs; to = qe;
        }
        if (from || to) {
            list = list.filter((r) => {
                const d = r?._raw?.createdDate ? new Date(r._raw.createdDate) : null;
                if (!d) return false;
                if (from && d < from) return false;
                if (to) { const t = new Date(to); t.setHours(23,59,59,999); if (d > t) return false; }
                return true;
            });
        }

        // price
        const pMin = priceMin !== "" ? Number(priceMin) : null;
        const pMax = priceMax !== "" ? Number(priceMax) : null;
        if (pMin !== null) list = list.filter((r) => r.amountNum >= pMin);
        if (pMax !== null) list = list.filter((r) => r.amountNum <= pMax);

        return list;
    }, [shaped, globalSearch, statusF, selectedCompany, dateQuickF, dateFrom, dateTo, priceMin, priceMax]);

    /* Infinite scroll with IO */
    const listRef = useRef(null);
    const sentinelRef = useRef(null);
    useEffect(() => {
        const rootEl = listRef.current;
        const target = sentinelRef.current;
        if (!rootEl || !target) return;

        let ticking = false;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetching && hasMore && !ticking) {
                    ticking = true;
                    setPage((p) => p + 1);
                    setTimeout(() => (ticking = false), 350);
                }
            },
            { root: rootEl, rootMargin: "200px 0px", threshold: 0.01 }
        );
        io.observe(target);
        return () => io.disconnect();
    }, [isFetching, hasMore, selectedCompany]);


    return (
        <div className="order-history-supplier-main">
            <div className="order-history-supplier">
                <h2>Tarixçə</h2>
                <p>Təchizatçı perspektivindən təsdiqlənmiş sifarişlərin vəziyyəti cədvəldə.</p>

                {/* ==== TOP BAR ==== */}
                <div className="filterbar">
                    <div className="searchbox">
                        <SearchIcon />
                        <input
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            placeholder="Axtarış edin (ID, məhsul, müştəri, şirkət, status)..."
                        />
                    </div>

                    <Dropdown
                        label="Status seç"
                        value={statusF}
                        onChange={setStatusF}
                        options={["Sifarişçidən təhvil gözləyən", "Tamamlanmış"]}
                        placeholder="Status"
                        width="220px"
                    />
                </div>

                {/* ==== SECOND FILTER ROW ==== */}
                <div className="filter-row">
                    <Dropdown
                        label="Şirkət seçin"
                        value={selectedCompany}
                        onChange={(v) => setSelectedCompany(v || "")}
                        options={companyNames}
                        placeholder="Şirkət"
                    />

                    <Dropdown
                        label="Tarix seç"
                        value={dateQuickF}
                        onChange={setDateQuickF}
                        options={quickDateOptions}
                    />

                    <div className="range-dd">
                        <div className="range-label">Tarix aralığı</div>
                        <div className="range-row">
                            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                            <span>—</span>
                            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                        </div>
                    </div>

                    <div className="range-dd">
                        <div className="range-label">Qiymət aralığı</div>
                        <div className="range-row">
                            <input type="number" min="0" placeholder="min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
                            <span>—</span>
                            <input type="number" min="0" placeholder="max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* ==== TABLE ==== */}
                <div className="order-history-supplier__table-wrap" ref={listRef}>
                    <table className="ohs-table">
                        <thead>
                        <tr>
                            <th>Tarixi</th>
                            <th>Şirkət adı</th>
                            <th>Məhsullar</th>
                            <th>Ümumi məbləğ</th>
                            <th>Sifarişçinin adı</th>
                            <th>Status</th>
                            <th>Detallar</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((o, i) => (
                            <tr key={o.id ?? i} onClick={() => navigate(`/supplier/history/${o.id}`)}>
                                <td>{o.createdDateText || "-"}</td>
                                <td>{o.companyName || "-"}</td>
                                <td title={o.product}>
                                    {o.product}
                                    {!!o.itemCount && (
                                        <span className="muted"> • {o.itemCount} məhsul / {o.categoryCount} kateqoriya</span>
                                    )}
                                </td>
                                <td className="center">{o.amountText}</td>
                                <td>{o.customer || "-"}</td>
                                <td className="center">
                    <span className={"status-badge " + (o.status === "Tamamlanmış" ? "completed" : "pending")}>
                      {o.status}
                    </span>
                                </td>
                                <td className="sticky-col">
                                    <button
                                        className="detail-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/supplier/history/${o.id}`);
                                        }}
                                    >
                                        Detallı bax
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {!isFetching && filtered.length === 0 && <div className="ohs-empty">Məlumat tapılmadı</div>}

                    {/* infinite scroll sentinel */}
                    <div ref={sentinelRef} className="io-sentinel" />
                </div>
            </div>
        </div>
    );
};

export default OrderHistorySupplier;
