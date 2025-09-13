import { useEffect, useMemo, useRef, useState } from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../../services/adminApi.jsx";

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

/* ==== Safe Dropdown (reuse) ==== */
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
                            <div
                                key={String(opt)}
                                className={`dd-item ${opt === value ? "active" : ""}`}
                                onClick={() => selectAndClose(opt)}
                            >
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
    const m = /^(\d{2})\.(\d{2})\.(\d{4})/.exec(String(s).trim());
    if (!m) return new Date(s);
    const [, dd, MM, yyyy] = m;
    return new Date(`${yyyy}-${MM}-${dd}T00:00:00`);
};

const computeStatus = (order) => {
    if (order.employeeConfirm && order.fighterConfirm) {
        if (order.employeeDelivery && !order.incompledEmployee) return "Tamamlanmış";
        if (!order.employeeDelivery && order.incompledEmployee) return "Natamam sifariş";
        if (!order.employeeDelivery && !order.incompledEmployee) return "Təhvil alınmayan";
    } else if (order.employeeConfirm && !order.fighterConfirm) {
        return "Təchizatçıdan təsdiq gözləyən";
    }
    return "—";
};

const toViewModel = (order) => {
    const status = computeStatus(order);

    const items = Array.isArray(order.items) ? order.items : [];
    const categories = Array.from(new Set(items.map((i) => i.product?.categoryName).filter(Boolean)));
    const names = items.map((i) => i.product?.name).filter(Boolean);

    const totalPrice =
        items.reduce((sum, i) => sum + (Number(i?.suppliedQuantity ?? 0) * Number(i?.price ?? 0)), 0) ?? 0;

    const maxDisplay = 2;
    const product =
        names.length > maxDisplay ? names.slice(0, maxDisplay).join(", ") + "..." : names.join(", ");

    const vendorName = order.fighterInfo
        ? `${order.fighterInfo.name ?? ""} ${order.fighterInfo.surname ?? ""}`.trim()
        : "";

    const createdDateText = order?.createdDate || "";
    const createdAt = parseAZDate(createdDateText);

    return {
        id: order.id,
        createdDateText,
        createdAt,
        product,
        products: Array.from(new Set(names)),
        categories,
        itemCount: items.length,
        categoryCount: categories.length,
        status,
        amountNum: +(+totalPrice).toFixed(2),
        amountText: `${(+totalPrice).toFixed(2)} ₼`,
        vendorName,
    };
};

