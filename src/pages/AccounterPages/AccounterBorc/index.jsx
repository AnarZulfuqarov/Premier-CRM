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
            method: 'Nağd',
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
            method: 'Kart',
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
           paidDebt: 0,          // ödənilən borc
           returnedDebt: 0,
        paymentType: 'Nağd',
        invoices: [],
        newInvoice: '',
        editIdx: null,
        editValue: '',
    });

    const openEditModal = (row) => {
        setModalData({
            id: String(row.id ?? ''),
                paidDebt: Number(row.paid ?? 0),
               returnedDebt: Number(row.returned ?? 0),
            paymentType: (row.method && row.method !== '-') ? row.method : 'Nağd',
            invoices: Array.isArray(row.invoices) ? [...row.invoices] : [],
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
        } catch {
        }
    };

    const clearCompany = () => {
        if (companies.length > 0) {
            const first = companies[0];
            setSelectedCompanyId(first.id);
            setSelectedCompanyName(first.name);
            setCompanyQuery('');
            try {
                localStorage.setItem(LS_KEY, String(first.id));
            } catch {
            }
        } else {
            setSelectedCompanyId('');
            setSelectedCompanyName('');
            setCompanyQuery('');
            try {
                localStorage.removeItem(LS_KEY);
            } catch {
            }
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
            } catch {
            }
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
            const invoicesCount = Array.isArray(d.vendordebtInvoices) ? d.vendordebtInvoices.length : 0;

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
                method: d.paymentType || '-',
                invoiceCount: invoicesCount,
            };
        });

        setRows(mapped);
    }, [getVendorDebts]);

    const saveModal = async () => {
          // payload – backend-in istədiyi struktur
        const pt = (modalData.paymentType && modalData.paymentType !== '-') ? modalData.paymentType : 'Nağd';
              const payload = {
                id: String(modalData.id),
                      paidDebt: Number(modalData.paidDebt) || 0,
                     repayableDebt: Number(modalData.returnedDebt) || 0,
                  paymentType: pt,
               vendordebtInvoices: (modalData.invoices || []).map(String),
              };

              try {
                await editDebts(payload).unwrap();

                    // Optimistik UI: cədvəldə həmin sətiri yenilə
                        setRows(prev => prev.map(r => {
                              if (String(r.id) !== String(modalData.id)) return r;
                            const returned = payload.repayableDebt;
                             const paid = payload.paidDebt;
                             const remaining = Math.max(0, Number(r.totalDebt || 0) - paid - returned);
                              const invoices = (modalData.invoices || []).map(String);
                              return {
                                    ...r,
                                    returned,
                                  paid,
                                 remaining,
                                  method: pt,
                                   invoices,
                                   invoiceCount: invoices.length,
                                  };
                            }));

                    setModalOpen(false);
              } catch (e) {
                console.error('editDebts failed:', e);
                // istəsən burada toast göstərə bilərik
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
                                            Son ödəmə tarixi
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
                                <th>Fəaliyyətlər</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredRows.map((r) => (
                                <tr key={r.id}>
                                    <td style={{cursor: "pointer"}}
                                        onClick={() => navigate(`/accounter/history/${r.id}`)}>{r.lastOrderAt}</td>
                                    <td>{r.company}</td>
                                    <td>{r.vendor}</td>
                                    <td>{r.totalDebt}₼</td>

                                    {/* Geri qaytarılan (yalnız məbləğ) */}
                                    <td>{r.returned}₼</td>

                                    {/* Ödənilən (yalnız məbləğ) */}
                                    <td>{r.paid}₼</td>

                                    <td>{r.remaining}₼</td>
                                    <td>{r.method}</td>
                                    <td>{r.invoiceCount}</td>

                                    {/* Yeni: Fəaliyyətlər sütunu */}
                                    <td style={{
                                        display:'flex',
                                        justifyContent:"center"
                                    }}>
                                        <button
                                            className="edit-btn"
                                            onClick={() => openEditModal(r)}
                                            aria-label="Sətiri redaktə et"
                                            style={{
                                                background: 'transparent',
                                                border: 0,
                                                cursor: 'pointer',
                                                padding: 0,
                                                textAlign:'center'
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M18.3327 6.03465C18.3333 5.92498 18.3123 5.81626 18.2708 5.71473C18.2294 5.6132 18.1683 5.52085 18.091 5.44298L14.5577 1.90965C14.4798 1.83241 14.3875 1.77131 14.286 1.72984C14.1844 1.68837 14.0757 1.66735 13.966 1.66798C13.8564 1.66735 13.7476 1.68837 13.6461 1.72984C13.5446 1.77131 13.4522 1.83241 13.3744 1.90965L11.016 4.26798L1.9077 13.3763C1.83046 13.4542 1.76936 13.5465 1.72789 13.6481C1.68642 13.7496 1.6654 13.8583 1.66603 13.968V17.5013C1.66603 17.7223 1.75383 17.9343 1.91011 18.0906C2.06639 18.2469 2.27835 18.3347 2.49936 18.3347H6.0327C6.1493 18.341 6.26594 18.3228 6.37505 18.2811C6.48415 18.2395 6.58329 18.1754 6.66603 18.093L15.7244 8.98465L18.091 6.66798C18.167 6.58712 18.2289 6.49418 18.2744 6.39298C18.2824 6.32656 18.2824 6.25941 18.2744 6.19298C18.2783 6.15419 18.2783 6.11511 18.2744 6.07632L18.3327 6.03465ZM5.69103 16.668H3.3327V14.3097L11.6077 6.03465L13.966 8.39298L5.69103 16.668ZM15.141 7.21798L12.7827 4.85965L13.966 3.68465L16.316 6.03465L15.141 7.21798Z" fill="#606060"/>
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

            {/* Yeni: Edit Modal (hər iki dəyər birlikdə) */}
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
                                          stroke="black" stroke-width="1.5" stroke-linecap="round"
                                          stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        {/* 1-ci sıra: Ümumi borc / Geri qaytarılan borc */}
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
                                        onChange={(e) => setModalData(s => ({...s, paymentType: e.target.value}))}
                                    >
                                        <option>Nağd</option>
                                        <option>Kart</option>
                                    </select>
                                    <button className="ghost-icon" tabIndex={-1} aria-hidden></button>
                                </div>
                            </div>
                        </div>

                        {/* 3-cü sıra: Fakturalar (siyahı + edit/sil) */}
                        <div className="debt-modal__row">
                            <div className="field">
                                <label>Faktura sayı</label>

                                {modalData.invoices.length > 0 && (
                                    <ul className="invoice-list">
                                        {modalData.invoices.map((inv, idx) => (
                                            <li key={idx}>
                                                {modalData.editIdx === idx ? (
                                                    <div className="input-with-icon">
                                                        <input
                                                            value={modalData.editValue}
                                                            onChange={(e) => setModalData(s => ({
                                                                ...s,
                                                                editValue: e.target.value
                                                            }))}
                                                            autoFocus
                                                        />
                                                        <button
                                                            className="ghost-icon"
                                                            title="Yadda saxla"
                                                            onClick={() => setModalData(s => {
                                                                const copy = [...s.invoices];
                                                                copy[idx] = (s.editValue || '').trim();
                                                                return {
                                                                    ...s,
                                                                    invoices: copy,
                                                                    editIdx: null,
                                                                    editValue: ''
                                                                };
                                                            })}
                                                        >✔
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="invoice-chip">{inv}</span>
                                                        <div className="actions">
                                                            <button
                                                                className="icon-btn"
                                                                title="Düzəlt"
                                                                onClick={() => setModalData(s => ({
                                                                    ...s,
                                                                    editIdx: idx,
                                                                    editValue: inv
                                                                }))}
                                                            >✎
                                                            </button>
                                                            <button
                                                                className="icon-btn danger"
                                                                title="Sil"
                                                                onClick={() => setModalData(s => {
                                                                    const copy = [...s.invoices];
                                                                    copy.splice(idx, 1);
                                                                    return {...s, invoices: copy};
                                                                })}
                                                            >🗑
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
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
                                                setModalData(s => ({
                                                    ...s,
                                                    invoices: [...s.invoices, v],
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
                                            setModalData(s => ({...s, invoices: [...s.invoices, v], newInvoice: ''}));
                                        }}
                                    >＋
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="debt-modal__footer">
                            <button className="primary" onClick={saveModal}>Yadda saxla</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccounterBorc;
