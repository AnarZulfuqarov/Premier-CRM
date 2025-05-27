import React from 'react';
import './index.scss'
const OrderConfirmationModal = ({ isOpen, onClose, onConfirm, cartItems }) => {
    if (!isOpen) return null;

    return (
        <div className="order-form__modal-overlay">
            <div className="order-form__modal">
                <div className="order-form__modal-header">
                    <h3>Bunlar sifariş etmək istədiyiniz əminsiniz?</h3>
                    <button className="order-form__modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className="order-form__modal-content">
                    <table className="order-form__modal-table">
                        <thead>
                        <tr>
                            <th>Məhsul</th>
                            <th>Miqdar</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartItems.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.quantity} ədəd</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="order-form__modal-notes">
                        <p>Qeyd...</p>
                    </div>
                </div>
                <div className="order-form__modal-footer">
                    <button className="order-form__modal-cancel" onClick={onClose}>
                        Yenidən bax
                    </button>
                    <button className="order-form__modal-confirm" onClick={onConfirm}>
                        Təsdiqlə
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationModal;