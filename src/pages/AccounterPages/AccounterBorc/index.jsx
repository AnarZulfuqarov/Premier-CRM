import './index.scss';
import {useEffect, useRef, useState} from 'react';
import {FaTimes} from 'react-icons/fa';
import {
    useGetAllVendorsQuery,
    useGetAllCompaniesQuery,
    useGetVendorDebtsQuery,
    useEditVendorDebtsMutation, useGetCompanyIdQuery
} from '../../../services/adminApi.jsx';
import {NavLink, useNavigate, useParams} from "react-router-dom";

const LS_KEY = 'borcCompanyId';

// payment helpers
const toUiPayment = (val) => (String(val).toLowerCase() === 'kart' ? 'kart' : 'nagd');
const toServerPayment = (val) => (String(val).toLowerCase() === 'kart' ? 'kart' : 'nagd');
const labelPayment = (val) => (val === 'kart' ? 'Kart' : 'Nağd');
const normalize = (x) => (x || '').trim().toLowerCase();

const AccounterBorc = () => {
    const navigate = useNavigate();

    const initialRows = [
        {
            id: 1,
            lastOrderAt: '16/05/25, 13:45',
            companyId: 101,
            company: 'Şirvanşah',
            vendorId: 1,
            vendor: 'Bravo',
            totalDebt: 325,
            returned: 20,
            paid: 100,
            remaining: 205,
            method: 'nagd',
            invoices: ['INV-1','INV-2'],
            invoiceCount: 8
        },
        {
            id: 2,
            lastOrderAt: '16/05/25, 13:45',
            companyId: 102,
            company: 'Qalaaltı',
            vendorId: 2,
            vendor: 'Araz',
            totalDebt: 325,
            returned: 10,
            paid: 165,
            remaining: 150,
            method: 'kart',
            invoices: ['A-1'],
            invoiceCount: 5
        },
    ];
    const [rows, setRows] = useState(initialRows);

    /* ------- Başlıq filterləri ------- */
    const [activeHeaderSearch, setActiveHeaderSearch] = useState(null); // 'date' | 'company' | 'vendor' | null
    const [searchDate, setSearchDate] = useState('');
    const [searchCompany, setSearchCompany] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({
        id: '',
        paidDebt: 0,
        returnedDebt: 0,
        paymentType: 'nagd',       // 'nagd' | 'kart'
        originalInvoices: [],      // backend-dən gələnlər (readonly)
        newInvoices: [],           // yalnız yenilər (edit/sil)
        newInvoice: '',
        editIdx: null,             // newInvoices üçün edit index
        editValue: '',
    });





    /* ------- Vendor (başlıqda searchable select) ------- */
    const {data: getAllVendors} = useGetAllVendorsQuery();
    const vendors = getAllVendors?.data ?? [];
    const [searchVendorText, setSearchVendorText] = useState('');
    const [searchVendorId, setSearchVendorId] = useState('');
    const [vendorOpen, setVendorOpen] = useState(false);
    const [vendorHover, setVendorHover] = useState(-1);
    const vendorSearchRef = useRef(null);

    /* ------- Şirkət seçimi (üst toolbar) — API-dən ------- */
    const {data: getAllCompanies} = useGetAllCompaniesQuery();
    const companies = (getAllCompanies?.data ?? [])
        .map(c => ({
            id: String(c.id ?? c.companyId ?? c.value ?? ''),
            name: String(c.name ?? c.companyName ?? c.label ?? '').trim(),
        }))
        .filter(c => c.id && c.name)
        .sort((a, b) => a.name.localeCompare(b.name, 'az'));

    const [companyOpen, setCompanyOpen] = useState(false);
    const [companyQuery, setCompanyQuery] = useState('');
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [selectedCompanyName, setSelectedCompanyName] = useState('');
    const companyRef = useRef(null);


    /* ------- Outside click close (vendor + company) ------- */
    useEffect(() => {
        const onDown = (e) => {
            if (!vendorSearchRef.current?.contains(e.target)) setVendorOpen(false);
            if (!companyRef.current?.contains(e.target)) setCompanyOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, []);

    /* ------- Vendor options filter ------- */
    const filteredVendorOptions = vendors
        .filter(v => (v?.name ?? '').toLowerCase().includes(searchVendorText.toLowerCase()))
        .slice(0, 100);

    const selectVendor = (v) => {
        setSearchVendorText(v.name);
        setSearchVendorId(String(v.id));
        setVendorOpen(false);
        setVendorHover(-1);
    };

    /* ------- Company options (API-dən) filter ------- */



    /* ------- İlk yüklənmədə localStorage-dan bərpa ------- */
    useEffect(() => {
        if (!companies.length) return;

        const lsId = (() => {
            try {
                return localStorage.getItem(LS_KEY) || '';
            } catch {
                return '';
            }
        })();

        if (lsId && companies.some(c => String(c.id) === String(lsId))) {
            const c = companies.find(c => String(c.id) === String(lsId));
            if (c) {
                setSelectedCompanyId(String(c.id));
                setSelectedCompanyName(c.name);
                setCompanyQuery('');
            }
        } else {
            const first = companies[0];
            setSelectedCompanyId(String(first.id));
            setSelectedCompanyName(first.name);
            setCompanyQuery('');
            try {
                localStorage.setItem(LS_KEY, String(first.id));
            } catch {}
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companies.length]);

    /* ------- Tarixi ISO-ya çevir (başlıq filtr üçün) ------- */
    const toISODate = (s) => {
        if (!s) return null;
        const datePart = s.split(',')[0].trim().split(' ')[0].trim();
        const parts = datePart.includes('.') ? datePart.split('.') : datePart.split('/');
        if (parts.length < 3) return null;
        let [dd, mm, yy] = parts;
        if (yy.length === 2) yy = `20${yy}`;
        dd = dd.padStart(2, '0');
        mm = mm.padStart(2, '0');
        return `${yy}-${mm}-${dd}`;
    };

    /* ------- Cədvəl filteri ------- */
    const filteredRows = rows.filter(r => {
        const rowISO = toISODate(r.lastOrderAt);
        const byDate = !searchDate || rowISO === searchDate;
        const byCompanyHeader = !searchCompany || (r.company ?? '').toLowerCase().includes(searchCompany.toLowerCase());

        const byCompanyTop = !selectedCompanyId
            ? true
            : (r.companyId != null
                ? String(r.companyId) === String(selectedCompanyId)
                : (r.company ?? '').toLowerCase() === selectedCompanyName.toLowerCase());

        let byVendor = true;
        if (searchVendorText) {
            if (searchVendorId && r.vendorId != null) {
                byVendor = String(r.vendorId) === String(searchVendorId);
            } else {
                const rowVendorName = r.vendor ?? '';
                byVendor = rowVendorName.toLowerCase().includes(searchVendorText.toLowerCase());
            }
        }

        return byDate && byCompanyHeader && byCompanyTop && byVendor;
    });
    const {id} = useParams();

    /* ================= RTK Query: Vendor Debts ================= */
    const {data: getVendorDebts} =
        useGetVendorDebtsQuery(id);
const {data:getCompanyId} = useGetCompanyIdQuery(id)
    const company = getCompanyId?.data
    /* Tarixi formatla: ISO/string -> "dd/mm/yy, HH:mm" */
    const fmtDateTime = (v) => {
        if (!v) return '-';
        // "10.09.2025 14:25" kimi gəlirsə, əl ilə parse
        if (typeof v === 'string' && /^\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}/.test(v)) {
            const [dpart, tpart] = v.split(' ');
            const [dd, mm, yyyy] = dpart.split('.');
            const [HH, MM] = tpart.split(':');
            const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(HH), Number(MM));
            if (!Number.isNaN(d.getTime())) {
                const dd2 = String(d.getDate()).padStart(2, '0');
                const mm2 = String(d.getMonth() + 1).padStart(2, '0');
                const yy2 = String(d.getFullYear()).slice(-2);
                const hh2 = String(d.getHours()).padStart(2, '0');
                const mi2 = String(d.getMinutes()).padStart(2, '0');
                return `${dd2}/${mm2}/${yy2}, ${hh2}:${mi2}`;
            }
        }
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) return '-';
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yy = String(d.getFullYear()).slice(-2);
        const hh = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');
        return `${dd}/${mm}/${yy}, ${hh}:${mi}`;
    };

    useEffect(() => {
        const list = getVendorDebts?.data;
        if (!list) return;

        const mapped = list.map((d, idx) => {
            const total = Number(d.totalDebt ?? 0);
            const paid = Number(d.paidDebt ?? 0);
            const ret = Number(d.repayableDebt ?? 0);
            const rem = Number(d.unpaidDebt ?? (total - paid - ret));
            const invoicesArr = Array.isArray(d.vendordebtInvoices) ? d.vendordebtInvoices : [];
            const invoicesCount = invoicesArr.length;

            return {
                id: d.id ?? idx + 1,
                lastOrderAt: fmtDateTime(d.lastOrderTime),
                companyId: d.companyId ?? null,
                company: d.companyName ?? '',
                vendorId: d.vendorDto?.id ?? null,
                vendor: d.vendorDto?.name ?? '',
                totalDebt: total,
                returned: ret,
                paid: paid,
                remaining: rem,
                method: d.paymentType || '-',              // 'nagd' | 'kart' | '-'
                invoices: invoicesArr,                     // cədvəldə saxlayırıq
                invoiceCount: invoicesCount,
            };
        });

        setRows(mapped);
    }, [getVendorDebts]);



    return (
        <div className="accounter-borc-main">
            <div className="accounter-borc">
                {/* Başlıq */}
                <div className="headerr">
                    <div className="head">
                        <h2>Borc</h2>
                        <p>Vendorlara edilən ödənişləri və qalan borcları izləyin.</p>
                    </div>
                </div>

                <div className={"root"}>
                    <h2 >
                        <NavLink className="link" to="/accounter/borc">— Şirkətlər</NavLink>{' '}
                        — {company?.name} (Borc)
                    </h2>
                </div>

                {/* Cədvəl */}
                <div className="table-wrapper">
                    <div className="table-scroll">
                        <table className="order-history-detail-supplier__table">
                            <thead>
                            <tr>

                                <th>
                                    {activeHeaderSearch === 'vendor' ? (
                                        <div className="th-search vendor-search" ref={vendorSearchRef}>
                                            <input
                                                autoFocus
                                                value={searchVendorText}
                                                onFocus={() => setVendorOpen(true)}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setSearchVendorText(val);
                                                    const exact = vendors.find(v => (v.name ?? '').toLowerCase() === val.toLowerCase());
                                                    setSearchVendorId(exact ? String(exact.id) : '');
                                                    setVendorOpen(true);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (!vendorOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) setVendorOpen(true);
                                                    if (e.key === 'ArrowDown') {
                                                        e.preventDefault();
                                                        setVendorHover(h => Math.min(h + 1, filteredVendorOptions.length - 1));
                                                    } else if (e.key === 'ArrowUp') {
                                                        e.preventDefault();
                                                        setVendorHover(h => Math.max(h - 1, 0));
                                                    } else if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const v = filteredVendorOptions[vendorHover] ?? filteredVendorOptions[0];
                                                        if (v) selectVendor(v);
                                                    } else if (e.key === 'Escape') {
                                                        setVendorOpen(false);
                                                    }
                                                }}
                                                placeholder="Vendor seç / axtar..."
                                            />
                                            <FaTimes
                                                onClick={() => {
                                                    setActiveHeaderSearch(null);
                                                    setSearchVendorText('');
                                                    setSearchVendorId('');
                                                    setVendorOpen(false);
                                                    setVendorHover(-1);
                                                }}
                                            />
                                            {vendorOpen && (
                                                <ul className="vendor-dropdown">
                                                    {filteredVendorOptions.length === 0 ? (
                                                        <li className="muted">Nəticə yoxdur</li>
                                                    ) : (
                                                        filteredVendorOptions.map((v, idx) => (
                                                            <li
                                                                key={v.id}
                                                                className={idx === vendorHover ? 'active' : ''}
                                                                onMouseEnter={() => setVendorHover(idx)}
                                                                onMouseDown={(e) => {
                                                                    e.preventDefault();
                                                                    selectVendor(v);
                                                                }}
                                                            >
                                                                {v.name}
                                                            </li>
                                                        ))
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="th-label" onClick={() => setActiveHeaderSearch('vendor')}>
                                            Vendor
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
                                                    fill="#7A7A7A"/>
                                            </svg>
                                        </div>
                                    )}
                                </th>

                                <th>Ümumi borc</th>
                                <th>Geri qaytarılan</th>
                                <th>Ödənilən</th>
                                <th>Qalıq borc</th>
                                <th>Fəaliyyətlər</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredRows.map((r) => (
                                <tr key={r.id}>


                                    <td>{r.vendor}</td>
                                    <td>{r.totalDebt}₼</td>

                                    {/* Geri qaytarılan (yalnız məbləğ) */}
                                    <td>{r.returned}₼</td>

                                    {/* Ödənilən (yalnız məbləğ) */}
                                    <td>{r.paid}₼</td>

                                    <td>{r.remaining}₼</td>

                                    {/* Yeni: Fəaliyyətlər sütunu */}
                                    <td >
                                        <button
                                            className="edit-btn"
                                            onClick={() => navigate(`/accounter/borc/vendor/${r.vendorId}`)}
                                            aria-label="Sətiri redaktə et"
                                            style={{
                                                background: 'transparent',
                                                border: 0,
                                                cursor: 'pointer',
                                                padding: 0,
                                                textAlign:'center',
                                                color:"#6C6C6C",
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                            }}
                                        >
                                            Borca bax
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                                <path d="M10.8076 12.9256C10.7462 12.9828 10.6969 13.0518 10.6628 13.1284C10.6286 13.2051 10.6102 13.2879 10.6088 13.3718C10.6073 13.4557 10.6227 13.5391 10.6541 13.6169C10.6856 13.6947 10.7324 13.7654 10.7917 13.8248C10.8511 13.8841 10.9218 13.9309 10.9996 13.9623C11.0774 13.9938 11.1608 14.0092 11.2447 14.0077C11.3286 14.0062 11.4114 13.9879 11.488 13.9537C11.5647 13.9195 11.6337 13.8703 11.6909 13.8089L15.0242 10.4756C15.1413 10.3584 15.207 10.1995 15.207 10.0339C15.207 9.86826 15.1413 9.70941 15.0242 9.59222L11.6909 6.25889C11.6337 6.19748 11.5647 6.14823 11.488 6.11407C11.4114 6.07991 11.3286 6.06154 11.2447 6.06006C11.1608 6.05858 11.0774 6.07402 10.9996 6.10545C10.9218 6.13689 10.8511 6.18367 10.7917 6.24302C10.7324 6.30237 10.6856 6.37307 10.6541 6.45089C10.6227 6.52871 10.6073 6.61207 10.6088 6.69599C10.6102 6.77991 10.6286 6.86267 10.6628 6.93934C10.6969 7.016 10.7462 7.085 10.8076 7.14222L13.0742 9.40889L4.99925 9.40889C4.83349 9.40889 4.67452 9.47474 4.55731 9.59195C4.4401 9.70916 4.37425 9.86813 4.37425 10.0339C4.37425 10.1996 4.4401 10.3586 4.55731 10.4758C4.67452 10.593 4.83349 10.6589 4.99925 10.6589L13.0742 10.6589L10.8076 12.9256Z" fill="#6C6C6C"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Edit Modal */}
            {modalOpen && (
                <div className="debt-modal__overlay" onClick={closeModal}>
                    <div
                        className="debt-modal__box"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="debt-modal-title"
                    >
                        {/* Header */}
                        <div className="debt-modal__header">
                            <h3 id="debt-modal-title">Dəyişiklik et</h3>
                            <button className="icon-btn close" onClick={closeModal} aria-label="Bağla">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                     fill="none">
                                    <path d="M12.6673 3.33203L3.33398 12.6654M3.33398 3.33203L12.6673 12.6654"
                                          stroke="black" strokeWidth="1.5" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        {/* 1-ci sıra: Ödənilən / Geri qaytarılan */}
                        <div className="debt-modal__row debt-modal__row--two">
                            <div className="field">
                                <label>Ödənilən borc</label>
                                <div className="input-with-icon">
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={modalData.paidDebt}
                                        onChange={(e) => setModalData(s => ({ ...s, paidDebt: e.target.value }))}
                                    />
                                    <button className="ghost-icon" tabIndex={-1} aria-hidden>✎</button>
                                </div>
                            </div>

                            <div className="field">
                                <label>Geri qaytarılan borc</label>
                                <div className="input-with-icon">
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={modalData.returnedDebt}
                                        onChange={(e) => setModalData(s => ({...s, returnedDebt: e.target.value}))}
                                    />
                                    <button className="ghost-icon" tabIndex={-1} aria-hidden>✎</button>
                                </div>
                            </div>
                        </div>

                        {/* 2-ci sıra: Ödəniş üsulu */}
                        <div className="debt-modal__row">
                            <div className="field">
                                <label>Ödəniş üsulu</label>
                                <div className="input-with-icon">
                                    <select
                                        value={modalData.paymentType}
                                        onChange={(e) => setModalData(s => ({ ...s, paymentType: toUiPayment(e.target.value) }))}
                                    >
                                        <option value="nagd">Nağd</option>
                                        <option value="kart">Kart</option>
                                    </select>
                                    <button className="ghost-icon" tabIndex={-1} aria-hidden></button>
                                </div>
                            </div>
                        </div>

                        {/* 3-cü sıra: Fakturalar */}
                        <div className="debt-modal__row">
                            <div className="field">
                                <label>Fakturalar</label>

                                {/* Backend-dən gələnlər – READONLY */}
                                {modalData.originalInvoices.length > 0 && (
                                    <>
                                        <div className="muted-title">Mövcud (backend):</div>
                                        <ul className="invoice-list readonly">
                                            {modalData.originalInvoices.map((inv, idx) => (
                                                <li key={`orig-${idx}`}>
                          <span className="invoice-chip" title="Backend-dən gəlib, dəyişmək olmaz">
                            {inv}
                          </span>
                                                    <div className="actions">
                                                        <button className="icon-btn" disabled title="Düzəltmək olmaz">✎</button>
                                                        <button className="icon-btn danger" disabled title="Silmək olmaz">🗑</button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                {/* YENİLƏR – Edit/Sil mümkün */}
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
                                                                onChange={(e) => setModalData(s => ({ ...s, editValue: e.target.value }))}
                                                                autoFocus
                                                            />
                                                            <button
                                                                className="ghost-icon"
                                                                title="Yadda saxla"
                                                                onClick={() => setModalData(s => {
                                                                    const nextVal = (s.editValue || '').trim();
                                                                    if (!nextVal) return { ...s };
                                                                    // dublikat yoxlanışı
                                                                    const inOriginal = s.originalInvoices.some(o => normalize(o) === normalize(nextVal));
                                                                    const inNewOther = s.newInvoices.some((n, i) => i !== idx && normalize(n) === normalize(nextVal));
                                                                    if (inOriginal || inNewOther) return { ...s };
                                                                    const copy = [...s.newInvoices];
                                                                    copy[idx] = nextVal;
                                                                    return { ...s, newInvoices: copy, editIdx: null, editValue: '' };
                                                                })}
                                                            >✔</button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="invoice-chip">{inv}</span>
                                                            <div className="actions">
                                                                <button
                                                                    className="icon-btn"
                                                                    title="Düzəlt"
                                                                    onClick={() => setModalData(s => ({ ...s, editIdx: idx, editValue: inv }))}
                                                                >✎</button>
                                                                <button
                                                                    className="icon-btn danger"
                                                                    title="Sil"
                                                                    onClick={() => setModalData(s => {
                                                                        const copy = [...s.newInvoices];
                                                                        copy.splice(idx, 1);
                                                                        return { ...s, newInvoices: copy };
                                                                    })}
                                                                >🗑</button>
                                                            </div>
                                                        </>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                {/* Yeni faktura əlavə et */}
                                <div className="input-with-icon add-invoice">
                                    <input
                                        placeholder="Yeni faktura əlavə et"
                                        value={modalData.newInvoice}
                                        onChange={(e) => setModalData(s => ({...s, newInvoice: e.target.value}))}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const v = (modalData.newInvoice || '').trim();
                                                if (!v) return;
                                                const inOriginal = modalData.originalInvoices.some(o => normalize(o) === normalize(v));
                                                const inNew = modalData.newInvoices.some(n => normalize(n) === normalize(v));
                                                if (inOriginal || inNew) return;
                                                setModalData(s => ({
                                                    ...s,
                                                    newInvoices: [...s.newInvoices, v],
                                                    newInvoice: ''
                                                }));
                                            }
                                        }}
                                    />
                                    <button
                                        className="ghost-icon"
                                        title="Əlavə et"
                                        onClick={() => {
                                            const v = (modalData.newInvoice || '').trim();
                                            if (!v) return;
                                            const inOriginal = modalData.originalInvoices.some(o => normalize(o) === normalize(v));
                                            const inNew = modalData.newInvoices.some(n => normalize(n) === normalize(v));
                                            if (inOriginal || inNew) return;
                                            setModalData(s => ({...s, newInvoices: [...s.newInvoices, v], newInvoice: ''}));
                                        }}
                                    >＋</button>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="debt-modal__footer">
                            <button className="primary" onClick={saveModal} disabled={isSaving}>
                                {isSaving ? 'Yadda saxlanır...' : 'Yadda saxla'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccounterBorc;
