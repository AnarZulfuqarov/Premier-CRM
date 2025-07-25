import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { useState, useEffect } from "react";
import { useGetAllCategoriesQuery, useGetMonthlyProductQuantityStatikQuery } from "../../../services/adminApi";
import { skipToken } from "@reduxjs/toolkit/query";

const getLastThreeYears = () => {
    const current = new Date().getFullYear();
    return [current, current - 1, current - 2];
};

const ProductChart = () => {
    const companyId = localStorage.getItem("selectedCompanyId");
    const isValidCompanyId = companyId && companyId.length === 36;

    const { data: apiData = {}, isLoading: isLoadingCats, isError: isErrorCats } = useGetAllCategoriesQuery();
    const categoriesData = apiData?.data || [];

    const yearOptions = getLastThreeYears();
    const [selectedYear, setSelectedYear] = useState(yearOptions[0]);

    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedProductId, setSelectedProductId] = useState("");

    useEffect(() => {
        if (categoriesData.length > 0) {
            const defaultCategory = categoriesData[0];
            setSelectedCategoryId(defaultCategory.id);
            if (defaultCategory.products?.length) {
                setSelectedProductId(defaultCategory.products[0].id);
            }
        }
    }, [categoriesData]);

    const selectedCategory = categoriesData?.find(c => c.id === selectedCategoryId);
    const productOptions = selectedCategory?.products || [];

    const {
        data: chartApiData,
        isLoading: isLoadingChart,
        isError: isErrorChart,
    } = useGetMonthlyProductQuantityStatikQuery(
        isValidCompanyId && selectedCategoryId && selectedProductId && selectedYear
            ? { companyId, categoryId: selectedCategoryId, productId: selectedProductId, year: selectedYear }
            : skipToken
    );

    const months = [
        "yanvar", "fevral", "mart", "aprel", "may", "iyun",
        "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"
    ];

    const monthlyQuantities = chartApiData?.monthlyQuantities || {};
    const chartData = months.map((month) => ({
        month: month.charAt(0).toUpperCase() + month.slice(1),
        count: monthlyQuantities[month] ?? 0
    }));

    if (isLoadingCats || isLoadingChart) return <div>Yüklənir...</div>;
    if (isErrorCats || isErrorChart) return <div>Xəta baş verdi</div>;
    if (!categoriesData.length) return <div>Kategoriya tapılmadı</div>;

    return (
        <div style={{ width: "100%", height: 360 }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
            }}>
                <h3 style={{ margin: 0 }}>Məhsul statistikası</h3>
                <div style={{ display: "flex", gap: 12 }}>
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => {
                            const newCatId = e.target.value;
                            setSelectedCategoryId(newCatId);
                            const firstProd = categoriesData.find(c => c.id === newCatId)?.products?.[0];
                            setSelectedProductId(firstProd?.id || "");
                        }}
                        style={selectStyle}
                    >
                        {categoriesData.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        style={selectStyle}
                    >
                        {productOptions.map((prod) => (
                            <option key={prod.id} value={prod.id}>{prod.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        style={selectStyle}
                    >
                        {yearOptions.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#60a5fa" barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const selectStyle = {
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "4px 12px",
    fontSize: 14,
    backgroundColor: "#f5f5f5",
    cursor: "pointer",
};

export default ProductChart;
