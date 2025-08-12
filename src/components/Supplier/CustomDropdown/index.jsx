import { useState, useRef, useEffect } from 'react';
import './index.scss';

const CustomDropdown = ({ options, selected, onSelect, placeholder = "Seçin" }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();
    console.log(options);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // selected göstərişini tap (obyekt deyilsə birbaşa göstər)
    const isObjectOptions = typeof options?.[0] === 'object';
    const selectedLabel = isObjectOptions
        ? options.find(opt => opt.value === selected)?.label
        : selected;

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            <div className="custom-dropdown-header" onClick={() => setOpen(!open)}>
                {selectedLabel ? (
                    <div className="scrolling-text-wrapper">
                        <span className="scrolling-text">{selectedLabel}</span>
                    </div>
                ) : (
                    <span className="placeholder">{placeholder}</span>
                )}
                <span className="arrow">{open ? '▲' : '▼'}</span>
            </div>

            {open && (
                <div className="custom-dropdown-list">
                    {options.map((opt, i) => {
                        const label = isObjectOptions ? opt.label : opt;
                        const value = isObjectOptions ? opt.value : opt;
                        return (
                            <div
                                key={i}
                                className={`custom-dropdown-item ${value === selected ? 'selected' : ''}`}
                                onClick={() => {
                                    onSelect(value);
                                    setOpen(false);
                                }}
                            >
                                {label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
