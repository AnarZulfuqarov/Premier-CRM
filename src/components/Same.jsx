import React from 'react';
import { usePopup } from './Popup/PopupContext';

function SomeComponent() {
    const addPopup = usePopup();

    const handleError = () => {
        addPopup(
            'Yalnış İstifadəçi Adı və ya Şifrə',
            'İstifadəçi adı və şifrə səhvdir. Xahiş edirik, məlumatlarınızı yoxlayın və yenidən cəhd edin.',
            'error',
            5000
        );
    };

    const handleSuccess = () => {
        addPopup(
            'Uğurla daxil oldunuz!',
            'İndi hesabınızı idarə edə və əməliyyatları yerinə yetirə bilərsiniz.',
            'success',
            5000
        );
    };

    const handleWarning = () => {
        addPopup(
            'Diqqət, xəbərdarlıq!',
            'Bura warning üçün nümunə mesajı yazın.',
            'warning',
            5000
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <button onClick={handleError}>Show Error</button>
            <button onClick={handleSuccess}>Show Success</button>
            <button onClick={handleWarning}>Show Warning</button>
        </div>
    );
}

export default SomeComponent;