const OrderHistory = () => {
    const navigate = useNavigate();
    const { data: getMyOrders, refetch, isFetching } = useGetMyOrdersQuery();

    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const models = useMemo(() => {
        const arr = Array.isArray(getMyOrders?.data) ? getMyOrders.data : [];
        return arr.map(toViewModel);
    }, [getMyOrders]);

    /* ==== Top/Filter state ==== */
    const [globalSearch, setGlobalSearch] = useState("");
    const [statusF, setStatusF] = useState("");

    // second row filters
    const [categoryF, setCategoryF] = useState("");
    const [productF, setProductF] = useState("");
    const [dateQuickF, setDateQuickF] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");

    const statusOptions = ["Təchizatçıdan təsdiq gözləyən", "Tamamlanmış", "Təhvil alınmayan", "Natamam sifariş"];
    const quickDateOptions = ["Bugün", "Dünən", "Bu həftə", "Keçən həftə", "Bu ay", "Keçən ay"];

    // options from data
    const categoryOptions = useMemo(() => {
        return Array.from(new Set(models.flatMap((m) => m.categories || []).filter(Boolean))).sort();
    }, [models]);

    const productOptions = useMemo(() => {
        return Array.from(new Set(models.flatMap((m) => m.products || []).filter(Boolean))).sort();
    }, [models]);

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
            start.setDate(now.getDate() - ((dow - 1)));
            start.setHours(0, 0, 0, 0);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
        } else if (label === "Keçən həftə") {
            start.setDate(now.getDate() - ((dow - 1) + 7));
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
        } else {
            return [null, null];
        }
        return [start, end];
    };

    const filtered = useMemo(() => {
        let list = [...models];

        // global search
        const q = globalSearch.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (r) =>
                    String(r.id ?? "").toLowerCase().includes(q) ||
                    String(r.product ?? "").toLowerCase().includes(q) ||
                    String(r.vendorName ?? "").toLowerCase().includes(q) ||
                    String(r.amountText ?? "").toLowerCase().includes(q) ||
                    String(r.status ?? "").toLowerCase().includes(q) ||
                    (Array.isArray(r.products) && r.products.some((p) => String(p).toLowerCase().includes(q))) ||
                    (Array.isArray(r.categories) && r.categories.some((c) => String(c).toLowerCase().includes(q)))
            );
        }

        // top status
        if (statusF) list = list.filter((r) => r.status === statusF);

        // second row filters
        if (categoryF) list = list.filter((r) => Array.isArray(r.categories) && r.categories.includes(categoryF));
        if (productF) list = list.filter((r) => Array.isArray(r.products) && r.products.includes(productF));

        // dates
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

        // price
        const pMin = priceMin !== "" ? Number(priceMin) : null;
        const pMax = priceMax !== "" ? Number(priceMax) : null;
        if (pMin !== null) list = list.filter((r) => r.amountNum >= pMin);
        if (pMax !== null) list = list.filter((r) => r.amountNum <= pMax);

        return list;
    }, [models, globalSearch, statusF, categoryF, productF, dateQuickF, dateFrom, dateTo, priceMin, priceMax]);

    const listRef = useRef(null);
    const sentinelRef = useRef(null);

    return (
        <div className="order-history-cust-main">
            <div className="order-history-cust">
                <h2>Tarixçə</h2>
                <p>Sifarişlərin vəziyyəti və detalları aşağıdakı cədvəldə əks olunur.</p>

                {/* ==== TOP BAR ==== */}
                <div className="filterbar">
                    <div className="searchbox">
                        <SearchIcon />
                        <input
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            placeholder="Axtarış edin (ID, məhsul, təchizatçı, status)..."
                        />
                    </div>

                    <Dropdown
                        label="Status seç"
                        value={statusF}
                        onChange={setStatusF}
                        options={statusOptions}
                        placeholder="Status"
                        width="200px"
                    />
                </div>

                {/* ==== SECOND FILTER ROW ==== */}
                <div className="filter-row">
                    <Dropdown label="Kategoriya seç" value={categoryF} onChange={setCategoryF} options={categoryOptions} />
                    <Dropdown label="Məhsul seç" value={productF} onChange={setProductF} options={productOptions} />
                    <Dropdown label="Tarix seç" value={dateQuickF} onChange={setDateQuickF} options={quickDateOptions} />

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
                <div className="order-history-cust__table-wrap" ref={listRef}>
                    <table className="ohc-table">
                        <thead>
                        <tr>
                            <th>Tarixi</th>
                            <th>Məhsullar</th>
                            <th>Ümumi məbləğ</th>
                            <th>Təchizatçının adı</th>
                            <th>Status</th>
                            <th>Detallar</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((o, i) => (
                            <tr key={o.id ?? i} onClick={() => navigate(`/customer/history/${o.id}`)}>
                                <td>{o.createdDateText || "-"}</td>
                                <td title={o.product}>
                                    {o.product}
                                    {o.itemCount > 0 && (
                                        <span className="muted"> • {o.itemCount} məhsul / {o.categoryCount} kateqoriya</span>
                                    )}
                                </td>
                                <td className="center">{o.amountText}</td>
                                <td>{o.vendorName || "-"}</td>
                                <td className="center">
                    <span
                        className={
                            "status-badge " +
                            (o.status === "Tamamlanmış"
                                ? "completed"
                                : o.status === "Təhvil alınmayan"
                                    ? "not-completed"
                                    : o.status === "Natamam sifariş"
                                        ? "incomplete"
                                        : "pending")
                        }
                    >
                      {o.status}
                    </span>
                                </td>
                                <td className="sticky-col">
                                    <button
                                        className="detail-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/customer/history/${o.id}`);
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
                        <div className="ohc-empty">Məlumat tapılmadı</div>
                    )}

                    {/* gələcəkdə infinite scroll üçündür */}
                    <div ref={sentinelRef} className="io-sentinel" />
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
