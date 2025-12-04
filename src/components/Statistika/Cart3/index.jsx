// ProductMonthlyTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
    useGetMonthlyOrderStatusStatikNewQuery,
    useGetAllCategoriesQuery,
    useGetAllProductsQuery,
    useGetAllCompaniesQuery,

} from "/src/services/adminApi.jsx";
import "./index.scss";
import {useNavigate} from "react-router-dom";
import yuxari from '/src/assets/Yuxari.svg'
import asagi from '/src/assets/Asagi.svg'
const MONTHS_ORDER = [
    { label: "Yanvar", key: "yanvar" },
    { label: "Fevral", key: "fevral" },
    { label: "Mart", key: "mart" },
    { label: "Aprel", key: "aprel" },
    { label: "May", key: "may" },
    { label: "İyun", key: "iyun" },
    { label: "İyul", key: "iyul" },
    { label: "Avqust", key: "avqust" },
    { label: "Sentyabr", key: "sentyabr" },
    { label: "Oktyabr", key: "oktyabr" },
    { label: "Noyabr", key: "noyabr" },
    { label: "Dekabr", key: "dekabr" },
];

const yearOptions = (() => {
    const y = new Date().getFullYear();
    return [y - 2, y - 1, y, y + 1, y + 2];
})();

export default function ProductMonthlyTable({
                                                initialCompanyId = "",
                                                defaultYear = new Date().getFullYear(),
                                            }) {
    /* ========== Şirkətlər ========== */
    const { data: companiesResp } = useGetAllCompaniesQuery();
    const companies = companiesResp?.data ?? companiesResp ?? [];
    const [companyId, setCompanyId] = useState(initialCompanyId || "");
    const [openRowIndex, setOpenRowIndex] = useState(null);
const navigate = useNavigate();
    useEffect(() => {
        if (!initialCompanyId && companies?.length && !companyId) {
            setCompanyId(companies[0].id);
        }
    }, [companies, initialCompanyId, companyId]);

    /* ========== Kateqoriyalar və Məhsullar ========== */
    const { data: catData } = useGetAllCategoriesQuery();
    const categories = catData?.data ?? catData ?? [];

    const { data: allProdData } = useGetAllProductsQuery();
    const allProducts = allProdData?.data ?? allProdData ?? [];

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    useEffect(() => {
        if (!selectedMonth) {
            const m = new Date().getMonth() + 1; // 1–12 verir
            setSelectedMonth(String(m));
        }
    }, [selectedMonth]);


    // ilk kateqoriya
    useEffect(() => {
        if (categories?.length && !selectedCategory) {
            setSelectedCategory(categories[0].id);
        }
    }, [categories, selectedCategory]);

    // ilk məhsul (seçilmiş kateqoriyaya görə)
    useEffect(() => {
        if (!selectedCategory) return;
        const filtered = allProducts.filter(
            (p) => String(p.categoryId ?? p.category?.id) === String(selectedCategory)
        );
        if (filtered.length) {
            setSelectedProduct(filtered[0].id);
        } else {
            setSelectedProduct("");
        }
    }, [selectedCategory, allProducts]);

    const products = useMemo(() => {
        if (!selectedCategory) return [];
        return allProducts.filter(
            (p) => String(p.categoryId ?? p.category?.id) === String(selectedCategory)
        );
    }, [allProducts, selectedCategory]);

    /* ========== İl seçimi ========== */
    const [selectedYear, setSelectedYear] = useState(defaultYear);

    const isValidId =
        Boolean(companyId) &&
        Boolean(selectedCategory) &&
        Boolean(selectedProduct) &&
        Boolean(selectedMonth);

    const newQueryParams = isValidId
        ? {
            productId: selectedProduct,
            companyId,
            year: Number(selectedYear),
            month: selectedMonth,
        }
        : skipToken;


    // TƏK sorğu: həm quantity, həm də amount burada gəlir
    const {
        data: monthlyStatData,
        isLoading,
        isError,
    } = useGetMonthlyOrderStatusStatikNewQuery(newQueryParams);


    // GÖZLƏNƏN FORMAT:
    // {
    //   statusCode: 200,
    //   monthlyQuantities: {...},
    //   monthlyAmounts: {...}
    // }
    const quantityObj = monthlyStatData?.monthlyQuantities ?? {};
    const amountObj   = monthlyStatData?.monthlyAmounts ?? {};

    const rows = useMemo(() => {
        if (!monthlyStatData?.data) return [];

        return monthlyStatData.data.map((d) => {
            const count = Number(d.count ?? 0);
            const totalAmount = d.orders?.reduce((sum, o) => sum + (o.price || 0), 0) ?? 0;

            return {
                date: d.day,                         // 01.12.2025 formatı
                count,                                // həmin gün neçə dəfə sifariş olunub
                avgPrice: count > 0 ? totalAmount / count : 0, // orta qiymət
                orders: d.orders ?? [],               // həmin günün bütün orderləri
            };
        });
    }, [monthlyStatData]);


    return (
        <div className="pmt-card">
            <div className="pmt-head">
                <h3 className="pmt-title">Məhsul statistikası</h3>

                <div className="pmt-filters">
                    {/* Şirkət */}
                    <div className="filter">
                        <span className="label">Şirkətin adı:</span>
                        <div className="select-wrap">
                            <select
                                value={companyId}
                                onChange={(e) => setCompanyId(e.target.value)}
                            >
                                {companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* İl */}
                    <div className="filter">
                        <span className="label">İl seçimi:</span>
                        <div className="select-wrap">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                {yearOptions.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Ay seçimi */}
                    {/* Ay seçimi */}
                    <div className="filter">
                        <span className="label">Ay seçimi:</span>
                        <div className="select-wrap">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                {MONTHS_ORDER.map((m, idx) => (
                                    <option key={m.key} value={idx + 1}>
                                        {m.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>




                    {/* Kateqoriya */}
                    <div className="filter">
                        <span className="label">Kateqoriya seç:</span>
                        <div className="select-wrap">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Məhsul */}
                    <div className="filter">
                        <span className="label">Məhsul seç:</span>
                        <div className="select-wrap">
                            <select
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                disabled={!products.length}
                            >
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pmt-table-wrap">
                {isLoading ? (
                    <div className="pmt-state">Yüklənir...</div>
                ) : isError ? (
                    <div className="pmt-state error">Xəta baş verdi</div>
                ) : (
                    <table className="pmt-table">
                        <thead>
                        <tr>
                            <th>Tarix</th>
                            <th>Sifariş verilən məhsul sayı</th>
                            <th>Ortalama qiymət</th>
                            <th>Fəaliyyət</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((r, i) => (
                            <>
                            <tr key={i}>
                                <td>{r.date}</td>
                                <td>{r.count}</td>
                                <td>
                                    {r.count > 0
                                        ? r.avgPrice.toLocaleString("az-AZ", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }) + " ₼"
                                        : "0 ₼"}
                                </td>

                                <td>
                                    <button
                                        className="action-btn"
                                        onClick={() =>
                                            setOpenRowIndex(openRowIndex === i ? null : i)
                                        }
                                    >
                                        {openRowIndex === i ? (
                                            <>
                                                Daha az
                                                <img src={yuxari} alt="yuxari" className="arrow-icon" />
                                            </>
                                        ) : (
                                            <>
                                                Daha çox
                                                <img src={asagi} alt="asagi" className="arrow-icon" />
                                            </>
                                        )}
                                    </button>
                                </td>

                            </tr>
                        {openRowIndex === i && (
                            <tr className="expanded-row">
                            <td colSpan={4}>

                        <div className="orders-box">
                            <table className="orders-table">
                                <thead>
                                <tr>
                                    <th>№</th>
                                    <th>Vendor</th>
                                    <th>Order ID</th>
                                    <th>Qiymət</th>
                                    <th>Keçid</th>
                                </tr>
                                </thead>

                                <tbody>
                                {r.orders.map((o, idx) => (
                                    <tr key={o.orderId}>
                                        <td>{idx + 1}.</td>
                                        <td>{o.vendorName}</td>
                                        <td>#{o.orderId.substring(0, 8)}</td>
                                        <td>{o.price} ₼</td>
                                        <td>
                                            <button
                                                className="detail-btn"
                                                onClick={() => navigate(`/superAdmin/history/${o.orderId}`)}
                                            >
                                                Detallı bax
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        </td>
                    </tr>
                )}
                    </>
                    ))}

                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
