// ProductMonthlyTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
    useGetMonthlyOrderStatikQuery,
    useGetMonthlyOrderAmountStatikQuery,
    useGetAllCategoriesQuery,
    useGetAllProductsQuery,
    useGetAllCompaniesQuery, // şirkət seçimi üçün
} from "/src/services/adminApi.jsx";
import "./index.scss";

const MONTHS_ORDER = [
    { label: "Yanvar",   key: "yanvar"   },
    { label: "Fevral",   key: "fevral"   },
    { label: "Mart",     key: "mart"     },
    { label: "Aprel",    key: "aprel"    },
    { label: "May",      key: "may"      },
    { label: "İyun",     key: "iyun"     },
    { label: "İyul",     key: "iyul"     },
    { label: "Avqust",   key: "avqust"   },
    { label: "Sentyabr", key: "sentyabr" },
    { label: "Oktyabr",  key: "oktyabr"  },
    { label: "Noyabr",   key: "noyabr"   },
    { label: "Dekabr",   key: "dekabr"   },
];

const yearOptions = (() => {
    const y = new Date().getFullYear();
    return [y - 2, y - 1, y, y + 1, y + 2];
})();

export default function ProductMonthlyTable({
                                                // İstəsən parent-dən companyId ver; yoxdursa buradakı şirkət dropdown-u ilə idarə olunur
                                                initialCompanyId = "",
                                                defaultYear = new Date().getFullYear(),
                                            }) {
    const { data: companiesResp } = useGetAllCompaniesQuery();
    const companies = companiesResp?.data ?? companiesResp ?? [];

    const [companyId, setCompanyId] = useState(initialCompanyId || (companies?.[0]?.id ?? ""));
    useEffect(() => {
        if (!initialCompanyId && companies?.length) {
            setCompanyId(companies[0].id);
        }
    }, [companies, initialCompanyId]);

    const [selectedYear, setSelectedYear] = useState(defaultYear);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");

    // Kateqoriya / Məhsul
    const { data: catData } = useGetAllCategoriesQuery();
    const categories = catData?.data ?? catData ?? [];

    const { data: allProdData } = useGetAllProductsQuery();
    const allProducts = allProdData?.data ?? allProdData ?? [];

    // kateqoriya dəyişəndə məhsulu sıfırla
    useEffect(() => setSelectedProduct(""), [selectedCategory]);

    // front-filter: seçilmiş kateqoriyaya görə məhsullar
    const products = useMemo(() => {
        if (!selectedCategory) return allProducts;
        return allProducts.filter(p =>
            String(p.categoryId ?? p.category?.id) === String(selectedCategory)
        );
    }, [allProducts, selectedCategory]);

    const isValidId = Boolean(companyId);
    const queryParams = isValidId
        ? {
            year: Number(selectedYear),
            companyId,
            ...(selectedCategory ? { categoryId: selectedCategory } : {}),
            ...(selectedProduct ? { productId: selectedProduct } : {}),
        }
        : skipToken;

    // A) say
    const { data: monthlyCountData, isLoading: l1, isError: e1 } =
        useGetMonthlyOrderStatikQuery(queryParams);
    // B) məbləğ
    const { data: monthlyAmountData, isLoading: l2, isError: e2 } =
        useGetMonthlyOrderAmountStatikQuery(queryParams);

    const countObj  = monthlyCountData?.monthlyOrders ?? {};
    const amountObj = monthlyAmountData?.monthlyOrderAmounts ?? {};

    const rows = useMemo(
        () =>
            MONTHS_ORDER.map(({ label, key }) => ({
                monthName: label,
                count: Number(countObj?.[key] ?? 0),
                amount: Number(amountObj?.[key] ?? 0),
            })),
        [countObj, amountObj]
    );

    const isLoading = l1 || l2;
    const isError = e1 || e2;

    return (
        <div className="pmt-card">
            <div className="pmt-head">
                <h3 className="pmt-title">Məhsul statistikası</h3>

                <div className="pmt-filters">
                    <div className="filter">
                        <span className="label">Şirkətin adı:</span>
                        <div className="select-wrap">
                            <select
                                value={companyId}
                                onChange={(e) => setCompanyId(e.target.value)}
                            >
                                {companies.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filter">
                        <span className="label">İl seçimi:</span>
                        <div className="select-wrap">
                            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                {yearOptions.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filter">
                        <span className="label">Kateqoriya seç:</span>
                        <div className="select-wrap">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Hamısı</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filter">
                        <span className="label">Məhsul seç:</span>
                        <div className="select-wrap">
                            <select
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                disabled={!products.length}
                            >
                                <option value="">Hamısı</option>
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
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
