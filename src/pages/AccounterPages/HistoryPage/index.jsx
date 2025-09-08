import { useEffect, useMemo, useRef, useState } from "react";
import "./index.scss";
import {
    useGetAllCompaniesQuery,
    useGetOrderByPageAccounterQuery,
    useGetOrderByPageByCompanyAccounterHistoryQuery, // <-- import düzəldildi
} from "../../../services/adminApi.jsx";
import { useNavigate } from "react-router-dom";

/* ===== Date helpers ===== */
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
        // dd.MM.yyyy [HH:mm[:ss]]
        const m1 =
            /^(\d{2})\.(\d{2})\.(\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(
                s
            );
        if (m1) {
            const [, dd, mm, yyyy, hh = "00", mi = "00", ss = "00"] = m1;
            return new Date(
                Number(yyyy),
                Number(mm) - 1,
                Number(dd),
                Number(hh),
                Number(mi),
                Number(ss)
            );
        }
        const d = new Date(s);
        return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
}

function formatDate(value) {
    const dt = parseAppDate(value);
    if (!dt) return "-";
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = dt.getFullYear();
    const hh = String(dt.getHours()).padStart(2, "0");
    const mi = String(dt.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy}, ${hh}:${mi}`;
}

/* ---- Icon helpers ---- */
const Caret = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
            d="M7 10l5 5 5-5"
            stroke="#444"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
const Funnel = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
            d="M3 5h18l-7 8v6l-4-2v-4L3 5z"
            stroke="#444"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
            stroke="#666"
            strokeWidth="1.6"
        />
    </svg>
);

/* ---- Dropdown (fixed) ---- */
function Dropdown({ label, value, onChange, options = [], placeholder = "Seç" }) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const ref = useRef(null);

    // çöldə klik -> bağla
    useEffect(() => {
        const onDocClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);

    // axtarış query ilə siyahını filterlə
    const filtered = useMemo(() => {
        const list = Array.isArray(options) ? options : [];
        if (!q.trim()) return list;
        const qq = q.toLowerCase();
        return list.filter((opt) => String(opt).toLowerCase().includes(qq));
    }, [options, q]);

    // panel bağlananda inputu təmizlə
    useEffect(() => {
        if (!open) setQ("");
    }, [open]);

    return (
        <div className={`filter-dd ${open ? "open" : ""}`} ref={ref}>
            <button
                type="button"
                className={`dd-btn ${value ? "filled" : ""}`}
                onClick={() => setOpen((v) => !v)}
            >
                <span>{value || label}</span>
                <Caret />
            </button>

            <div className="dd-panel" onClick={(e) => e.stopPropagation()}>
                <div className="dd-search">
                    <input
                        placeholder={placeholder}
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
                <div className="dd-list">
                    <div
                        className={`dd-item ${value === "" ? "active" : ""}`}
                        onClick={() => {
                            onChange("");
                            setOpen(false);
                        }}
                    >
                        Hamısı
                    </div>
                    {filtered.map((opt) => (
                        <div
                            key={opt}
                            className={`dd-item ${opt === value ? "active" : ""}`}
                            onClick={() => {
                                onChange(opt);
                                setOpen(false);
                            }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ---- Sürətli tarix seçimləri ---- */
const quickDateOptions = [
    "Bugün",
    "Dünən",
    "Bu həftə",
    "Keçən həftə",
    "Bu ay",
    "Keçən ay",
];
function getQuickRange(label) {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);
    const dow = now.getDay() || 7; // bazar=7
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

    // ====== State-lər ======
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("all"); // UI — adla
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [filter, setFilter] = useState("all");
    const [globalSearch, setGlobalSearch] = useState("");

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
    const sectionRegistryRef = useRef(new Map()); // companyName -> Set(sectionName)
    const sectionToDepartmentRef = useRef(new Map()); // sectionName -> departmentName
    const seenIdsRef = useRef(new Set()); // dedupe üçün

    // Companies
    const { data: getAllCompanies } = useGetAllCompaniesQuery();
    const companies = getAllCompanies?.data || [];

    // Companies-dən şirkət -> şöbə xəritəsi (adla)
    const companyToDepartments = useMemo(() => {
        const map = new Map();
        for (const c of companies) {
            const cname = c?.name || c?.companyName || "";
            const deps = (c?.departments || [])
                .map((d) => d?.name)
                .filter(Boolean);
            if (cname) map.set(cname, new Set(deps));
        }
        return map;
    }, [companies]);

    // name -> id xəritəsi (ID üçün lazımdır)
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

    // ✅ registry dəyişdikcə yenilə
    const allSectionsMaster = useMemo(() => {
        const reg = sectionRegistryRef.current;
        const all = new Set();
        for (const set of reg.values()) for (const s of set) all.add(s);
        return Array.from(all).sort();
    }, [/* dynamic */]);

    // Serverdən paged data
    const companyNames = useMemo(() => {
        const arr = Array.isArray(companies) ? companies : [];
        return Array.from(
            new Set(
                arr.map((c) => c?.name || c?.companyName || c?.title || c).filter(Boolean)
            )
        ).sort();
    }, [companies]);

    const selectedCompanySafe =
        selectedCompany !== "all" && companyNames.includes(selectedCompany)
            ? selectedCompany
            : "all";

    // UI üçün “Hamısı” məntiqi dəyişmir
    const isAll = selectedCompanySafe === "all";

    // Seçilmiş şirkətin ID-si (backend üçün)
    const [selectedCompanyId, setSelectedCompanyId] = useState("all");
    const selectedCompanyIdSafe =
        selectedCompanyId && selectedCompanyId !== "all" ? String(selectedCompanyId) : "all";

    const { data: pagedAllData, isFetching: isFetchingAll } =
        useGetOrderByPageAccounterQuery({ page, pageSize }, { skip: !isAll });

    const { data: pagedByCompanyData, isFetching: isFetchingByCompany } =
        useGetOrderByPageByCompanyAccounterHistoryQuery(
            { page, pageSize, companyId: selectedCompanyIdSafe }, // <-- ID ilə çağırış
            { skip: isAll }
        );

    const pagedOrdersData = isAll ? pagedAllData : pagedByCompanyData;
    const isFetching = isAll ? isFetchingAll : isFetchingByCompany;

    const totalPages = pagedOrdersData?.pagination?.totalPages ?? 1;

    // Yığıcı state
    const [allOrders, setAllOrders] = useState([]);

    // ✅ allSectionsMaster dinamik dependency
    const _allSectionsMaster = useMemo(() => {
        const reg = sectionRegistryRef.current;
        const all = new Set();
        for (const set of reg.values()) for (const s of set) all.add(s);
        return Array.from(all).sort();
    }, [allOrders]);

    // Company dəyişəndə sıfırla
    useEffect(() => {
        setAllOrders([]);
        setPage(1);
        seenIdsRef.current = new Set();
    }, [selectedCompanySafe, selectedCompanyIdSafe]);

    // Gələn səhifəni idempotent əlavə et + section registry-ni doldur
    useEffect(() => {
        if (!pagedOrdersData?.data) return;

        setAllOrders((prev) => {
            const base = page === 1 ? [] : prev;
            if (page === 1) seenIdsRef.current = new Set();

            const next = [...base];
            for (const it of pagedOrdersData.data) {
                const id = String(it?.id ?? it?.orderId ?? "");
                if (!id) continue;
                if (!seenIdsRef.current.has(id)) {
                    seenIdsRef.current.add(id);
                    next.push(it);
                }
            }
            return next;
        });

        // Section registry-ni update et (adla — mövcud struktur pozulmur)
        const reg = sectionRegistryRef.current;
        const s2d = sectionToDepartmentRef.current;
        for (const o of pagedOrdersData.data) {
            const compName = o?.section?.companyName || o?.section?.company?.name || "";
            const sec = o?.section?.name || "";
            const dep = o?.section?.departmentName || o?.department || "";
            if (compName && sec) {
                if (!reg.has(compName)) reg.set(compName, new Set());
                reg.get(compName).add(sec);
            }
            if (sec && dep && !s2d.has(sec)) s2d.set(sec, dep);
        }
    }, [pagedOrdersData, page]);

    // Sonsuz scroll
    useEffect(() => {
        const handleScroll = () => {
            const nearBottom =
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
            if (nearBottom && !isFetching && page < totalPages) {
                setPage((prev) => prev + 1);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isFetching, page, totalPages]);

    // Orders -> table model (companyId əlavə edildi)
    const orders = useMemo(() => {
        const list = allOrders ?? [];
        return (
            list.map((order) => {
                const isPaid = order.isPaid === true;
                const isUnpaid = order.isPaid === false;

                let status = "";
                if (isPaid) status = "Ödənilib";
                else if (isUnpaid) status = "Ödənilməyib";
                else if (order.employeeDelivery) status = "Tamamlanmış";
                else status = "Sifarişçidən təhvil gözləyən";

                const totalPriceNum =
                    order.items?.reduce(
                        (s, i) => s + (i.suppliedQuantity || 0) * (i?.price || 0),
                        0
                    ) || 0;

                const productNames =
                    order.items?.map((i) => i.product?.name).filter(Boolean) ?? [];
                const product =
                    productNames.length > 2
                        ? productNames.slice(0, 2).join(", ") + "..."
                        : productNames.join(", ");

                const department = order?.section?.departmentName || order?.department || "";
                const section = order?.section?.name || order?.section?.sectionName || "";
                const productSingle = order?.items?.[0]?.product?.name || product || "";

                // ID və ad
                const companyId =
                    order?.section?.companyId ??
                    order?.section?.company?.id ??
                    order?.companyId ??
                    null;

                const companyName = order?.section?.companyName ?? "-";

                return {
                    id: String(order.id || ""),
                    product,
                    productSingle,
                    itemCount: order.items?.length ?? 0,
                    status,
                    price: totalPriceNum.toFixed(2),
                    priceNum: Number(totalPriceNum),
                    customer: `${order.adminInfo?.name || ""} ${order.adminInfo?.surname || ""}`.trim(),
                    supplier: `${order.fighterInfo?.name || ""} ${order.fighterInfo?.surname || ""}`.trim(),
                    paymentStatus: isPaid ? "Ödənilib" : isUnpaid ? "Ödənilməyib" : null,
                    companyName,                   // mövcud davranış qalır (ad)
                    companyId: companyId ? String(companyId) : null, // ID filteri üçün
                    department,
                    section,
                    deliveredAt: order.orderLastDeliveryDate || order.createdAt || order.updatedAt,
                    order, // raw
                };
            }) || []
        );
    }, [allOrders]);

    // Dinamik dropdown siyahıları
    const departmentsFromData = useMemo(
        () =>
            Array.from(new Set(orders.map((o) => o.department).filter(Boolean))).sort(),
        [orders]
    );
    const sectionsFromData = useMemo(
        () =>
            Array.from(new Set(orders.map((o) => o.section).filter(Boolean))).sort(),
        [orders]
    );
    const products = useMemo(() => {
        return Array.from(
            new Set(
                orders.flatMap((o) => {
                    if (!o.order?.items?.length) return [];
                    return o.order.items.map((i) => i?.product?.name).filter(Boolean);
                })
            )
        ).sort();
    }, [orders]);
    const statuses = useMemo(
        () => Array.from(new Set(orders.map((o) => o.status).filter(Boolean))),
        [orders]
    );

    // Relations (Companies + Registry)
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
    }, [companyToDepartments, allOrders]); // registry dəyişə bilər

    // Şirkətə görə dropdown siyahıları (adla — mövcudu saxlayırıq)
    const filteredDepartments = useMemo(() => {
        if (selectedCompanySafe !== "all" && selectedCompanySafe) {
            const set = relations.companyToDepartments.get(selectedCompanySafe);
            return set ? Array.from(set).sort() : [];
        }
        return allDepartmentsMaster.length ? allDepartmentsMaster : departmentsFromData;
    }, [relations, selectedCompanySafe, allDepartmentsMaster, departmentsFromData]);

    const filteredSections = useMemo(() => {
        if (selectedCompanySafe !== "all" && selectedCompanySafe) {
            const set = relations.sectionRegistry.get(selectedCompanySafe);
            return set ? Array.from(set).sort() : [];
        }
        return _allSectionsMaster.length ? _allSectionsMaster : sectionsFromData;
    }, [relations, selectedCompanySafe, _allSectionsMaster, sectionsFromData]);

    // Seçim dəyişəndə sinxronizasiya — UI: ad, Backend: id
    const handleCompanyChange = (val) => {
        const nextCompany = val ? val : "all";
        setSelectedCompany(nextCompany);
        setSelectedCompanyId(nextCompany === "all" ? "all" : (nameToId.get(nextCompany) || "all"));

        if (nextCompany !== "all") {
            const allowedDeps = relations.companyToDepartments.get(nextCompany) || new Set();
            const allowedSecs = relations.sectionRegistry.get(nextCompany) || new Set();
            if (departmentF && !allowedDeps.has(departmentF)) setDepartmentF("");
            if (sectionF && !allowedSecs.has(sectionF)) setSectionF("");
        }
    };

    const handleDepartmentChange = (val) => {
        setDepartmentF(val);
        if (val) {
            const comp = relations.departmentToCompany.get(val);
            if (comp && comp !== (selectedCompanySafe === "all" ? "" : selectedCompanySafe)) {
                setSelectedCompany(comp);
                setSelectedCompanyId(nameToId.get(comp) || "all");
                const allowedSecs = relations.sectionRegistry.get(comp) || new Set();
                if (sectionF && !allowedSecs.has(sectionF)) setSectionF("");
            }
        }
    };

    const handleSectionChange = (val) => {
        setSectionF(val);
        if (val) {
            const comp = relations.sectionToCompany.get(val);
            const dep = relations.sectionToDepartment.get(val);
            if (comp && comp !== (selectedCompanySafe === "all" ? "" : selectedCompanySafe)) {
                setSelectedCompany(comp);
                setSelectedCompanyId(nameToId.get(comp) || "all");
            }
            if (dep && dep !== departmentF) setDepartmentF(dep);
        }
    };

    // Filtr nəticəsi
    const filteredOrders = useMemo(() => {
        let list = [...orders];

        // Header global axtarış
        if (globalSearch.trim()) {
            const q = globalSearch.trim().toLowerCase();
            list = list.filter((o) =>
                [o.id, o.product, o.customer, o.supplier, o.companyName, o.status]
                    .map((v) => String(v ?? "").toLowerCase())
                    .some((s) => s.includes(q))
            );
        }

        // Legacy searchTerm (id + product)
        if (searchTerm.trim()) {
            const qs = searchTerm.toLowerCase();
            list = list.filter(
                (o) =>
                    o.id.toLowerCase().includes(qs) ||
                    (o.product || "").toLowerCase().includes(qs)
            );
        }

        // Legacy filter
        if (filter !== "all") {
            list = list.filter(
                (o) =>
                    (filter === "supplier_pending" &&
                        o.status === "Sifarişçidən təhvil gözləyən") ||
                    (filter === "completed" && o.status === "Tamamlanmış") ||
                    (filter === "unpaid" && o.status === "Ödənilməyib") ||
                    (filter === "paid" && o.status === "Ödənilib")
            );
        }

        // Şirkət filteri — UI: ad
        if (selectedCompanySafe !== "all") {
            list = list.filter((o) => o.companyName === selectedCompanySafe);
        }
        // Şirkət filteri — Backend: id (daxili gücləndirmə)
        if (selectedCompanyIdSafe !== "all") {
            list = list.filter(
                (o) => String(o.companyId || "") === String(selectedCompanyIdSafe)
            );
        }

        // Yeni dropdown filtr-ləri
        if (departmentF) list = list.filter((o) => o.department === departmentF);
        if (sectionF) list = list.filter((o) => o.section === sectionF);
        if (productF)
            list = list.filter((o) =>
                o.order?.items?.some((i) => i?.product?.name === productF)
            );
        if (statusF) list = list.filter((o) => o.status === statusF);

        // Tarix filtrləri
        let from = dateFrom ? new Date(dateFrom) : null;
        let to = dateTo ? new Date(dateTo) : null;
        if (dateQuickF) {
            const [qs, qe] = getQuickRange(dateQuickF);
            from = qs;
            to = qe;
        }
        if (from || to) {
            list = list.filter((o) => {
                const d = parseAppDate(o.order?.orderLimitTime || o.deliveredAt);
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

        // Qiymət aralığı
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
        selectedCompanySafe,
        selectedCompanyIdSafe,
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
        <div className={"order-history-accounter-main"}>
            <div className="order-history-accounter">
                <h2>Tarixçə</h2>
                <p>Sifarişlərin bütün mərhələlər üzrə vəziyyəti bu bölmədə əks olunur.</p>

                {/* ==== HEADER FILTER BAR ==== */}
                <div className="filterbar">
                    <div className="searchbox">
                        <SearchIcon />
                        <input
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            placeholder="Axtarış edin..."
                        />
                    </div>
                </div>

                {/* ==== ALT FILTER SIRA ==== */}
                <div className="filter-row">
                    <Dropdown
                        label="Şirkət seç"
                        value={selectedCompanySafe === "all" ? "" : selectedCompanySafe}
                        onChange={handleCompanyChange}
                        options={companyNames}
                        placeholder="Şirkət seç"
                    />

                    <Dropdown
                        label="Şöbə seç"
                        value={departmentF}
                        onChange={handleDepartmentChange}
                        options={filteredDepartments}
                        placeholder="Şöbə"
                    />

                    <Dropdown
                        label="Bölmə seç"
                        value={sectionF}
                        onChange={handleSectionChange}
                        options={filteredSections}
                        placeholder="Bölmə"
                    />

                    <Dropdown
                        label="Tarix seç"
                        value={dateQuickF}
                        onChange={setDateQuickF}
                        options={quickDateOptions}
                        placeholder="Tarix seç"
                    />

                    <div className="range-dd">
                        <div className="range-label">Tarix aralığı seç</div>
                        <div className="range-row">
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                            <span>—</span>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>
                    </div>

                    <Dropdown
                        label="Məhsul seç"
                        value={productF}
                        onChange={setProductF}
                        options={products}
                        placeholder="Məhsul"
                    />

                    <div className="range-dd">
                        <div className="range-label">Qiymət aralığı seç</div>
                        <div className="range-row">
                            <input
                                type="number"
                                min="0"
                                placeholder="min"
                                value={priceMin}
                                onChange={(e) => setPriceMin(e.target.value)}
                            />
                            <span>—</span>
                            <input
                                type="number"
                                min="0"
                                placeholder="max"
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* ==== CƏDVƏL ==== */}
                <div className="table-wrap">
                    <table className="orders-table">
                        <thead>
                        <tr>
                            <th>Təhvil verildi</th>
                            <th>Şirkət adı</th>
                            <th>Ümumi məbləğ</th>
                            <th>Kateqoriya sayı</th>
                            <th>Məhsul sayı</th>
                            <th>Sifarişçinin adı</th>
                            <th>Təchizatçının adı</th>
                            <th>Order ID</th>
                            <th className="sticky-col">Sifariş detali</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredOrders.map((o) => {
                            const it = o.order?.items ?? [];
                            const categoryCount = new Set(
                                it.map(
                                    (x) =>
                                        x?.product?.category?.id ?? x?.product?.categoryId ?? x?.categoryId
                                )
                            ).size;

                            const limitAt = o.order?.orderLimitTime;
                            return (
                                <tr
                                    key={o.id}
                                    onClick={() => navigate(`/accounter/history/${o.id}`)}
                                >
                                    <td>{formatDate(limitAt)}</td>
                                    <td>{o.companyName}</td>
                                    <td>{o.price} ₼</td>
                                    <td>{categoryCount}</td>
                                    <td>{o.itemCount}</td>
                                    <td>{o.customer || "-"}</td>
                                    <td>{o.supplier || "-"}</td>
                                    <td>#{o.id}</td>
                                    <td className="sticky-col">
                                        <button
                                            type="button"
                                            className="detail-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/accounter/history/${o.id}`);
                                            }}
                                        >
                                            Ətraflı bax →
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryAccounter;
