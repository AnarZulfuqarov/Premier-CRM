import "./index.scss";
import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    useDeleteAccountantMutation,
    useEditAccountantMutation,
    useGetAllAccountantsQuery,
    // ⚠️ Bunu adminApi.jsx-də varsa belə import et
    // əgər "lazy" variantın varsa: useLazyGetCompanyByIdQuery istifadə et (aşağıda qeyd etdim)
    useGetCompanyIdQuery,
} from "../../../services/adminApi.jsx";
import { usePopup } from "../../../components/Popup/PopupContext.jsx";

/* ---- Cədvəl sütunları ---- */
const columns = [
    { key: "deliveredAt", label: "Təhvil verilmə tarixi" },
    { key: "company", label: "Şirkət adı" },
    { key: "amount", label: "Ümumi məbləğ" },
    { key: "customer", label: "Sifarişçinin adı" },
    { key: "supplier", label: "Təchizatçının adı" },
    { key: "orderId", label: "Order ID" },
    { key: "payment", label: "Ödəniş üsulu" },
];

const searchableKeys = new Set([
    "deliveredAt",
    "company",
    "amount",
    "customer",
    "supplier",
    "orderId",
    "payment",
]);

const Caret = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M7 10l5 5 5-5" stroke="#444" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" stroke="#666" strokeWidth="1.6"/>
    </svg>
);

