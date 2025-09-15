// ProductMonthlyTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
    useGetMonthlyProductQuantityStatikQuery,
    useGetAllCategoriesQuery,
    useGetAllProductsQuery,
    useGetAllCompaniesQuery,
} from "/src/services/adminApi.jsx";
import "./index.scss";

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

    const isValidId = Boolean(companyId) && Boolean(selectedCategory) && Boolean(selectedProduct);

    // Backend path param qəbul edir → boş olduqda 0 göndərmək istəsən:
    const qtyParams = isValidId
        ? {
            companyId,
            categoryId: selectedCategory || 0,
            productId: selectedProduct || 0,
            year: Number(selectedYear),
        }
        : skipToken;

    // TƏK sorğu: həm quantity, həm də amount burada gəlir
    const {
        data: monthlyStatData,
        isLoading,
        isError,
    } = useGetMonthlyProductQuantityStatikQuery(qtyParams);

    // GÖZLƏNƏN FORMAT:
    // {
    //   statusCode: 200,
    //   monthlyQuantities: {...},
    //   monthlyAmounts: {...}
    // }
    const quantityObj = monthlyStatData?.monthlyQuantities ?? {};
    const amountObj   = monthlyStatData?.monthlyAmounts ?? {};

    const rows = useMemo(
        () =>
            MONTHS_ORDER.map(({ label, key }) => ({
                monthName: label,
                count: Number(quantityObj?.[key] ?? 0),
                amount: Number(amountObj?.[key] ?? 0),
            })),
        [quantityObj, amountObj]
    );

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
                            <th>Aylar</th>
                            <th>Sifariş verilən məhsul sayı</th>
                            <th>Sifariş verilən məhsulun ümumi məbləği</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((r) => (
                            <tr key={r.monthName}>
                                <td className="month">{r.monthName}</td>
                                <td>{r.count}</td>
                                <td>{r.amount.toLocaleString("az-AZ")} ₼</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
