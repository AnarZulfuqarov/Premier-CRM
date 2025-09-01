import './index.scss';
import { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useGetAllVendorsQuery, useGetAllCompaniesQuery } from '../../../services/adminApi.jsx';
import {useNavigate} from "react-router-dom";

const AccounterBorc = () => {
    const navigate = useNavigate();
    // Demo sətirlər (öz backend-dən əvəz edə bilərsən)
    const initialRows = [
        { id: 1, lastOrderAt: '16/05/25, 13:45', companyId: 101, company: 'Şirvanşah', vendorId: 1, vendor: 'Bravo', totalDebt: 325, returned: 20, paid: 100, remaining: 205, method: 'Nağd', invoiceCount: 8 },
        { id: 2, lastOrderAt: '16/05/25, 13:45', companyId: 102, company: 'Qalaaltı',  vendorId: 2, vendor: 'Araz',   totalDebt: 325, returned: 10, paid: 165, remaining: 150, method: 'Kart', invoiceCount: 5 },
    ];
    const [rows, setRows] = useState(initialRows);

    /* ------- Başlıq filterləri ------- */
    const [activeHeaderSearch, setActiveHeaderSearch] = useState(null); // 'date' | 'company' | 'vendor' | null
    const [searchDate, setSearchDate] = useState('');
    const [searchCompany, setSearchCompany] = useState('');

    /* ------- Vendor (başlıqda searchable select) ------- */
    const { data: getAllVendors } = useGetAllVendorsQuery();
    const vendors = getAllVendors?.data ?? [];
    const [searchVendorText, setSearchVendorText] = useState('');
    const [searchVendorId, setSearchVendorId] = useState('');
    const [vendorOpen, setVendorOpen] = useState(false);
    const [vendorHover, setVendorHover] = useState(-1);
    const vendorSearchRef = useRef(null);

    /* ------- Şirkət seçimi (üst toolbar) — API-dən ------- */
    const { data: getAllCompanies } = useGetAllCompaniesQuery();
    // Ad sahəsi backend-də fərqli ola bilər deyə təhlükəsiz map:
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
    const filteredCompanyOptions = companies
        .filter(c => c.name.toLowerCase().includes(companyQuery.toLowerCase()))
        .slice(0, 100);

    const selectCompany = (c) => {
        setSelectedCompanyId(c.id);
        setSelectedCompanyName(c.name);
        setCompanyQuery(c.name);
        setCompanyOpen(false);
    };
    const clearCompany = () => {
        setSelectedCompanyId('');
        setSelectedCompanyName('');
        setCompanyQuery('');
        setCompanyOpen(false);
    };

    /* ------- Tarixi ISO-ya çevir ------- */
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

        // Üst toolbar-dan seçilmiş şirkət ID-si varsa — ID ilə dəqiq uyğunluq
        const byCompanyTop = !selectedCompanyId
            ? true
            : (r.companyId != null
                ? String(r.companyId) === String(selectedCompanyId)
                : (r.company ?? '').toLowerCase() === selectedCompanyName.toLowerCase());

        // Vendor filter (ID varsa ID, yoxsa ada görə)
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

    /* ------- Edit modal (returned / paid) ------- */
    const [editModal, setEditModal] = useState(null);
    // { id, field: 'returned' | 'paid', value: string }

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

                       <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12.005 17.278V10.945M12 21.5C14.5196 21.5 16.9359 20.4991 18.7175 18.7175C20.4991 16.9359 21.5 14.5196 21.5 12C21.5 9.48044 20.4991 7.06408 18.7175 5.28249C16.9359 3.50089 14.5196 2.5 12 2.5C9.48044 2.5 7.06408 3.50089 5.28249 5.28249C3.50089 7.06408 2.5 9.48044 2.5 12C2.5 14.5196 3.50089 16.9359 5.28249 18.7175C7.06408 20.4991 9.48044 21.5 12 21.5Z" stroke="#ED0303" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11.9551 7.44141H11.9655" stroke="#ED0303" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>


                    <div className="company-filter" ref={companyRef}>
                        <label>Şirkət seçin:</label>
                        <button type="button" onClick={() => setCompanyOpen(v => !v)}>
                            <span>{selectedCompanyName || 'Hamısı'}</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M7 10l5 5 5-5" stroke="#434343" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                                                    onMouseDown={(e) => { e.preventDefault(); selectCompany(c); }}
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
                                            <FaTimes onClick={() => { setActiveHeaderSearch(null); setSearchDate(''); }} />
                                        </div>
                                    ) : (
                                        <div className="th-label" onClick={() => setActiveHeaderSearch('date')}>
                                            Son sifariş tarixi
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.002 12.776 19 11C19 7.134 15.866 4 12 4C8.134 4 5 7.134 5 11C5 14.866 8.134 18 12 18" stroke="#7A7A7A" strokeWidth="1.6" strokeLinecap="round"/>
                                            </svg>
                                        </div>
                                    )}
                                </th>

                                {/* ŞİRKƏT ADI (sütun içi mətn axtarışı) */}
                                <th>
                                    {activeHeaderSearch === 'company' ? (
                                        <div className="th-search">
                                            <input
                                                autoFocus
                                                value={searchCompany}
                                                onChange={(e) => setSearchCompany(e.target.value)}
                                                placeholder="Axtar..."
                                            />
                                            <FaTimes onClick={() => { setActiveHeaderSearch(null); setSearchCompany(''); }} />
                                        </div>
                                    ) : (
                                        <div className="th-label" onClick={() => setActiveHeaderSearch('company')}>
                                            Şirkət adı
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.002 12.776 19 11C19 7.134 15.866 4 12 4C8.134 4 5 7.134 5 11C5 14.866 8.134 18 12 18" stroke="#7A7A7A" strokeWidth="1.6" strokeLinecap="round"/>
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
                                                                onMouseDown={(e) => { e.preventDefault(); selectVendor(v); }}
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.002 12.776 19 11C19 7.134 15.866 4 12 4C8.134 4 5 7.134 5 11C5 14.866 8.134 18 12 18" stroke="#7A7A7A" strokeWidth="1.6" strokeLinecap="round"/>
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
                                    <td style={{
                                        cursor:"pointer"
                                    }} onClick={()=>navigate('/accounter/borc/:id')}>{r.lastOrderAt}</td>
                                    <td>{r.company}</td>
                                    <td>{r.vendor}</td>
                                    <td>{r.totalDebt}₼</td>

                                    {/* Geri qaytarılan */}
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                                            <span>{r.returned}₼</span>
                                            <button
                                                className="edit-btn"
                                                onClick={() => setEditModal({ id: r.id, field: 'returned', value: String(r.returned) })}
                                                aria-label="Geri qaytarılanı düzəlt"
                                                style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 0 }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ cursor: 'pointer' }}>
                                                    <path d="M18.333 6.033c.001-.11-.02-.219-.061-.321a.83.83 0 0 0-.18-.272L14.558 1.908a.83.83 0 0 0-.272-.18.83.83 0 0 0-.32-.061.83.83 0 0 0-.32.061.83.83 0 0 0-.272.18L1.908 13.375a.83.83 0 0 0-.18.272.83.83 0 0 0-.061.32v3.533c0 .221.088.433.244.589.156.156.368.244.589.244h3.533a.83.83 0 0 0 .333-.053.83.83 0 0 0 .291-.168l9.058-9.109 2.367-2.316a.83.83 0 0 0 .184-.475c.008-.066.008-.133 0-.2" fill="#919191"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>

                                    {/* Ödənilən */}
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                                            <span>{r.paid}₼</span>
                                            <button
                                                className="edit-btn"
                                                onClick={() => setEditModal({ id: r.id, field: 'paid', value: String(r.paid) })}
                                                aria-label="Ödəniləni düzəlt"
                                                style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 0 }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ cursor: 'pointer' }}>
                                                    <path d="M18.333 6.033c.001-.11-.02-.219-.061-.321a.83.83 0 0 0-.18-.272L14.558 1.908a.83.83 0 0 0-.272-.18.83.83 0 0 0-.32-.061.83.83 0 0 0-.32.061.83.83 0 0 0-.272.18L1.908 13.375a.83.83 0 0 0-.18.272.83.83 0 0 0-.061.32v3.533c0 .221.088.433.244.589.156.156.368.244.589.244h3.533a.83.83 0 0 0 .333-.053.83.83 0 0 0 .291-.168l9.058-9.109 2.367-2.316a.83.83 0 0 0 .184-.475c.008-.066.008-.133 0-.2" fill="#919191"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>

                                    <td>{r.remaining}₼</td>
                                    <td>{r.method}</td>
                                    <td>{r.invoiceCount}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Edit Modal */}
            {editModal && (
                <div className="modal-overlay" onClick={() => setEditModal(null)}>
                    <div className="modal-box" style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                        <h3>{editModal.field === 'returned' ? 'Geri qaytarılan' : 'Ödənilən'} məbləği</h3>
                        <span
                            style={{ cursor: 'pointer', position: 'absolute', right: '15px', top: '15px' }}
                            onClick={() => setEditModal(null)}
                        >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12.6668 3.33398L3.3335 12.6673M3.3335 3.33398L12.6668 12.6673" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>

                        <div className="modal-fields">
                            <label>Məbləğ (₼)</label>
                            <input
                                type="number"
                                value={editModal.value}
                                onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
                                placeholder="0"
                            />
                        </div>

                        <button
                            onClick={() => {
                                const val = Number(editModal.value) || 0;
                                setRows(prev =>
                                    prev.map(r =>
                                        r.id === editModal.id ? { ...r, [editModal.field]: val } : r
                                    )
                                );
                                setEditModal(null);
                            }}
                        >
                            Yadda saxla
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccounterBorc;
