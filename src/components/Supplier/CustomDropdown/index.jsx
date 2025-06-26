import { useState, useRef, useEffect } from 'react';
import './index.scss';

const CustomDropdown = ({ options, selected, onSelect, placeholder = "Seçin" }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            <div className="custom-dropdown-header" onClick={() => setOpen(!open)}>
                {selected ? (
                    <span>{selected}</span>
                ) : (
                    <span className="placeholder">{placeholder}</span>
                )}
                <span className="arrow">{open ? '▲' : '▼'}</span>
            </div>

            {open && (
                <div className="custom-dropdown-list">
                    {options.map((opt, i) => (
                        <div
                            key={i}
                            className={`custom-dropdown-item ${opt === selected ? 'selected' : ''}`}
                            onClick={() => {
                                onSelect(opt);
                                setOpen(false);
                            }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
