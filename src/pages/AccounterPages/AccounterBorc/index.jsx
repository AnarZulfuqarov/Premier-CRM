import './index.scss';
import {useEffect, useMemo, useRef, useState} from 'react';
import {FaTimes} from 'react-icons/fa';
import {
    useGetAllVendorsQuery,
    useGetDateBasedPaymentTotalQuery, useGetCompanyIdQuery
} from '../../../services/adminApi.jsx';
import {NavLink, useNavigate, useParams} from "react-router-dom";


const formatNumber = (num) => {
    if (Number.isNaN(Number(num))) return '0';
    const parsed = Number(num);
    if (Number.isInteger(parsed)) return parsed.toString();
    return parsed.toFixed(2).replace(/\.?0+$/, '');
};
const AccounterBorc = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: getDateBasedPaymentTotal } = useGetDateBasedPaymentTotalQuery(id);
    const dbpTotal = getDateBasedPaymentTotal?.data ?? [];

    /* ------- Başlıq filterləri ------- */
    const [activeHeaderSearch, setActiveHeaderSearch] = useState(null);


    /* ------- Vendor (başlıqda searchable select) ------- */
    const { data: getAllVendors } = useGetAllVendorsQuery();
    const vendors = getAllVendors?.data ?? [];
    const [searchVendorText, setSearchVendorText] = useState('');
    const [searchVendorId, setSearchVendorId] = useState('');
    const [vendorOpen, setVendorOpen] = useState(false);
    const [vendorHover, setVendorHover] = useState(-1);
    const vendorSearchRef = useRef(null);

    /* ------- Şirkət seçimi (üst toolbar) — API-dən ------- */
    const { data: getAllCompanies } = useGetCompanyIdQuery(id);
    const companies = (getAllCompanies?.data ?? [])




    /* ------- Outside click close (vendor + company) ------- */
    useEffect(() => {
        const onDown = (e) => {
            if (!vendorSearchRef.current?.contains(e.target)) setVendorOpen(false);
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




    /* ------- Tarih formatlama ------- */


    /* ------- Veri işleme ve filtreleme ------- */
    const filteredData = useMemo(() => {
        if (!dbpTotal) return [];

        const mapped = dbpTotal.map((d, idx) => ({
            id: String(d.vendorId ?? idx + 1),

            vendorId: d.vendorId ?? null,
            vendor: d.vendorName ?? '',
            totalDebt: Number(d.totalDebt ?? 0),
            returned: Number(d.reverseAmount ?? 0),
            paid: Number(d.paidAmount ?? 0),
            remaining: Number(d.remainingDebt ?? 0),
            method: '-', // Ödəniş üsulu məlumatı verilmir, default olaraq '-'
            invoices: Array.isArray(d.invoices) ? d.invoices : [],
            invoiceCount: Array.isArray(d.invoices) ? d.invoices.length : 0,
        }));

        return mapped.filter((d) => {
            const matchesVendor = searchVendorId
                ? String(d.vendorId) === String(searchVendorId)
                : true;

            return matchesVendor ;
        });
    }, [dbpTotal, searchVendorId]);

    // ... (JSX kısmı aynı kalacak, sadece tbody içindeki map'lemeyi filteredData ile güncelliyoruz)
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
                        — {companies?.name} (Borc)
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
                                                    fill="#7A7A7A"
                                                />
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
                            {filteredData.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.vendor}</td>
                                    <td>{formatNumber(r.totalDebt)} ₼</td>
                                    <td>{formatNumber(r.returned)} ₼</td>
                                    <td>{formatNumber(r.paid)} ₼</td>
                                    <td>{formatNumber(r.remaining)} ₼</td>
                                    <td>
                                        <button
                                            className="edit-btn"
                                            onClick={() => {
                                                navigate(`/accounter/borc/vendor/${r.vendorId}`);
                                                localStorage.setItem('vendorId', r.vendorId);
                                            }}
                                            aria-label="Sətiri redaktə et"
                                            style={{
                                                background: 'transparent',
                                                border: 0,
                                                cursor: 'pointer',
                                                padding: 0,
                                                textAlign: 'center',
                                                color: '#6C6C6C',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                            }}
                                        >
                                            Borca bax
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="21"
                                                viewBox="0 0 20 21"
                                                fill="none"
                                            >
                                                <path
                                                    d="M10.8076 12.9256C10.7462 12.9828 10.6969 13.0518 10.6628 13.1284C10.6286 13.2051 10.6102 13.2879 10.6088 13.3718C10.6073 13.4557 10.6227 13.5391 10.6541 13.6169C10.6856 13.6947 10.7324 13.7654 10.7917 13.8248C10.8511 13.8841 10.9218 13.9309 10.9996 13.9623C11.0774 13.9938 11.1608 14.0092 11.2447 14.0077C11.3286 14.0062 11.4114 13.9879 11.488 13.9537C11.5647 13.9195 11.6337 13.8703 11.6909 13.8089L15.0242 10.4756C15.1413 10.3584 15.207 10.1995 15.207 10.0339C15.207 9.86826 15.1413 9.70941 15.0242 9.59222L11.6909 6.25889C11.6337 6.19748 11.5647 6.14823 11.488 6.11407C11.4114 6.07991 11.3286 6.06154 11.2447 6.06006C11.1608 6.05858 11.0774 6.07402 10.9996 6.10545C10.9218 6.13689 10.8511 6.18367 10.7917 6.24302C10.7324 6.30237 10.6856 6.37307 10.6541 6.45089C10.6227 6.52871 10.6073 6.61207 10.6088 6.69599C10.6102 6.77991 10.6286 6.86267 10.6628 6.93934C10.6969 7.016 10.7462 7.085 10.8076 7.14222L13.0742 9.40889L4.99925 9.40889C4.83349 9.40889 4.67452 9.47474 4.55731 9.59195C4.4401 9.70916 4.37425 9.86813 4.37425 10.0339C4.37425 10.1996 4.4401 10.3586 4.55731 10.4758C4.67452 10.593 4.83349 10.6589 4.99925 10.6589L13.0742 10.6589L10.8076 12.9256Z"
                                                    fill="#6C6C6C"
                                                />
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

        </div>
    );
};

export default AccounterBorc;
