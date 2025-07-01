import { useState, useRef, useEffect } from 'react';
import './index.scss';

const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
    'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
];

const MonthPicker = ({ onChange }) => {
    const today = new Date();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [showMonths, setShowMonths] = useState(false);
    const ref = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        setShowMonths(false);
    };

    const handleMonthSelect = (index) => {
        setIsOpen(false);
        setShowMonths(false);
        onChange({
            year: selectedYear,
            month: index + 1,
            monthName: months[index],
        });
    };

    const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setIsOpen(false);
            setShowMonths(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="month-picker" ref={ref}>
            <div className="month-picker__trigger" onClick={toggleDropdown}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                    <path d="M7 14H11V12H7V14ZM3 8H15V6H3V8ZM0 0V2H18V0H0Z" fill="black" />
                </svg>
            </div>

            {isOpen && (
                <div className="month-picker__dropdown">
                    <div className="year-select-group">
                        {[2025, 2024, 2023].map((year) => (
                            <button
                                key={year}
                                className={`year-option ${selectedYear === year ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedYear(year);
                                    setShowMonths(true);
                                }}
                            >
                                {year}
                            </button>
                        ))}
                    </div>

                    {showMonths && (
                        <div className="month-options nested">
                            {months.map((m, idx) => (
                                <button key={idx} onClick={() => handleMonthSelect(idx)}>
                                    {m}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MonthPicker;