/* ---- Dropdown ---- */
function Dropdown({ label, value, onChange, options = [], placeholder = "Seç", width }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter(o => String(o).toLowerCase().includes(q));
    }, [options, query]);

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
        <div className={`filter-dd ${open ? "open" : ""}`} ref={ref}>
            <button type="button" className={`dd-btn ${value ? "filled" : ""}`} onClick={() => setOpen(s => !s)}>
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
                        {filtered.map(opt => (
                            <div key={opt} className={`dd-item ${opt === value ? "active" : ""}`} onClick={() => selectAndClose(opt)}>
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

const AccounterBorcTarixce = () => {
    const navigate = useNavigate();
    const showPopup = usePopup();

    /* ---- LOCAL borcCompanyId ---- */
    const [borcCompanyId, setBorcCompanyId] = useState(() => {
        try {
            const v = localStorage.getItem("borcCompanyId");
            return v ? (isNaN(+v) ? v : +v) : null;
        } catch {
            return null;
        }
    });

    // ⚠️ Əgər səndə "useGetCompanyByIdQuery" yoxdursa:
    // const [triggerGetCompanyById, { data: companyRes }] = useLazyGetCompanyByIdQuery();
    // useEffect(() => { if (borcCompanyId) triggerGetCompanyById(borcCompanyId); }, [borcCompanyId]);

    const { data: companyRes } = useGetCompanyIdQuery(borcCompanyId, { skip: !borcCompanyId });

    // Header axtarışı
    const [globalSearch, setGlobalSearch] = useState("");
    // Sütun daxili axtarış
    const [searchCol, setSearchCol] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    // Modal/CRUD
    const [editingRow, setEditingRow] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(null);

    // Filter bar state
    const [companyF, setCompanyF] = useState(""); // dropdown-da company seçimi (borcCompanyId varsa auto-set edəcəyik)
    const [departmentF, setDepartmentF] = useState("");
    const [sectionF, setSectionF] = useState("");
    const [statusF, setStatusF] = useState("");
    const [dateQuickF, setDateQuickF] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [productF, setProductF] = useState("");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");

    const { data: getAllFighters, refetch } = useGetAllAccountantsQuery();
    const [editFighter] = useEditAccountantMutation();
    const [deleteFighter] = useDeleteAccountantMutation();

    useEffect(() => { refetch(); }, [refetch]);

    /* Map orders */
    const orders = useMemo(() => {
        const raw = getAllFighters?.data ?? [];
        return raw.map((s) => {
            const amount = typeof s.totalAmount === "number" ? s.totalAmount : 325;
            return {
                id: s.id,
                deliveredAt: s.deliveredAt ?? "2025-05-16T13:45:00",
                company: s.companyName ?? s.name ?? "Oldgates",
                amountNum: amount,
                amount: amount.toLocaleString("az-Latn-AZ") + " ₼",
                customer: s.customerName ?? "Sabina Heydarova",
                supplier: s.supplierName ?? "Sabina Heydarova",
                orderId: s.orderNumber ? `#${s.orderNumber}` : "#9187654366",
                payment: s.paymentMethod ?? "Nağd",
                status: s.status ?? "Tamamlandı",
                product: s.productName ?? "Məhsul A",
                department: s.department ?? "Satış",
                section: s.section ?? "Bölmə 1",
                password: s.password ?? "********",
                phone: s.phoneNumber ?? "",
                fin: s.finCode ?? "",
            };
        });
    }, [getAllFighters]);

    /* Dinamik siyahılar (fallback) */
    const companiesFromOrders = useMemo(
        () => Array.from(new Set(orders.map((o) => o.company))).sort(),
        [orders]
    );
    const departmentsFromOrders = useMemo(
        () => Array.from(new Set(orders.map((o) => o.department))).sort(),
        [orders]
    );
    const sectionsFromOrders = useMemo(
        () => Array.from(new Set(orders.map((o) => o.section))).sort(),
        [orders]
    );
    const products = useMemo(
        () => Array.from(new Set(orders.map((o) => o.product))).sort(),
        [orders]
    );
    const statuses = useMemo(
        () => Array.from(new Set(orders.map((o) => o.status))).sort(),
        [orders]
    );

    /* ---- Şirkət məlumatı getCompanyById-dan ---- */
    // Backend strukturunu dəqiq bilmədiyim üçün həm companyRes?.data, həm də companyRes birbaşa obyekt ola bilər deyə ehtiyatlı parse edirəm.
    const companyObj = companyRes?.data ?? companyRes ?? null;

    // Məs: { name, departments: [{name, sections: ["..."]}] } və ya
    // { title, departments: ["Satış","İstehsal"], sections: ["Bölmə 1","Bölmə 2"] }
    const companyNameFromApi =
        companyObj?.name || companyObj?.title || companyObj?.companyName || "";

    // Əgər departamentlər nested-dirsə (dept.name), düzləşdiririk:
    const departmentsFromApi = useMemo(() => {
        const d = companyObj?.departments;
        if (!d) return [];
        if (Array.isArray(d)) {
            // Dept obyekt və ya string ola bilər
            const names = d
                .map((x) => (typeof x === "string" ? x : x?.name || x?.title))
                .filter(Boolean);
            return Array.from(new Set(names));
        }
        return [];
    }, [companyObj]);

    // Bölmələr birbaşa company səviyyəsində ola və ya dept-lərin içində ola bilər
    const sectionsFromApi = useMemo(() => {
        // 1) Birbaşa massiv kimi
        if (Array.isArray(companyObj?.sections)) {
            return Array.from(new Set(companyObj.sections.filter(Boolean)));
        }
        // 2) Dept-lərin içində sections ola bilər
        if (Array.isArray(companyObj?.departments)) {
            const gathered = [];
            companyObj.departments.forEach((d) => {
                const sec =
                    (Array.isArray(d?.sections) && d.sections) ||
                    (Array.isArray(d?.bolmeler) && d.bolmeler) || // ehtiyat
                    [];
                sec.forEach((s) => s && gathered.push(typeof s === "string" ? s : s?.name || s?.title));
            });
            return Array.from(new Set(gathered.filter(Boolean)));
        }
        return [];
    }, [companyObj]);

    /* ---- borcCompanyId varsa, company dropdown-u auto-dolur və dept/section mənbəyi API olur ---- */
    useEffect(() => {
        if (borcCompanyId && companyNameFromApi) {
            setCompanyF(companyNameFromApi);
            // borcCompanyId dəyişəndə seçilmiş dept/section-u sıfırlamaq daha sağlamdır
            setDepartmentF("");
            setSectionF("");
        }
    }, [borcCompanyId, companyNameFromApi]);

    // Dropdown-lara veriləcək final siyahılar:
    const companies = borcCompanyId && companyNameFromApi
        ? [companyNameFromApi]
        : companiesFromOrders;

    const departments = (borcCompanyId && departmentsFromApi.length > 0)
        ? departmentsFromApi
        : departmentsFromOrders;

    const sections = (borcCompanyId && sectionsFromApi.length > 0)
        ? sectionsFromApi
        : sectionsFromOrders;

    /* ---- Tarix sürətli seçimləri ---- */
    const quickDateOptions = ["Bugün", "Dünən", "Bu həftə", "Keçən həftə", "Bu ay", "Keçən ay"];

    const getQuickRange = (label) => {
        const now = new Date();
        const start = new Date(now);
        const end = new Date(now);
        const dow = now.getDay() || 7;
        if (label === "Bugün") {
            start.setHours(0,0,0,0); end.setHours(23,59,59,999);
        } else if (label === "Dünən") {
            start.setDate(now.getDate()-1); start.setHours(0,0,0,0);
            end.setDate(now.getDate()-1);   end.setHours(23,59,59,999);
        } else if (label === "Bu həftə") {
            start.setDate(now.getDate() - (dow-1)); start.setHours(0,0,0,0);
            end.setDate(start.getDate()+6);         end.setHours(23,59,59,999);
        } else if (label === "Keçən həftə") {
            start.setDate(now.getDate() - (dow-1) - 7); start.setHours(0,0,0,0);
            end.setDate(start.getDate()+6);             end.setHours(23,59,59,999);
        } else if (label === "Bu ay") {
            start.setDate(1); start.setHours(0,0,0,0);
            end.setMonth(now.getMonth()+1,0); end.setHours(23,59,59,999);
        } else if (label === "Keçən ay") {
            start.setMonth(now.getMonth()-1,1); start.setHours(0,0,0,0);
            end.setMonth(now.getMonth(),0);     end.setHours(23,59,59,999);
        } else return [null,null];
        return [start, end];
    };

    /* ---- Filtr tətbiqi ---- */
    const filtered = useMemo(() => {
        let list = [...orders];

        if (globalSearch.trim()) {
            const q = globalSearch.trim().toLowerCase();
            list = list.filter(r =>
                ["company","customer","supplier","orderId","payment","product","status"].some(
                    key => String(r[key] ?? "").toLowerCase().includes(q)
                ) ||
                String(r.amount ?? "").toLowerCase().includes(q) ||
                String(r.amountNum ?? "").toLowerCase().includes(q)
            );
        }

        if (searchCol && searchTerm.trim()) {
            const val = searchTerm.toLowerCase();
            list = list.filter(r => {
                if (searchCol === "amount") {
                    return String(r.amount ?? "").toLowerCase().includes(val) || String(r.amountNum ?? "").toLowerCase().includes(val);
                }
                return String(r[searchCol] ?? "").toLowerCase().includes(val);
            });
        }

        if (companyF)   list = list.filter(r => r.company   === companyF);
        if (departmentF)list = list.filter(r => r.department=== departmentF);
        if (sectionF)   list = list.filter(r => r.section   === sectionF);
        if (statusF)    list = list.filter(r => r.status    === statusF);
        if (productF)   list = list.filter(r => r.product   === productF);

        let from = dateFrom ? new Date(dateFrom) : null;
        let to   = dateTo   ? new Date(dateTo)   : null;
        if (dateQuickF) {
            const [qs, qe] = getQuickRange(dateQuickF);
            from = qs; to = qe;
        }
        if (from || to) {
            list = list.filter(r => {
                const d = new Date(r.deliveredAt);
                if (from && d < from) return false;
                if (to) { const t = new Date(to); t.setHours(23,59,59,999); if (d > t) return false; }
                return true;
            });
        }

        const pMin = priceMin !== "" ? Number(priceMin) : null;
        const pMax = priceMax !== "" ? Number(priceMax) : null;
        if (pMin !== null) list = list.filter(r => r.amountNum >= pMin);
        if (pMax !== null) list = list.filter(r => r.amountNum <= pMax);

        return list;
    }, [
        orders, globalSearch, searchCol, searchTerm,
        companyF, departmentF, sectionF, statusF, productF,
        dateQuickF, dateFrom, dateTo, priceMin, priceMax
    ]);

    /* ---- Yadda saxla ---- */
    const handleSave = async (row) => {
        const isPasswordChanged = row.password !== "********";
        try {
            await editFighter({
                id: row.id,
                name: row.company,
                surname: row.supplier,
                finCode: row.fin,
                password: isPasswordChanged ? row.password : null,
            }).unwrap();
            showPopup("Dəyişiklik yadda saxlandı", "Uğurla tamamlandı", "success");
            setEditingRow(null);
            refetch();
        } catch {
            showPopup("Sistem xətası","Yenidən cəhd edin.","error");
        }
    };

    return (
        <div className="accounter-borc-tarixce-main">
            <div className="accounter-borc-tarixce">
                <div className="headerr">
                    <div className="head">
                        <h2>Tarixçə</h2>
                        <p>Sifarişlərin bütün mərhələlər üzrə vəziyyəti bu bölmədə əks olunur.</p>
                    </div>
                </div>

                {/* FILTER BAR */}
                <div className="filterbar">
                    <div className="searchbox">
                        <SearchIcon/>
                        <input
                            value={globalSearch}
                            onChange={(e)=>setGlobalSearch(e.target.value)}
                            placeholder="Axtarış edin..."
                        />
                    </div>
                </div>

                {/* Alt filter sıra */}
                <div className="filter-row">

                    {/* Şöbə / Bölmə — borcCompanyId varsa getCompanyById-dan gələn siyahılar */}
                    <Dropdown
                        label="Şöbə seç"
                        value={departmentF}
                        onChange={setDepartmentF}
                        options={departments}
                        placeholder="Şöbə"
                    />
                    <Dropdown
                        label="Bölmə seç"
                        value={sectionF}
                        onChange={setSectionF}
                        options={sections}
                        placeholder="Bölmə"
                    />


                    <Dropdown
                        label="Tarix seç"
                        value={dateQuickF}
                        onChange={setDateQuickF}
                        options={["Bugün","Dünən","Bu həftə","Keçən həftə","Bu ay","Keçən ay"]}
                        placeholder="Tarix seç"
                    />
                    <div className="range-dd">
                        <div className="range-label">Tarix aralığı seç</div>
                        <div className="range-row">
                            <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} />
                            <span>—</span>
                            <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} />
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
                            <input type="number" min="0" placeholder="min" value={priceMin} onChange={e=>setPriceMin(e.target.value)} />
                            <span>—</span>
                            <input type="number" min="0" placeholder="max" value={priceMax} onChange={e=>setPriceMax(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Cədvəl + Sağ sabit sütun */}
                <div className="order-table-wrapper">
                    <div className="scrollable-part">
                        <table>
                            <thead>
                            <tr>
                                {columns.map((c) => (
                                    <th key={c.key}>
                                        {c.label}
                                        {searchableKeys.has(c.key) && (
                                            <span className="search-icon" onClick={() => setSearchCol(searchCol === c.key ? null : c.key)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M17.71 16.29L14.31 12.9C15.407 11.5025 16.0022 9.77666 16 8C16 6.41775 15.5308 4.87103 14.6518 3.55544C13.7727 2.23985 12.5233 1.21447 11.0615 0.608967C9.59966 0.00346625 7.99113 -0.15496 6.43928 0.153721C4.88743 0.462403 3.46197 1.22433 2.34315 2.34315C1.22433 3.46197 0.462403 4.88743 0.153721 6.43928C-0.15496 7.99113 0.00346625 9.59966 0.608967 11.0615C1.21447 12.5233 2.23985 13.7727 3.55544 14.6518C4.87103 15.5308 6.41775 16 8 16C9.77666 16.0022 11.5025 15.407 12.9 14.31L16.29 17.71C16.383 17.8037 16.4936 17.8781 16.6154 17.9289C16.7373 17.9797 16.868 18.0058 17 18.0058C17.132 18.0058 17.2627 17.9797 17.3846 17.9289C17.5064 17.8781 17.617 17.8037 17.71 17.71C17.8037 17.617 17.8781 17.5064 17.9289 17.3846C17.9797 17.2627 18.0058 17.132 18.0058 17C18.0058 16.868 17.9797 16.7373 17.9289 16.6154C17.8781 16.4936 17.8037 16.383 17.71 16.29ZM2 8C2 6.81332 2.3519 5.65328 3.01119 4.66658C3.67047 3.67989 4.60755 2.91085 5.7039 2.45673C6.80026 2.0026 8.00666 1.88378 9.17055 2.11529C10.3344 2.3468 11.4035 2.91825 12.2426 3.75736C13.0818 4.59648 13.6532 5.66558 13.8847 6.82946C14.1162 7.99335 13.9974 9.19975 13.5433 10.2961C13.0892 11.3925 12.3201 12.3295 11.3334 12.9888C10.3467 13.6481 9.18669 14 8 14C6.4087 14 4.88258 13.3679 3.75736 12.2426C2.63214 11.1174 2 9.5913 2 8Z" fill="#7A7A7A"/>
</svg>
                        </span>
                                        )}
                                        {searchCol === c.key && (
                                            <div className="search-input-wrapper">
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    placeholder={`Axtar: ${c.label}`}
                                                />
                                                <span className="close-search" onClick={() => { setSearchCol(null); setSearchTerm(""); }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M12.5 3.5 3.5 12.5M3.5 3.5 12.5 12.5" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map((row, idx) => (
                                <tr key={row.id ?? idx}>
                                    <td>{new Date(row.deliveredAt).toLocaleString()}</td>
                                    <td>{row.company}</td>
                                    <td>{row.amount}</td>
                                    <td>{row.customer}</td>
                                    <td>{row.supplier}</td>
                                    <td>{row.orderId}</td>
                                    <td>{row.payment}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="fixed-column">
                        <div className="header">Sifariş detalı</div>
                        {filtered.map((row, i) => (
                            <div key={row.id ?? i} className="cell">
                                <button className="detail-btn" onClick={() => setEditingRow(row)}>Ətraflı bax</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {editingRow && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setEditingRow(null)}>×</button>
                        <h3>Sifariş məlumatı</h3>
                        <div className="form">
                            <div className="form-row">
                                <div>
                                    <label>Şirkət adı</label>
                                    <input value={editingRow.company} onChange={(e)=>setEditingRow({...editingRow,company:e.target.value})}/>
                                </div>
                                <div>
                                    <label>Təchizatçının adı</label>
                                    <input value={editingRow.supplier} onChange={(e)=>setEditingRow({...editingRow,supplier:e.target.value})}/>
                                </div>
                            </div>
                            <label>FIN</label>
                            <input value={editingRow.fin} onChange={(e)=>setEditingRow({...editingRow,fin:e.target.value})}/>
                            <label>Parol</label>
                            <input type="password" value={editingRow.password} onChange={(e)=>setEditingRow({...editingRow,password:e.target.value})}/>
                            <button className="save-btn" onClick={()=>handleSave(editingRow)}>Yadda saxla</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteIndex !== null && (
                <div className="modal-overlay" onClick={() => setDeleteIndex(null)}>
                    <div className="delete-modal-box" onClick={(e)=>e.stopPropagation()}>
                        <div className="delete-icon-wrapper">
                            <div className="delete-icon-circle-one">
                                <div className="delete-icon-circle">!</div>
                            </div>
                        </div>
                        <p className="delete-message">Sətiri silmək istədiyinizə əminsiniz?</p>
                        <div className="delete-modal-actions">
                            <button className="cancel-btn" onClick={() => setDeleteIndex(null)}>Ləğv et</button>
                            <button className="confirm-btn" onClick={async ()=>{
                                try{
                                    const row = filtered[deleteIndex];
                                    await deleteFighter(row.id).unwrap();
                                    showPopup("Silindi","Sətir uğurla silindi","success");
                                    setDeleteIndex(null);
                                    refetch();
                                }catch{
                                    showPopup("Sistem xətası","Təkrar cəhd edin.","error");
                                }
                            }}>Sil</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccounterBorcTarixce;
