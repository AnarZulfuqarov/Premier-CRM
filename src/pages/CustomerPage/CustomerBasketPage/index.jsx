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
                                                        🗑️
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
