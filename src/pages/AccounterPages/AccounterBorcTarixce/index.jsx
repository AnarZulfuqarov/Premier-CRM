import "./index.scss";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useDeleteAccountantMutation,
    useEditAccountantMutation,
    useGetAllAccountantsQuery,
} from "../../../services/adminApi.jsx";
import { usePopup } from "../../../components/Popup/PopupContext.jsx";

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
    "deliveredAt", "company", "amount", "customer", "supplier", "orderId", "payment"
]);

const AccounterBorcTarixce = () => {
    const navigate = useNavigate();
    const showPopup = usePopup();

    const [searchCol, setSearchCol]   = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingRow, setEditingRow] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(null);

    const { data: getAllFighters, refetch } = useGetAllAccountantsQuery();
    const [editFighter] = useEditAccountantMutation();
    const [deleteFighter] = useDeleteAccountantMutation();

    useEffect(() => { refetch(); }, []);

    // BACKEND-dən gələn datanı şəkilə uyğun “order” formatına çeviririk.
    const orders = useMemo(() => {
        const raw = getAllFighters?.data ?? [];
        return raw.map((s, i) => ({
            id: s.id,
            deliveredAt: s.deliveredAt ?? "16/05/25, 13:45",
            company:     s.companyName ?? s.name ?? "—",
            amount:      s.totalAmount ? `${s.totalAmount} ₼` : "325 ₼",
            customer:    s.customerName ?? "Sabina Heydarova",
            supplier:    s.supplierName ?? "Sabina Heydarova",
            orderId:     s.orderNumber ? `#${s.orderNumber}` : "#9187654366",
            payment:     s.paymentMethod ?? "Nağd",
            detail:      "Ətraflı bax →",
            // Redaktə üçün lazım ola biləcək əlavə sahələr
            password:    s.password ?? "********",
            phone:       s.phoneNumber ?? "",
            fin:         s.finCode ?? "",
        }));
    }, [getAllFighters]);

    // Axtarış
    const filtered = useMemo(() => {
        if (!searchCol || !searchTerm) return orders;
        const val = searchTerm.toLowerCase();
        return orders.filter((r) => String(r[searchCol] ?? "").toLowerCase().includes(val));
    }, [orders, searchCol, searchTerm]);

    // Yadda saxla (demo olaraq bir neçə sahəni saxlayırıq)
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
            showPopup("Sistem xətası", "Yenidən cəhd edin.", "error");
        }
    };

    return (
        <div className="accounter-borc-tarixce-main">
            <div className="accounter-borc-tarixce">
                <div className="headerr">
                    <div className="head">
                        <h2>Mühasibatlıq</h2>
                        <p>Şirkət daxilindəki bütün mühasibat əməliyyatlarını buradan izləyə bilərsiniz.</p>
                    </div>
                    <button onClick={() => navigate("/superAdmin/accounterAdd")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 22.5C6.21 22.5 1.5 17.79 1.5 12C1.5 6.21 6.21 1.5 12 1.5C17.79 1.5 22.5 6.21 22.5 12C22.5 17.79 17.79 22.5 12 22.5Z" fill="white"/>
                            <path d="M11.25 7.5v9c0 .42.33.75.75.75s.75-.33.75-.75v-9c0-.42-.33-.75-.75-.75s-.75.33-.75.75Z" fill="white"/>
                            <path d="M7.5 11.25h9c.42 0 .75.33.75.75s-.33.75-.75.75h-9a.75.75 0 0 1 0-1.5Z" fill="white"/>
                        </svg>
                        <span>Mühasib əlavə et</span>
                    </button>
                </div>

                <div className="order-table-wrapper">
                    {/* Sol – şəkilə uyğun columns */}
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
  <path d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z" fill="#474747"/>
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
                                    <td>{row.deliveredAt}</td>
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

                    {/* Sağ – sabit (sticky) Fəaliyyətlər */}
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

            {/* Delete modal */}
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
