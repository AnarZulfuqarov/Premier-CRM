import React from 'react';
import './index.scss';

const OrderSuccessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="success-modal__overlay">
            <div className="success-modal__container">
                <div className="success-modal__header">
                    <div className={"success-modal__icons"}>
                        <div className="success-modal__icon">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
  <path d="M12.0383 18.8539L22.407 8.4852C22.6517 8.24051 22.9372 8.11816 23.2635 8.11816C23.5897 8.11816 23.8752 8.24051 24.1199 8.4852C24.3646 8.72989 24.4869 9.02066 24.4869 9.35752C24.4869 9.69438 24.3646 9.98474 24.1199 10.2286L12.8947 21.4844C12.65 21.7291 12.3645 21.8514 12.0383 21.8514C11.712 21.8514 11.4266 21.7291 11.1819 21.4844L5.92103 16.2235C5.67634 15.9788 5.55889 15.6885 5.56868 15.3524C5.57847 15.0164 5.70611 14.7256 5.95162 14.4801C6.19713 14.2346 6.4879 14.1123 6.82394 14.1131C7.15998 14.1139 7.45035 14.2362 7.69504 14.4801L12.0383 18.8539Z" fill="white"/>
</svg>
                            </span>
                        </div>
                    </div>
                    <h3>Sifarişiniz uğurla qeydə alındı!</h3>
                    <p>Sifarişiniz üçün təşəkkür edirik. Sifarişinizi dərhal hazırlamağa başlayacağıq!</p>
                </div>
                <button className="success-modal__button" onClick={onClose}>
                    Əsas səhifəyə qayıt
                </button>
            </div>
        </div>
    );
};

export default OrderSuccessModal;