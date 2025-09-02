import "./index.scss";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useDeleteAccountantMutation,
    useEditAccountantMutation,
    useGetAllAccountantsQuery,
} from "../../../services/adminApi.jsx";
import { usePopup } from "../../../components/Popup/PopupContext.jsx";

/* ---- Cədvəl sütunları (sol hissə) ---- */
const columns = [
    { key: "deliveredAt", label: "Təhvil verilmə tarixi" },
    { key: "company",     label: "Şirkət adı" },
    { key: "amount",      label: "Ümumi məbləğ" },
    { key: "customer",    label: "Sifarişçinin adı" },
    { key: "supplier",    label: "Təchizatçının adı" },
    { key: "orderId",     label: "Order ID" },
    { key: "payment",     label: "Ödəniş üsulu" },
];

const searchableKeys = new Set([
    "deliveredAt","company","amount","customer","supplier","orderId","payment"
]);

/* ---- Sadə UI köməkçiləri ---- */
const Caret = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M7 10l5 5 5-5" stroke="#444" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const Funnel = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M3 5h18l-7 8v6l-4-2v-4L3 5z" stroke="#444" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" stroke="#666" strokeWidth="1.6" />
    </svg>
);

/* ---- Dropdown komponenti ---- */
function Dropdown({ label, value, onChange, options = [], placeholder="Seç", width }) {
    return (
        <div className="filter-dd" >
            <button type="button" className={`dd-btn ${value ? "filled":""}`}>
                <span>{label}</span>
                <Caret/>
            </button>
            <div className="dd-panel">
                <div className="dd-search">
                    <input
                        placeholder={placeholder}
                        value={value || ""}
                        onChange={(e)=>onChange(e.target.value)}
                    />
                </div>
                <div className="dd-list">
                    <div className={`dd-item ${value===""?"active":""}`} onClick={()=>onChange("")}>Hamısı</div>
                    {options.map((opt)=>(
                        <div key={opt} className={`dd-item ${opt===value?"active":""}`} onClick={()=>onChange(opt)}>
                            {opt}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const AccounterBorcTarixce = () => {
    const navigate = useNavigate();
    const showPopup = usePopup();

    // Header axtarışı (şəkildə yuxarı input)
    const [globalSearch, setGlobalSearch] = useState("");

    // Sütun daxili axtarış
    const [searchCol, setSearchCol]   = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal/CRUD state
    const [editingRow, setEditingRow] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(null);

    // Filter bar state (şəkildəki droplar)
    const [companyF, setCompanyF] = useState("Oldgates"); // default şəkilə uyğun
    const [departmentF, setDepartmentF] = useState("");   // Şöbə seç
    const [sectionF, setSectionF] = useState("");         // Bölmə seç
    const [dateQuickF, setDateQuickF] = useState("");     // Tarix seç
    const [dateFrom, setDateFrom] = useState("");         // Tarix aralığı: başlanğıc
    const [dateTo, setDateTo] = useState("");             // Tarix aralığı: bitiş
    const [productF, setProductF] = useState("");         // Məhsul seç
    const [priceMin, setPriceMin] = useState("");         // Qiymət aralığı: min
    const [priceMax, setPriceMax] = useState("");         // Qiymət aralığı: max
    const [statusFilterOpen, setStatusFilterOpen] = useState(false);
    const [dateFilterOpen, setDateFilterOpen] = useState(false);
    const [statusF, setStatusF] = useState("");           // Status üzrə filtr

    const { data:getAllFighters, refetch } = useGetAllAccountantsQuery();
    const [editFighter] = useEditAccountantMutation();
    const [deleteFighter] = useDeleteAccountantMutation();

    useEffect(() => { refetch(); }, []);

    /* BACKEND-dən gələn datanı “orders” modelinə map edirik */
    const orders = useMemo(() => {
        const raw = getAllFighters?.data ?? [];
        return raw.map((s, i) => ({
            id: s.id,
            deliveredAt: s.deliveredAt ?? "2025-05-16T13:45:00", // ISO saxlayaq
            company:     s.companyName ?? s.name ?? "Oldgates",
            amountNum:   typeof s.totalAmount === "number" ? s.totalAmount : 325,
            amount:      (typeof s.totalAmount === "number" ? s.totalAmount : 325) + " ₼",
            customer:    s.customerName ?? "Sabina Heydarova",
            supplier:    s.supplierName ?? "Sabina Heydarova",
            orderId:     s.orderNumber ? `#${s.orderNumber}` : "#9187654366",
            payment:     s.paymentMethod ?? "Nağd",
            status:      s.status ?? "Tamamlandı", // Status üzrə filtr üçün
            product:     s.productName ?? "Məhsul A",
            department:  s.department ?? "Satış",
            section:     s.section ?? "Bölmə 1",
            // redaktə üçün
            password:    s.password ?? "********",
            phone:       s.phoneNumber ?? "",
            fin:         s.finCode ?? "",
        }));
    }, [getAllFighters]);

    /* Dinamik drop siyahıları */
    const companies   = useMemo(()=>Array.from(new Set(orders.map(o=>o.company))).sort(), [orders]);
    const departments = useMemo(()=>Array.from(new Set(orders.map(o=>o.department))).sort(), [orders]);
    const sections    = useMemo(()=>Array.from(new Set(orders.map(o=>o.section))).sort(), [orders]);
    const products    = useMemo(()=>Array.from(new Set(orders.map(o=>o.product))).sort(), [orders]);
    const statuses    = useMemo(()=>Array.from(new Set(orders.map(o=>o.status))), [orders]);

    /* Header “Tarix üzrə filtr” sürətli seçimləri */
    const quickDateOptions = [
        "Bugün", "Dünən", "Bu həftə", "Keçən həftə", "Bu ay", "Keçən ay"
    ];

    /* Sürətli tarix seçiminin aralığa çevrilməsi */
    const getQuickRange = (label) => {
        const now = new Date();
        const start = new Date(now);
        const end = new Date(now);
        const dow = now.getDay() || 7; // bazar = 7
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

    /* CƏDVƏL üçün filtr + axtarış nəticəsi */
    const filtered = useMemo(() => {
        let list = [...orders];

        // 1) Yuxarı global axtarış
        if (globalSearch.trim()) {
            const q = globalSearch.trim().toLowerCase();
            list = list.filter(r =>
                Object.keys(r).some(k => ["company","customer","supplier","orderId","payment","product","status"]
                    .some(key => key===k && String(r[k]).toLowerCase().includes(q)))
            );
        }

        // 2) Sütun daxili axtarış
        if (searchCol && searchTerm.trim()) {
            const val = searchTerm.toLowerCase();
            list = list.filter(r => String(r[searchCol] ?? "").toLowerCase().includes(val));
        }

        // 3) Şirkət / Şöbə / Bölmə / Məhsul
        if (companyF)   list = list.filter(r => r.company   === companyF);
        if (departmentF)list = list.filter(r => r.department=== departmentF);
        if (sectionF)   list = list.filter(r => r.section   === sectionF);
        if (productF)   list = list.filter(r => r.product   === productF);

        // 4) Status
        if (statusF) list = list.filter(r => r.status === statusF);

        // 5) Tarixlər
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
                if (to)   { const t = new Date(to); t.setHours(23,59,59,999); if (d > t) return false; }
                return true;
            });
        }

        // 6) Qiymət aralığı
        const pMin = priceMin !== "" ? Number(priceMin) : null;
        const pMax = priceMax !== "" ? Number(priceMax) : null;
        if (pMin !== null) list = list.filter(r => r.amountNum >= pMin);
        if (pMax !== null) list = list.filter(r => r.amountNum <= pMax);

        return list;
    }, [
        orders, globalSearch, searchCol, searchTerm,
        companyF, departmentF, sectionF, productF,
        statusF, dateQuickF, dateFrom, dateTo, priceMin, priceMax
    ]);

    /* Yadda saxla (demo) */
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
                {/* Başlıq */}
                <div className="headerr">
                    <div className="head">
                        <h2>Tarixçə</h2>
                        <p>Sifarişlərin bütün mərhələlər üzrə vəziyyəti bu bölmədə əks olunur.</p>
                    </div>
                </div>

                {/* ==== Şəkildəki FILTER BAR ==== */}
                <div className="filterbar">
                    <div className="searchbox">
                        <SearchIcon/>
                        <input
                            value={globalSearch}
                            onChange={(e)=>setGlobalSearch(e.target.value)}
                            placeholder="Axtarış edin..."
                        />
                    </div>

                    <div className="toolbar">
                        {/* Tarix üzrə filtr (funnel) */}
                        <div className={`toolbar-dd ${dateFilterOpen?"open":""}`}>
                            <button type="button" onClick={()=>setDateFilterOpen(v=>!v)}>
                                <Funnel/>&nbsp;Tarix üzrə filtr <Caret/>
                            </button>
                            <div className="toolbar-panel">
                                <div className="row">
                                    <label>Tarix seç</label>
                                    <select value={dateQuickF} onChange={(e)=>setDateQuickF(e.target.value)}>
                                        <option value="">Seç</option>
                                        {quickDateOptions.map(o=><option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div className="row two">
                                    <div>
                                        <label>Başlanğıc</label>
                                        <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} />
                                    </div>
                                    <div>
                                        <label>Bitiş</label>
                                        <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status üzrə filtr */}
                        <div className={`toolbar-dd ${statusFilterOpen?"open":""}`}>
                            <button type="button" onClick={()=>setStatusFilterOpen(v=>!v)}>
                                Status üzrə filtr <Caret/>
                            </button>
                            <div className="toolbar-panel">
                                <div className="row">
                                    <label>Status</label>
                                    <select value={statusF} onChange={(e)=>setStatusF(e.target.value)}>
                                        <option value="">Hamısı</option>
                                        {statuses.map(s=><option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alt filter sıra (Şirkət seçin ... Qiymət aralığı seç) */}
                <div className="filter-row">
                    <Dropdown label="Şöbə seç" value={departmentF} onChange={setDepartmentF} options={departments} placeholder="Şöbə" />
                    <Dropdown label="Bölmə seç" value={sectionF} onChange={setSectionF} options={sections} placeholder="Bölmə" />
                    <Dropdown label="Tarix seç" value={dateQuickF} onChange={setDateQuickF} options={quickDateOptions} placeholder="Tarix seç" />
                    <div className="range-dd">
                        <div className="range-label">Tarix aralığı seç</div>
                        <div className="range-row">
                            <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} />
                            <span>—</span>
                            <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} />
                        </div>
                    </div>
                    <Dropdown label="Məhsul seç" value={productF} onChange={setProductF} options={products} placeholder="Məhsul" />
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z" fill="#7A7A7A"/>
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

            {/* Edit modal */}
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

            {/* Delete modal (hazırda gizlidir; lazım olsa çağırın) */}
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
