import React, { createContext, useContext, useState, useCallback } from 'react';
import PopupContainer from "./PopupContainer.jsx";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
    const [popups, setPopups] = useState([]);

    const addPopup = useCallback((title, description, type = 'success', duration = 5000) => {
        const id = Date.now();
        setPopups((prev) => [...prev, { id, title, description, type }]);
        setTimeout(() => {
            setPopups((prev) => prev.filter((p) => p.id !== id));
        }, duration);
    }, []);

    return (
        <PopupContext.Provider value={addPopup}>
            {children}
            <PopupContainer popups={popups} />
        </PopupContext.Provider>
    );
};

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};