import { useState, useRef, useEffect } from 'react';
import './index.scss';

const CustomDropdown = ({ options, selected, onSelect, placeholder = "Seçin" }) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // Yeni: Axtarış state-i
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
                setSearchTerm(''); // Axtarışı sıfırla
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // isObjectOptions: Obyekt və ya sadə string array-i yoxla
    const isObjectOptions = typeof options?.[0] === 'object';

    // Selected label-i tap
    const selectedLabel = isObjectOptions
        ? options.find(opt => opt.value === selected)?.label
        : selected;

    // Axtarışa görə filtrlə (label və ya value-dan)
    const filteredOptions = options?.filter(opt => {
        const label = isObjectOptions ? opt.label : opt;
        const value = isObjectOptions ? opt.value : opt;
        const term = searchTerm.toLowerCase();
        return label.toLowerCase().includes(term) || value.toLowerCase().includes(term);
    });

    // Axtarış input-un onChange handler-i
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

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
                    {/* Yeni: Axtarış input-u */}
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Axtarış..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        autoFocus // Avtomatik fokus et
                    />

                    {/* Filtrlənmiş variantlar */}
                    <div className="options-container">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt, i) => {
                                const label = isObjectOptions ? opt.label : opt;
                                const value = isObjectOptions ? opt.value : opt;
                                return (
                                    <div
                                        key={i}
                                        className={`custom-dropdown-item ${value === selected ? 'selected' : ''}`}
                                        onClick={() => {
                                            onSelect(value);
                                            setOpen(false);
                                            setSearchTerm(''); // Axtarışı sıfırla
                                        }}
                                    >
                                        {label}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="no-results">Heç bir nəticə tapılmadı</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;