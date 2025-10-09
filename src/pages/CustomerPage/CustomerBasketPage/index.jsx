import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from 'js-cookie';
import './index.scss';
import OrderConfirmationModal from '../../../components/UserComponents/OrderConfirmationModal';
import OrderSuccessModal from '../../../components/UserComponents/OrderSuccessModal';
import { useCreateOrdersMutation } from '../../../services/adminApi';
import { usePopup } from '../../../components/Popup/PopupContext.jsx';

const MobileCartPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [postOrder] = useCreateOrdersMutation();
    const showPopup = usePopup();

    // 🧠 State-lər
    const [cartItems, setCartItems] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [description, setDescription] = useState('');
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // 🔄 localStorage-dan məlumatları yüklə
    useEffect(() => {
        const savedCart = localStorage.getItem('cartData');
        if (savedCart) {
            const parsed = JSON.parse(savedCart);
            setCartItems(parsed.cartItems || []);
            setSelectedDate(parsed.selectedDate ? new Date(parsed.selectedDate) : null);
            setDescription(parsed.description || '');
        }
    }, []);

    // 💾 Hər dəyişiklikdə localStorage yenilə
    useEffect(() => {
        localStorage.setItem(
            'cartData',
            JSON.stringify({
                cartItems,
                selectedDate,
                description,
            })
        );
    }, [cartItems, selectedDate, description]);

    // ❌ Səbət boşdursa
    if (!cartItems.length) {
        return (
            <p>
                Səbət boşdur.{' '}
                <button onClick={() => navigate('/customer/customerAdd')}>Geri dön</button>
            </p>
        );
    }

    // 📦 Məhsul sayını dəyiş
    const handleQuantityChange = (index, delta) => {
        setCartItems(prev => {
            const updated = [...prev];
            const newQty = updated[index].quantity + delta;
            if (newQty <= 0) return prev; // sıfırdan aşağı olmasın
            updated[index].quantity = newQty;
            return updated;
        });
    };

    // 🗑 Məhsulu sil
    const handleDeleteItem = (index) => {
        setCartItems(prev => prev.filter((_, i) => i !== index));
    };

    // 🧩 Kateqoriyaya görə qruplaşdırma
    const groupedCartItems = cartItems.reduce((groups, item) => {
        if (!groups[item.categoryId]) {
            groups[item.categoryId] = {
                categoryName: item.categoryName || 'Kateqoriya yoxdur',
                items: [],
            };
        }
        groups[item.categoryId].items.push(item);
        return groups;
    }, {});

    // 📨 Sifarişi göndər
    const handleConfirmOrder = async () => {
        const payload = {
            sectionId: Cookies.get('sectionId'),
            description,
            orderLimitTime: selectedDate
                ? `${selectedDate.getDate().toString().padStart(2, '0')}.${(selectedDate.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}.${selectedDate.getFullYear()}`
                : null,
            items: cartItems.map(item => ({
                productId: item.productId,
                requiredQuantity: item.quantity,
            })),
        };

        try {
            await postOrder(payload).unwrap();
            setIsConfirmationModalOpen(false);
            setIsSuccessModalOpen(true);
            localStorage.removeItem('cartData');
            setCartItems([]);
            setSelectedDate(null);
            setDescription('');
        } catch (err) {
            console.error('Sifariş xətası:', err);
            showPopup('Xəta', err?.data?.message || 'Sifariş göndərilə bilmədi', 'error');
        }
    };

    return (
        <div className="mobile-cart-page">
            <div className="path">
                <h2>
                    <NavLink className="link" to="/customer/customerAdd">
                        — Yeni sifariş
                    </NavLink>{' '}
                    — Səbətə əlavə edilən məhsullar
                </h2>
            </div>

            <div className="order-form__cart-panel">
                <h3>Səbətə əlavə edilən məhsullar</h3>
                <div className="order-form__cart-panel_main">
                    {/* 🗓️ Tarix seçimi */}
                    <div className="order-form__cart-search">
                        <DatePicker
                            selected={selectedDate}
                            onChange={setSelectedDate}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Sifariş çatdırılma tarixi"
                            className="custom-datepicker-input"
                            minDate={new Date()}
                        />
                    </div>

                    {/* 📋 Cədvəl */}
                    <div className="table_cont">
                        <table className="order-form__cart-table">
                            <thead>
                            <tr>
                                <th>Məhsul</th>
                                <th>Miqdar</th>
                                <th>Əməliyyat</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(groupedCartItems).map(([categoryId, group]) => (
                                <React.Fragment key={categoryId}>
                                    <tr className="category-row">
                                        <td colSpan={3} style={{ fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>
                                            {group.categoryName}
                                        </td>
                                    </tr>
                                    {group.items.map((item, index) => {
                                        const globalIndex = cartItems.findIndex(ci => ci.productId === item.productId);
                                        return (
                                            <tr key={item.productId}>
                                                <td>{item.name}</td>
                                                <td>
                                                    <div className="quantity-Cart">
                                                        <button onClick={() => handleQuantityChange(globalIndex, -1)}>-</button>
                                                        <p>{item.quantity}</p>
                                                        <button onClick={() => handleQuantityChange(globalIndex, 1)}>+</button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        className="order-form__delete-btn"
                                                        onClick={() => handleDeleteItem(globalIndex)}
                                                    >
                                                        🗑<svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M10.31 2.25H13.69C13.907 2.25 14.096 2.25 14.274 2.278C14.6207 2.33354 14.9496 2.46946 15.2344 2.67488C15.5192 2.8803 15.7519 3.14952 15.914 3.461C15.998 3.621 16.057 3.8 16.126 4.005L16.237 4.34L16.267 4.425C16.3575 4.67615 16.526 4.89174 16.7479 5.04019C16.9697 5.18865 17.2333 5.26217 17.5 5.25H20.5C20.6989 5.25 20.8897 5.32902 21.0303 5.46967C21.171 5.61032 21.25 5.80109 21.25 6C21.25 6.19891 21.171 6.38968 21.0303 6.53033C20.8897 6.67098 20.6989 6.75 20.5 6.75H3.5C3.30109 6.75 3.11032 6.67098 2.96967 6.53033C2.82902 6.38968 2.75 6.19891 2.75 6C2.75 5.80109 2.82902 5.61032 2.96967 5.46967C3.11032 5.32902 3.30109 5.25 3.5 5.25H6.59C6.8571 5.24359 7.11513 5.15177 7.32623 4.988C7.53733 4.82423 7.6904 4.59713 7.763 4.34L7.875 4.005C7.943 3.8 8.002 3.621 8.085 3.461C8.24719 3.1494 8.48009 2.8801 8.76505 2.67468C9.05001 2.46925 9.37911 2.3334 9.726 2.278C9.904 2.25 10.093 2.25 10.309 2.25M9.007 5.25C9.07626 5.11205 9.13476 4.96896 9.182 4.822L9.282 4.522C9.373 4.249 9.394 4.194 9.415 4.154C9.46898 4.05001 9.54658 3.96011 9.64157 3.89152C9.73657 3.82292 9.84631 3.77754 9.962 3.759C10.0923 3.74746 10.2233 3.74445 10.354 3.75H13.644C13.932 3.75 13.992 3.752 14.036 3.76C14.1516 3.77843 14.2613 3.82366 14.3563 3.89208C14.4512 3.9605 14.5289 4.05019 14.583 4.154C14.604 4.194 14.625 4.249 14.716 4.523L14.816 4.823L14.855 4.935C14.8943 5.04433 14.9397 5.14933 14.991 5.25H9.007Z"
                                                            fill="black"
                                                        />
                                                        <path
                                                            d="M5.91501 8.44993C5.90174 8.25141 5.81017 8.06629 5.66042 7.9353C5.51067 7.80431 5.31502 7.73816 5.11651 7.75143C4.91799 7.76469 4.73287 7.85626 4.60188 8.00601C4.47089 8.15576 4.40474 8.35141 4.41801 8.54993L4.88201 15.5019C4.96701 16.7839 5.03601 17.8199 5.19801 18.6339C5.36701 19.4789 5.65301 20.1849 6.24501 20.7379C6.83701 21.2909 7.56001 21.5309 8.41501 21.6419C9.23701 21.7499 10.275 21.7499 11.561 21.7499H12.44C13.725 21.7499 14.764 21.7499 15.586 21.6419C16.44 21.5309 17.164 21.2919 17.756 20.7379C18.347 20.1849 18.633 19.4779 18.802 18.6339C18.964 17.8209 19.032 16.7839 19.118 15.5019L19.582 8.54993C19.5953 8.35141 19.5291 8.15576 19.3981 8.00601C19.2671 7.85626 19.082 7.76469 18.8835 7.75143C18.685 7.73816 18.4893 7.80431 18.3396 7.9353C18.1898 8.06629 18.0983 8.25141 18.085 8.44993L17.625 15.3499C17.535 16.6969 17.471 17.6349 17.331 18.3399C17.194 19.0249 17.004 19.3869 16.731 19.6429C16.457 19.8989 16.083 20.0649 15.391 20.1549C14.678 20.2479 13.738 20.2499 12.387 20.2499H11.613C10.263 20.2499 9.32301 20.2479 8.60901 20.1549C7.91701 20.0649 7.54301 19.8989 7.26901 19.6429C6.99601 19.3869 6.80601 19.0249 6.66901 18.3409C6.52901 17.6349 6.46501 16.6969 6.37501 15.3489L5.91501 8.44993Z"
                                                            fill="black"
                                                        />
                                                        <path
                                                            d="M9.425 10.254C9.62284 10.2342 9.82045 10.2937 9.97441 10.4195C10.1284 10.5454 10.226 10.7272 10.246 10.925L10.746 15.925C10.7606 16.1201 10.6985 16.3132 10.5728 16.4631C10.4471 16.613 10.2678 16.7078 10.0731 16.7274C9.87848 16.7469 9.68389 16.6897 9.53086 16.5678C9.37783 16.4459 9.27848 16.2691 9.254 16.075L8.754 11.075C8.73417 10.8771 8.79372 10.6795 8.91954 10.5256C9.04537 10.3716 9.22717 10.2739 9.425 10.254ZM14.575 10.254C14.7726 10.2739 14.9543 10.3715 15.0801 10.5252C15.2059 10.679 15.2655 10.8763 15.246 11.074L14.746 16.074C14.7212 16.2677 14.6218 16.4441 14.469 16.5657C14.3161 16.6873 14.1219 16.7445 13.9275 16.725C13.7332 16.7056 13.5541 16.6112 13.4283 16.4618C13.3025 16.3124 13.24 16.1198 13.254 15.925L13.754 10.925C13.774 10.7274 13.8715 10.5457 14.0252 10.4199C14.179 10.2941 14.3773 10.2344 14.575 10.254Z"
                                                            fill="black"
                                                        />
                                                    </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ✍️ Qeyd */}
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Qeyd..."
                    />

                    {/* ✅ Təsdiqlə */}
                    <button
                        className="order-form__submit-btn"
                        onClick={() => setIsConfirmationModalOpen(true)}
                        disabled={!selectedDate || cartItems.length === 0}
                    >
                        Sifarişi təsdiqlə
                    </button>
                </div>
            </div>

            {/* Modallar */}
            <OrderConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmOrder}
                cartItems={cartItems}
                description={description}
            />

            <OrderSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => {
                    setIsSuccessModalOpen(false);
                    navigate('/customer/customerAdd');
                }}
            />
        </div>
    );
};

export default MobileCartPage;
