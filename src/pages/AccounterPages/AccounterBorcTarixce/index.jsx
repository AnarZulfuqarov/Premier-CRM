import "./index.scss";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
    useDeleteAccountantMutation,
    useEditAccountantMutation,
    useEditDateBasedPaymentMutation,
    useEditVendorDebtsMutation,
    useGetAllVendorsIdQuery,
    useGetCompanyIdQuery,
    useGetDateBasedPaymentHistoryQuery,
} from "../../../services/adminApi.jsx";
import {usePopup} from "../../../components/Popup/PopupContext.jsx";

const columns = [
    { key: "orderId", label: "Faktura İD" },
];

const searchableKeys = new Set([
    "date",
    "vendorName",
    "totalDebt",
    "paidAmount",
    "reverseAmount",
    "remainingDebt",
    "paymentMethod",
    "orderId",
]);

const parseAZDate = (s) => {
    if (!s) return null;
    const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(s).trim());
    if (!m) return new Date(s);
    const [, dd, MM, yyyy] = m;
    return new Date(`${yyyy}-${MM}-${dd}T00:00:00`);
};

const formatToAZDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    const dd = String(date.getDate()).padStart(2, "0");
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}.${MM}.${yyyy}`;
};

const AccounterBorcTarixce = () => {
    const navigate = useNavigate();
    const showPopup = usePopup();
    const { id } = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const { data: getAllVendorsId } = useGetAllVendorsIdQuery(id);
    const vendor = getAllVendorsId?.data;
    const [borcCompanyId, setBorcCompanyId] = useState(() => {
        try {
            const v = localStorage.getItem("borcCompanyId");
            return v ? (isNaN(+v) ? v : +v) : null;
        } catch {
            return null;
        }
    });

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const formattedStartDate = formatToAZDate(startDate);
    const formattedEndDate = formatToAZDate(endDate);
    const skipQuery = !formattedStartDate || !formattedEndDate || !borcCompanyId || !id;

    const { data: getPaymentHistory,refetch } = useGetDateBasedPaymentHistoryQuery(
        {
            companyId: borcCompanyId,
            vendorId: id,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
        },
        { skip: skipQuery }
    );

    const vendorDebts = getPaymentHistory?.data?.history ?? [];
    const totalDebt = getPaymentHistory?.data?.summary?.totalDebt ?? 0;

    const { data: companyRes } = useGetCompanyIdQuery(borcCompanyId, { skip: !borcCompanyId });
    const companyObj = companyRes?.data ?? companyRes ?? null;
    const companyNameFromApi = companyObj?.name || companyObj?.title || companyObj?.companyName || "";


    const [editDateBased, { isLoading: isSaving }] = useEditDateBasedPaymentMutation();

    useEffect(() => {
        if (borcCompanyId && companyNameFromApi) {
            setCompanyF(companyNameFromApi);
            setDepartmentF("");
            setSectionF("");
        }
    }, [borcCompanyId, companyNameFromApi]);

    const [modalData, setModalData] = useState({
        id: "",
        paidDebt: 0,
        returnedDebt: 0,
        paymentType: "nagd",
        paymentDate: "",
        originalInvoices: [],
        newInvoices: [],
        newInvoice: "",
        editIdx: null,
        editValue: "",
        vendorId: "",
        paymentPrice:0,
    });

    const toUiPayment = (val) => (String(val).toLowerCase() === "kart" ? "kart" : "nagd");
    const toServerPayment = (val) => (String(val).toLowerCase() === "kart" ? "kart" : "nagd");

    const closeModal = () => setModalOpen(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupInvoices, setPopupInvoices] = useState([]);
    const openInvoicePopup = (invoices) => {
        setPopupInvoices(invoices || []);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setPopupInvoices([]);
    };
    const saveModal = async () => {
        const ptServer = toServerPayment(modalData.paymentType || "nagd");
        const payload = {
            vendorId: modalData.vendorId,
            companyId: String(borcCompanyId),
            paymentAmount: Number(modalData.paidDebt) || 0,
            reverseAmount: Number(modalData.returnedDebt) || 0,
            paymentMethod: ptServer,
            paymentDate: modalData.paymentDate,
            invoices: modalData.newInvoices.length > 0
                ? [...(modalData.originalInvoices || []), ...modalData.newInvoices].map(String)
                : null,
        };

        try {
            await editDateBased(payload).unwrap();
            setModalOpen(false);
            refetch();
            showPopup("Dəyişiklik yadda saxlandı", "Uğurla tamamlandı", "success");
        } catch (e) {
            console.error("editDateBased failed:", e);
            showPopup("Sistem xətası", "Yenidən cəhd edin.", "error");
        }
    };

    const orders = useMemo(() => {
        return vendorDebts.map((o) => {
            const dateText = o?.date || "";
            const date = parseAZDate(o?.date);
            return {
                orderId: `#${String(o?.vendorId || "").slice(0, 8)}`,
                date: date ? date.toISOString() : "",
                dateText,
                totalDebt: `${Number(o?.totalDebt || 0).toLocaleString("az-Latn-AZ")} ₼`,
                paidAmount: `${Number(o?.paidAmount || 0).toLocaleString("az-Latn-AZ")} ₼`,
                reverseAmount: `${Number(o?.reverseAmount || 0).toLocaleString("az-Latn-AZ")} ₼`,
                remainingDebt: `${Number(o?.remainingDebt || 0).toLocaleString("az-Latn-AZ")} ₼`,
                paymentMethod: o?.paymentMethod || "—",
                vendorName: o?.vendorName || "",
                invoices: o?.invoices || [],
                vendorId: o?.vendorId || "",
            };
        });
    }, [vendorDebts]);

    const openEditModal = (row) => {
        setModalData({
            id: row.orderId,
            paidDebt: parseFloat(row.remainingDebt) || 0,
            returnedDebt: parseFloat(row.reverseAmount) || 0,
            paymentType: toUiPayment(row.paymentMethod && row.paymentMethod !== "—" ? row.paymentMethod : "nagd"),
            paymentDate: row.dateText,
            originalInvoices: Array.isArray(row.invoices) ? [...row.invoices] : [],
            newInvoices: [],
            newInvoice: "",
            editIdx: null,
            editValue: "",
            vendorId: row.vendorId,
            paymentPrice:row.remainingDebt.split(' ')[0],
        });
        setModalOpen(true);
    };

    const [globalSearch, setGlobalSearch] = useState("");
    const [searchCol, setSearchCol] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [companyF, setCompanyF] = useState("");
    const [departmentF, setDepartmentF] = useState("");
    const [sectionF, setSectionF] = useState("");
    const [dateQuickF, setDateQuickF] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const DateField = ({ label, value, onChange, placeholder = "dd/mm/yy" }) => {
        const [type, setType] = useState("text");
        return (
            <div className="field">
                <span className="field__label">{label} :</span>
                <label className="input2">
                    <input
                        type={type}
                        value={value}
                        placeholder={placeholder}
                        onFocus={() => setType("date")}
                        onBlur={(e) => {
                            if (!e.target.value) setType("text");
                        }}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    <svg className="icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                            d="M7 2v2M17 2v2M3 8h18M5 5h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
                            fill="none"
                            stroke="#9A9A9A"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                        />
                    </svg>
                </label>
            </div>
        );
    };

    const filtered = useMemo(() => {
        let list = [...orders];
        if (globalSearch.trim()) {
            const q = globalSearch.trim().toLowerCase();
            list = list.filter((r) =>
                ["dateText", "vendorName", "totalDebt", "paidAmount", "reverseAmount", "remainingDebt", "paymentMethod", "orderId"].some(
                    (key) => String(r[key] ?? "").toLowerCase().includes(q)
                )
            );
        }
        if (searchCol && searchTerm.trim()) {
            const val = searchTerm.toLowerCase();
            list = list.filter((r) => String(r[searchCol] ?? "").toLowerCase().includes(val));
        }
        let from = dateFrom ? new Date(dateFrom) : null;
        let to = dateTo ? new Date(dateTo) : null;
        if (dateQuickF) {
            const [qs, qe] = getQuickRange(dateQuickF);
            from = qs;
            to = qe;
        }
        if (from || to) {
            list = list.filter((r) => {
                const d = new Date(r.date);
                if (from && d < from) return false;
                if (to) {
                    const t = new Date(to);
                    t.setHours(23, 59, 59, 999);
                    if (d > t) return false;
                }
                return true;
            });
        }
        return list;
    }, [orders, globalSearch, searchCol, searchTerm, dateQuickF, dateFrom, dateTo]);

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

    const normalize = (str) => String(str).toLowerCase().trim();
    const companyId = localStorage.getItem("borcCompanyId");
    const { data: getCompanyId } = useGetCompanyIdQuery(companyId);
    const company = getCompanyId?.data;
    console.log(modalData)
    return (
        <div className="accounter-borc-tarixce-main">
            <div className="accounter-borc-tarixce">
                <div className="headerr">
                    <div className="head">
                        <h2>Borc tarixçəsi</h2>
                        <p>Siz buradan vendora olan borclarınıza nəzarət edə və ödəyə bilərsiniz.</p>
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
                                <h5>{totalDebt.toLocaleString("az-Latn-AZ")} ₼</h5>
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
                        <NavLink className="link" to={`/accounter/borc/${companyId}`}>
                            — {company?.name} ({vendor?.name})
                        </NavLink>{" "}
                        — Borc tarixçəsi
                    </h2>
                </div>
                <div className="table-toolbar">
                    <div className="filters">
                        <DateField label="Başlanğıc tarix" value={startDate} onChange={setStartDate} />
                        <DateField label="Son tarix" value={endDate} onChange={setEndDate} />
                    </div>
                </div>
                <div className="tablehead">
                    <h2>Ödəniş tarixçəsi</h2>
                </div>
                <div className="order-table-wrapper">
                    <div className="scrollable-part">
                        <table>
                            <thead>
                            <tr>
                                <th>Tarix</th>
                                <th>Borc</th>
                                <th>Geri qaytarılan borc</th>
                                <th>Ödənilən borc</th>
                                <th>Qalıq borc</th>
                                <th>Ödəniş üsulu</th>
                                {columns.map((c) => (
                                    <th key={c.key}>
                                        {c.label}
                                        {searchableKeys.has(c.key) && (
                                            <span
                                                className="search-icon"
                                                onClick={() => setSearchCol(searchCol === c.key ? null : c.key)}
                                            >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                          >
                            <path
                                d="M17.71 16.29L14.31 12.9C15.407 11.5025 16.0022 9.77666 16 8C16 6.41775 15.5308 4.87103 14.6518 3.55544C13.7727 2.23985 12.5233 1.21447 11.0615 0.608967C9.59966 0.00346625 7.99113 -0.15496 6.43928 0.153721C4.88743 0.462403 3.46197 1.22433 2.34315 2.34315C1.22433 3.46197 0.462403 4.88743 0.153721 6.43928C-0.15496 7.99113 0.00346625 9.59966 0.608967 11.0615C1.21447 12.5233 2.23985 13.7727 3.55544 14.6518C4.87103 15.5308 6.41775 16 8 16C9.77666 16.0022 11.5025 15.407 12.9 14.31L16.29 17.71C16.383 17.8037 16.4936 17.8781 16.6154 17.9289C16.7373 17.9797 16.868 18.0058 17 18.0058C17.132 18.0058 17.2627 17.9797 17.3846 17.9289C17.5064 17.8781 17.617 17.8037 17.71 17.71C17.8037 17.617 17.8781 17.5064 17.9289 17.3846C17.9797 17.2627 18.0058 17.132 18.0058 17C18.0058 16.868 17.9797 16.7373 17.9289 16.6154C17.8781 16.4936 17.8037 16.383 17.71 16.29ZM2 8C2 6.81332 2.3519 5.65328 3.01119 4.66658C3.67047 3.67989 4.60755 2.91085 5.7039 2.45673C6.80026 2.0026 8.00666 1.88378 9.17055 2.11529C10.3344 2.3468 11.4035 2.91825 12.2426 3.75736C13.0818 4.59648 13.6532 5.66558 13.8847 6.82946C14.1162 7.99335 13.9974 9.19975 13.5433 10.2961C13.0892 11.3925 12.3201 12.3295 11.3334 12.9888C10.3467 13.6481 9.18669 14 8 14C6.4087 14 4.88258 13.3679 3.75736 12.2426C2.63214 11.1174 2 9.5913 2 8Z"
                                fill="#7A7A7A"
                            />
                          </svg>
                        </span>
                                        )}
                                        {searchCol === c.key && (
                                            c.key === "date" ? (
                                                <div className="search-input-wrapper">
                                                    <input
                                                        type="date"
                                                        value={dateFrom}
                                                        onChange={(e) => {
                                                            setDateQuickF("");
                                                            setDateFrom(e.target.value);
                                                        }}
                                                    />
                                                    <span>—</span>
                                                    <input
                                                        type="date"
                                                        value={dateTo}
                                                        onChange={(e) => {
                                                            setDateQuickF("");
                                                            setDateTo(e.target.value);
                                                        }}
                                                    />
                                                    <span
                                                        className="close-search"
                                                        onClick={() => {
                                                            setSearchCol(null);
                                                            setDateFrom("");
                                                            setDateTo("");
                                                            setDateQuickF("");
                                                        }}
                                                    >
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                              >
                                <path
                                    d="M12.5 3.5 3.5 12.5M3.5 3.5 12.5 12.5"
                                    stroke="#7A7A7A"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                                                </div>
                                            ) : (
                                                <div className="search-input-wrapper">
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        placeholder={`Axtar: ${c.label}`}
                                                    />
                                                    <span
                                                        className="close-search"
                                                        onClick={() => {
                                                            setSearchCol(null);
                                                            setSearchTerm("");
                                                        }}
                                                    >
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                              >
                                <path
                                    d="M12.5 3.5 3.5 12.5M3.5 3.5 12.5 12.5"
                                    stroke="#7A7A7A"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                                                </div>
                                            )
                                        )}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {skipQuery ? (
                                <tr>
                                    <td colSpan={6 + columns.length} style={{ textAlign: "center" }}>
                                        Tarix aralığı seçin
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6 + columns.length} style={{ textAlign: "center" }}>
                                        Məlumat yoxdur
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((row, idx) => (
                                    <tr key={row.orderId ?? idx}>
                                        <td
                                            style={{ cursor: "pointer" }}
                                            onClick={() => navigate(`/accounter/borc/history/${row.dateText}`)}
                                        >
                                            {row.dateText}
                                        </td>
                                        <td>{row.totalDebt}</td>
                                        <td>{row.reverseAmount}</td>
                                        <td>{row.paidAmount}</td>
                                        <td>{row.remainingDebt}</td>
                                        <td>{row.paymentMethod}</td>
                                        <td
                                            style={{ cursor: "pointer" }}
                                            onClick={() => openInvoicePopup(row.invoices)}
                                        >
                                            {Array.isArray(row.invoices) && row.invoices.length > 0
                                                ? (
                                                    <div style={{
                                                        display:"flex",
                                                        justifyContent:"space-between",
                                                        alignItems:"center",
                                                    }}>
                                                        {row.invoices[0].invoiceName} <span className="invoice-count">{row.invoices.length}</span>
                                                    </div>
                                                )
                                                : "—"}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                    <div className="fixed-column">
                        <div className="header">Fəaliyyət</div>
                        {skipQuery || filtered.length === 0 ? (
                            <div className="cell"></div>
                        ) : (
                            filtered.map((row, i) => (
                                <div key={row.orderId ?? i} className="cell">
                                    {(parseFloat(row.remainingDebt) !== 0 ) && (
                                        <button className="detail-btnn" onClick={() => openEditModal(row)}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="21"
                                                viewBox="0 0 20 21"
                                                fill="none"
                                            >
                                                <path
                                                    d="M1.66602 3.78516H7.29685C7.62527 3.78512 7.95048 3.84979 8.25389 3.97547C8.55731 4.10116 8.83299 4.28539 9.06518 4.51766L11.666 7.11849M4.16602 11.2852H1.66602M7.08268 6.28516L8.74935 7.95182C8.85878 8.06126 8.94559 8.19118 9.00482 8.33416C9.06404 8.47714 9.09453 8.63039 9.09453 8.78516C9.09453 8.93992 9.06404 9.09317 9.00482 9.23615C8.94559 9.37914 8.85878 9.50905 8.74935 9.61849C8.63991 9.72792 8.51 9.81473 8.36701 9.87396C8.22403 9.93318 8.07078 9.96367 7.91602 9.96367C7.76125 9.96367 7.608 9.93318 7.46502 9.87396C7.32204 9.81473 7.19212 9.72792 7.08268 9.61849L5.83268 8.36849C5.11602 9.08516 3.98018 9.16599 3.16852 8.55766L2.91602 8.36849"
                                                    stroke="#FF6363"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M4.16602 9.20052V12.9505C4.16602 14.5222 4.16602 15.3072 4.65435 15.7955C5.14268 16.2839 5.92768 16.2839 7.49935 16.2839H14.9993C16.571 16.2839 17.356 16.2839 17.8443 15.7955C18.3327 15.3072 18.3327 14.5222 18.3327 12.9505V10.4505C18.3327 8.87885 18.3327 8.09385 17.8443 7.60552C17.356 7.11719 16.571 7.11719 14.9993 7.11719H7.91602"
                                                    stroke="#FF6363"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M12.7077 11.7005C12.7077 12.0873 12.554 12.4582 12.2805 12.7317C12.0071 13.0052 11.6361 13.1589 11.2493 13.1589C10.8626 13.1589 10.4916 13.0052 10.2182 12.7317C9.94466 12.4582 9.79102 12.0873 9.79102 11.7005C9.79102 11.3137 9.94466 10.9428 10.2182 10.6693C10.4916 10.3958 10.8626 10.2422 11.2493 10.2422C11.6361 10.2422 12.0071 10.3958 12.2805 10.6693C12.554 10.9428 12.7077 11.3137 12.7077 11.7005Z"
                                                    stroke="#FF6363"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>{" "}
                                            Ödə
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {modalOpen && (
                    <div className="debt-modal__overlay" onClick={closeModal}>
                        <div
                            className="debt-modal__box"
                            onClick={(e) => e.stopPropagation()}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="debt-modal-title"
                        >
                            <div className="debt-modal__header">
                                <h3 id="debt-modal-title">Dəyişiklik et</h3>
                                <button className="icon-btn close" onClick={closeModal} aria-label="Bağla">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M12.6673 3.33203L3.33398 12.6654M3.33398 3.33203L12.6673 12.6654"
                                            stroke="black"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="debt-modal__row debt-modal__row--two">
                                <div className="field">
                                    <label>Ödənilən borc</label>
                                    <div className="input-with-icon">
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={modalData.paidDebt}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Ensure the value does not exceed paymentPrice
                                                if (value === "" || Number(value) <= Number(modalData.paymentPrice)) {
                                                    setModalData((s) => ({ ...s, paidDebt: value }));
                                                }
                                            }}
                                            min={0}
                                            max={parseInt(modalData.paymentPrice)}
                                        />
                                        <button className="ghost-icon" tabIndex={-1} aria-hidden>
                                            ✎
                                        </button>
                                    </div>
                                </div>
                                <div className="field">
                                    <label>Geri qaytarılan məbləğ</label>
                                    <div className="input-with-icon">
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={modalData.returnedDebt}
                                            onChange={(e) => setModalData((s) => ({ ...s, returnedDebt: e.target.value }))}
                                            min={0}
                                        />
                                        <button className="ghost-icon" tabIndex={-1} aria-hidden>
                                            ✎
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="debt-modal__row">
                                <div className="field">
                                    <label>Ödəniş üsulu</label>
                                    <div className="input-with-icon">
                                        <select
                                            value={modalData.paymentType}
                                            onChange={(e) =>
                                                setModalData((s) => ({ ...s, paymentType: toUiPayment(e.target.value) }))
                                            }
                                        >
                                            <option value="nagd">Nağd</option>
                                            <option value="kart">Kart</option>
                                        </select>
                                        <button className="ghost-icon" tabIndex={-1} aria-hidden></button>
                                    </div>
                                </div>
                            </div>
                            <div className="debt-modal__row" >
                                <div className="field">
                                    <label>Fakturalar</label>
                                    <div style={{
                                        maxHeight:"200px",
                                        overflowY:"auto"
                                    }}>
                                        {modalData.originalInvoices.length > 0 && (
                                            <>
                                                <div className="muted-title">Mövcud (backend):</div>
                                                <ul className="invoice-list readonly">
                                                    {modalData.originalInvoices?.map((inv, idx) => (
                                                        <li key={`orig-${idx}`}>
                            <span className="invoice-chip" title="Backend-dən gəlib, dəyişmək olmaz">
                              {inv.invoiceName}
                            </span>
                                                            <div className="actions">
                                                                <button className="icon-btn" disabled title="Düzəltmək olmaz">
                                                                    ✎
                                                                </button>
                                                                <button className="icon-btn danger" disabled title="Silmək olmaz">
                                                                    🗑
                                                                </button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                        {modalData.newInvoices.length > 0 && (
                                            <>
                                                <div className="muted-title">Yeni əlavə etdikləriniz:</div>
                                                <ul className="invoice-list">
                                                    {modalData.newInvoices.map((inv, idx) => (
                                                        <li key={`new-${idx}`}>
                                                            {modalData.editIdx === idx ? (
                                                                <div className="input-with-icon">
                                                                    <input
                                                                        value={modalData.editValue}
                                                                        onChange={(e) =>
                                                                            setModalData((s) => ({ ...s, editValue: e.target.value }))
                                                                        }
                                                                        autoFocus
                                                                    />
                                                                    <button
                                                                        className="ghost-icon"
                                                                        title="Yadda saxla"
                                                                        onClick={() =>
                                                                            setModalData((s) => {
                                                                                const nextVal = (s.editValue || "").trim();
                                                                                if (!nextVal) return { ...s };
                                                                                const inOriginal = s.originalInvoices.some(
                                                                                    (o) => normalize(o) === normalize(nextVal)
                                                                                );
                                                                                const inNewOther = s.newInvoices.some(
                                                                                    (n, i) => i !== idx && normalize(n) === normalize(nextVal)
                                                                                );
                                                                                if (inOriginal || inNewOther) return { ...s };
                                                                                const copy = [...s.newInvoices];
                                                                                copy[idx] = nextVal;
                                                                                return { ...s, newInvoices: copy, editIdx: null, editValue: "" };
                                                                            })
                                                                        }
                                                                    >
                                                                        ✔
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <span className="invoice-chip">{inv}</span>
                                                                    <div className="actions">
                                                                        <button
                                                                            className="icon-btn"
                                                                            title="Düzəlt"
                                                                            onClick={() =>
                                                                                setModalData((s) => ({ ...s, editIdx: idx, editValue: inv }))
                                                                            }
                                                                        >
                                                                            ✎
                                                                        </button>
                                                                        <button
                                                                            className="icon-btn danger"
                                                                            title="Sil"
                                                                            onClick={() =>
                                                                                setModalData((s) => {
                                                                                    const copy = [...s.newInvoices];
                                                                                    copy.splice(idx, 1);
                                                                                    return { ...s, newInvoices: copy };
                                                                                })
                                                                            }
                                                                        >
                                                                            🗑
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                    <div className="input-with-icon add-invoice">
                                        <input
                                            placeholder="Yeni faktura əlavə et"
                                            value={modalData.newInvoice}
                                            onChange={(e) => setModalData((s) => ({ ...s, newInvoice: e.target.value }))}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    const v = (modalData.newInvoice || "").trim();
                                                    if (!v) return;
                                                    const inOriginal = modalData.originalInvoices.some(
                                                        (o) => normalize(o) === normalize(v)
                                                    );
                                                    const inNew = modalData.newInvoices.some((n) => normalize(n) === normalize(v));
                                                    if (inOriginal || inNew) return;
                                                    setModalData((s) => ({
                                                        ...s,
                                                        newInvoices: [...s.newInvoices, v],
                                                        newInvoice: "",
                                                    }));
                                                }
                                            }}
                                        />
                                        <button
                                            className="ghost-icon"
                                            title="Əlavə et"
                                            onClick={() => {
                                                const v = (modalData.newInvoice || "").trim();
                                                if (!v) return;
                                                const inOriginal = modalData.originalInvoices.some(
                                                    (o) => normalize(o) === normalize(v)
                                                );
                                                const inNew = modalData.newInvoices.some((n) => normalize(n) === normalize(v));
                                                if (inOriginal || inNew) return;
                                                setModalData((s) => ({
                                                    ...s,
                                                    newInvoices: [...s.newInvoices, v],
                                                    newInvoice: "",
                                                }));
                                            }}
                                        >
                                            ＋
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="debt-modal__footer">
                                <button className="primary" onClick={saveModal} disabled={isSaving}>
                                    {isSaving ? "Yadda saxlanır..." : "Yadda saxla"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {isPopupOpen && (
                    <div className="invoice-popup__overlay" onClick={closePopup}>
                        <div className="invoice-popup__box" onClick={(e) => e.stopPropagation()}>
                            <div className="invoice-popup__header">
                                <h3>Fakturalar</h3>
                                <button className="icon-btn close" onClick={closePopup} aria-label="Bağla">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M12.6673 3.33203L3.33398 12.6654M3.33398 3.33203L12.6673 12.6654"
                                            stroke="black"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="invoice-popup__content">
                                <ul className="invoice-list">
                                    {popupInvoices.length > 0 ? (
                                        popupInvoices.map((invoice, idx) => (
                                            <li key={idx}>
                                                <span className="invoice-chip">{invoice.invoiceName}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li>Məlumat yoxdur</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccounterBorcTarixce;