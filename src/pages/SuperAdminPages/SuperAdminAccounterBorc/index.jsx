import './index.scss';
import {useEffect, useRef, useState} from 'react';
import {FaTimes} from 'react-icons/fa';
import {
    useGetAllVendorsQuery,
    useGetAllCompaniesQuery,
    useGetVendorDebtsQuery,
    useEditVendorDebtsMutation
} from '../../../services/adminApi.jsx';
import {useNavigate} from "react-router-dom";

const LS_KEY = 'borcCompanyId';

// payment helpers
const toUiPayment = (val) => (String(val).toLowerCase() === 'kart' ? 'kart' : 'nagd');
const toServerPayment = (val) => (String(val).toLowerCase() === 'kart' ? 'kart' : 'nagd');
const labelPayment = (val) => (val === 'kart' ? 'Kart' : 'Nağd');
const normalize = (x) => (x || '').trim().toLowerCase();

const SuperAdminAccounterBorc = () => {
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

    const openEditModal = (row) => {
        setModalData({
            id: String(row.id ?? ''),
            paidDebt: Number(row.paid ?? 0),
            returnedDebt: Number(row.returned ?? 0),
            paymentType: toUiPayment(row.method && row.method !== '-' ? row.method : 'nagd'),
            originalInvoices: Array.isArray(row.invoices) ? [...row.invoices] : [],
            newInvoices: [],
            newInvoice: '',
            editIdx: null,
            editValue: '',
        });
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

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
    const [editDebts, {isLoading: isSaving}] = useEditVendorDebtsMutation();

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
    const filteredCompanyOptions = companies
        .filter(c => c.name.toLowerCase().includes(companyQuery.toLowerCase()))
        .slice(0, 100);

    const selectCompany = (c) => {
        setSelectedCompanyId(c.id);
        setSelectedCompanyName(c.name);
        setCompanyQuery('');
        setCompanyOpen(false);
        try {
            localStorage.setItem(LS_KEY, String(c.id));
        } catch {}
    };

    const clearCompany = () => {
        if (companies.length > 0) {
            const first = companies[0];
            setSelectedCompanyId(first.id);
            setSelectedCompanyName(first.name);
            setCompanyQuery('');
            try {
                localStorage.setItem(LS_KEY, String(first.id));
            } catch {}
        } else {
            setSelectedCompanyId('');
            setSelectedCompanyName('');
            setCompanyQuery('');
            try {
                localStorage.removeItem(LS_KEY);
            } catch {}
        }
        setCompanyOpen(false);
    };

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

    /* ================= RTK Query: Vendor Debts ================= */
    const {data: getVendorDebts} =
        useGetVendorDebtsQuery(selectedCompanyId, {skip: !selectedCompanyId});

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

    const saveModal = async () => {
        const ptServer = toServerPayment(modalData.paymentType || 'nagd');

        // yalnız YENİLƏRİ göndər
        const payload = {
            id: String(modalData.id),
            paidDebt: Number(modalData.paidDebt) || 0,
            repayableDebt: Number(modalData.returnedDebt) || 0,
            paymentType: ptServer,
            vendordebtInvoices: (modalData.newInvoices || []).map(String),
        };

        try {
            await editDebts(payload).unwrap();

            // Optimistik UI: sətirin fakturalarına yeniləri əlavə et
            setRows(prev => prev.map(r => {
                if (String(r.id) !== String(modalData.id)) return r;
                const returned = payload.repayableDebt;
                const paid = payload.paidDebt;
                const remaining = Math.max(0, Number(r.totalDebt || 0) - paid - returned);
                const invoices = [
                    ...(Array.isArray(r.invoices) ? r.invoices : []),
                    ...(modalData.newInvoices || []).map(String),
                ];
                return {
                    ...r,
                    returned,
                    paid,
                    remaining,
                    method: ptServer,
                    invoices,
                    invoiceCount: invoices.length,
                };
            }));

            setModalOpen(false);
        } catch (e) {
            console.error('editDebts failed:', e);
        }
    };

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

                {/* Üst toolbar – Şirkət seçimi (API-dən) */}
                <div className="about">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
              <path
                  d="M12.005 17.278V10.945M12 21.5C14.5196 21.5 16.9359 20.4991 18.7175 18.7175C20.4991 16.9359 21.5 14.5196 21.5 12C21.5 9.48044 20.4991 7.06408 18.7175 5.28249C16.9359 3.50089 14.5196 2.5 12 2.5C9.48044 2.5 7.06408 3.50089 5.28249 5.28249C3.50089 7.06408 2.5 9.48044 2.5 12C2.5 14.5196 3.50089 16.9359 5.28249 18.7175C7.06408 20.4991 9.48044 21.5 12 21.5Z"
                  stroke="#ED0303" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.9551 7.44141H11.9655" stroke="#ED0303" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round"/>
            </svg>
          </span>

                    <div className="company-filter" ref={companyRef}>
                        <label>Şirkət seçin:</label>
                        <button
                            type="button"
                            onClick={() => {
                                setCompanyOpen(v => {
                                    const next = !v;
                                    if (next) setCompanyQuery('');
                                    return next;
                                });
                            }}
                        >
                            <span>{selectedCompanyName || 'Hamısı'}</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M7 10l5 5 5-5" stroke="#434343" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </button>

                        {companyOpen && (
                            <div className="company-dropdown">
                                <input
                                    autoFocus
                                    value={companyQuery}
                                    onChange={(e) => setCompanyQuery(e.target.value)}
                                    placeholder="Şirkət axtar..."
                                />
                                <ul>
                                    {filteredCompanyOptions.length === 0 ? (
                                        <li className="empty">Nəticə yoxdur</li>
                                    ) : (
                                        <>
                                            <li className="all" onMouseDown={clearCompany}>Hamısı</li>
                                            {filteredCompanyOptions.map(c => (
                                                <li
                                                    key={c.id}
                                                    className={String(c.id) === String(selectedCompanyId) ? 'active' : ''}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        selectCompany(c);
                                                    }}
                                                >
                                                    {c.name}
                                                </li>
                                            ))}
                                        </>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cədvəl */}
                <div className="table-wrapper">
                    <div className="table-scroll">
                        <table className="order-history-detail-supplier__table">
                            <thead>
                            <tr>
                                {/* TARİX */}
                                <th>
                                    {activeHeaderSearch === 'date' ? (
                                        <div className="th-search">
                                            <input
                                                autoFocus
                                                type="date"
                                                value={searchDate}
                                                onChange={(e) => setSearchDate(e.target.value)}
                                                placeholder="Tarix seçin"
                                            />
                                            <FaTimes onClick={() => {
                                                setActiveHeaderSearch(null);
                                                setSearchDate('');
                                            }}/>
                                        </div>
                                    ) : (
                                        <div className="th-label" onClick={() => setActiveHeaderSearch('date')}>
                                            Son sifariş tarixi
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
                                                    fill="#7A7A7A"/>
                                            </svg>
                                        </div>
                                    )}
                                </th>

                                {/* ŞİRKƏT ADI */}
                                <th>
                                    {activeHeaderSearch === 'company' ? (
                                        <div className="th-search">
                                            <input
                                                autoFocus
                                                value={searchCompany}
                                                onChange={(e) => setSearchCompany(e.target.value)}
                                                placeholder="Axtar..."
                                            />
                                            <FaTimes onClick={() => {
                                                setActiveHeaderSearch(null);
                                                setSearchCompany('');
                                            }}/>
                                        </div>
                                    ) : (
                                        <div className="th-label" onClick={() => setActiveHeaderSearch('company')}>
                                            Şirkət adı
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
                                                    fill="#7A7A7A"/>
                                            </svg>
                                        </div>
                                    )}
                                </th>

                                {/* VENDOR */}
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
                                <th>Ödəniş üsulu</th>
                                <th>Faktura sayı</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredRows.map((r) => (
                                <tr key={r.id}>
                                    <td
                                        style={{ cursor: "pointer" }}
                                        onClick={() => r.vendorId && navigate(`/superAdmin/accounter/borc/${r.vendorId}`)}
                                    >
                                        {r.lastOrderAt}
                                    </td>

                                    <td>{r.company}</td>
                                    <td>{r.vendor}</td>
                                    <td>{r.totalDebt}₼</td>

                                    {/* Geri qaytarılan (yalnız məbləğ) */}
                                    <td>{r.returned}₼</td>

                                    {/* Ödənilən (yalnız məbləğ) */}
                                    <td>{r.paid}₼</td>

                                    <td>{r.remaining}₼</td>
                                    <td>{labelPayment(toUiPayment(r.method))}</td>
                                    <td>{r.invoiceCount}</td>

                                    {/* Yeni: Fəaliyyətlər sütunu */}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default SuperAdminAccounterBorc;
