import React, { useState } from 'react';
import './index.scss';
import icon from "../../../assets/ph_building-light.svg";

const SuperAdminKalkulyasiya = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Number of orders per page

    const orders = [
        {
            id: 'NP764543702735',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təchizatçıdan təsdiq gözləyən',
            price:"325"
        },
        {
            id: 'NP764543702736',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Tamamlanmış',
            price:"325"
        },
        {
            id: 'NP764543702737',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Sifarişçidən təhvil gözləyən',
            price:"325"
        },
        {
            id: 'NP764543702738',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Tamamlanmış',
            price:"325"
        },
        {
            id: 'NP764543702740',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təchizatçıdan təsdiq gözləyən',
            price:"325"
        },
        {
            id: 'NP764543702741',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Sifarişçidən təhvil gözləyən',
            price:"325"
        },
        {
            id: 'NP764543702742',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Tamamlanmış',
            price:"325"
        },
        {
            id: 'NP764543702744',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Tamamlanmış',
            price:"325"
        },
    ];

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filter === 'all' ||
            (filter === 'pending' && order.status === 'Sifarişçidən təhvil gözləyən') ||
            (filter === 'completed' && order.status === 'Tamamlanmış') ||
            (filter === 'pending' && order.status === 'Təchizatçıdan təsdiq gözləyən');
        return matchesSearch && matchesFilter;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5; // Show up to 5 page numbers at a time
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (endPage - startPage < maxVisiblePages - 1) {
            if (startPage === 1) endPage = Math.min(maxVisiblePages, totalPages);
            else if (endPage === totalPages) startPage = Math.max(1, totalPages - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (startPage > 2) pageNumbers.unshift('...');
        if (startPage > 1) pageNumbers.unshift(1);
        if (endPage < totalPages - 1) pageNumbers.push('...');
        if (endPage < totalPages) pageNumbers.push(totalPages);

        return pageNumbers;
    };

    const handlePageChange = (page) => {
        if (typeof page === 'number' && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const [selectedCompany, setSelectedCompany] = useState(null);

    const companies = [
        { id: 1, name: 'Şirvanşah 1' },
        { id: 2, name: 'Şirvanşah 2' },
        { id: 3, name: 'Şirvanşah 3' },
        { id: 4, name: 'Şirvanşah 4' },
    ];

    const handleCompanySelect = (companyId) => {
        setSelectedCompany(companyId);
    };


    return (
        <div className={"super-admin-kalkulyasiya-main"}>
            <div className="super-admin-kalkulyasiya">
                <h2>Kalkulyasiya</h2>
                <p>Davam etmək üçün işləmək istədiyiniz şirkəti seçin. Seçimdən sonra həmin şirkətə aid əməliyyatlar təqdim olunacaq.</p>
                <div className="choose">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            className={`company ${selectedCompany === company.id ? 'selected' : ''}`}
                            onClick={() => handleCompanySelect(company.id)}
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handleCompanySelect(company.id)}
                            role="button"
                        >
                            <img src={icon} alt={company.name} />
                            <p className={'p'}>{company.name}</p>
                        </div>
                    ))}
                </div>
                <div className="super-admin-kalkulyasiya__pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(page)}
                            disabled={page === '...'}
                            className={currentPage === page ? 'active' : ''}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        &gt;
                    </button>
                </div>
            </div>
            <div className={"xett"}></div>
        </div>
    );
};

export default SuperAdminKalkulyasiya;