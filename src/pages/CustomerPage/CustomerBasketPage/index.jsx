import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import React,{useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from 'js-cookie';
import "./index.scss"
import OrderConfirmationModal from '../../../components/UserComponents/OrderConfirmationModal';
import OrderSuccessModal from '../../../components/UserComponents/OrderSuccessModal';
import {useCreateOrdersMutation} from '../../../services/adminApi';
import {usePopup} from "../../../components/Popup/PopupContext.jsx";

const MobileCartPage = () => {
    const { state } = useLocation();
    const localCartData = localStorage.getItem('cartData');
    const parsedData = localCartData ? JSON.parse(localCartData) : {};

    const navigate = useNavigate();
    const [postOrder] = useCreateOrdersMutation();
    const showPopup = usePopup();

    const [cartItems, setCartItems] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [description, setDescription] = useState('');
    useEffect(() => {
        const savedCart = localStorage.getItem('cartData');
        if (savedCart) {
            const parsed = JSON.parse(savedCart);
            if (parsed.cartItems) setCartItems(parsed.cartItems);
            if (parsed.selectedDate) setSelectedDate(new Date(parsed.selectedDate));
            if (parsed.description) setDescription(parsed.description);
        }
    }, []);



    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    if (!state?.cartItems) {
        return <p>Səbət boşdur. <button onClick={() => navigate('/customer/customerAdd')}>Geri dön</button></p>;
    }

    const handleConfirmOrder = async () => {
        const payload = {
            sectionId: Cookies.get('sectionId'),
            description,
            orderLimitTime: selectedDate
                ? `${selectedDate.getDate().toString().padStart(2, '0')}.${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getFullYear()}`
                : null,
            items: cartItems.map(item => ({
                productId: item.productId,
                requiredQuantity: item.quantity
            }))
        };

        try {
            await postOrder(payload).unwrap();
            setIsConfirmationModalOpen(false);
            setIsSuccessModalOpen(true);
            localStorage.removeItem('cartData');

// 🧹 Form məlumatlarını təmizlə
            setCartItems([]);
            setSelectedDate(null);
            setDescription('');

        } catch (err) {
            console.error('Sifariş xətası:', err);
            showPopup('Xəta', err?.data?.message || 'Sifariş göndərilə bilmədi', 'error');
        }
    };
    const groupedCartItems = cartItems.reduce((groups, item) => {
        if (!groups[item.categoryId]) {
            groups[item.categoryId] = {
                categoryName: item.categoryName || "Kateqoriya yoxdur",
                items: []
            };
        }
        groups[item.categoryId].items.push(item);
        return groups;
    }, {});

    const handleDeleteItem = (index) => {
        setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
    };
    return (
        <div className="mobile-cart-page">
            <div className={"path"}>
                <h2>
                    <NavLink className="link" to="/customer/customerAdd">— Yeni sifariş</NavLink>{' '}
                    — Səbətə əlavə edilən məhsullar
                </h2>
            </div>
            <div className="order-form__cart-panel">
                <h3>Səbətə əlavə edilən məhsullar</h3>
                <div className="order-form__cart-panel_main">

                    <div className="order-form__cart-search">
                        <DatePicker
                            selected={selectedDate}
                            onChange={setSelectedDate}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Sifariş  çatdırılma tarixi"
                            className="custom-datepicker-input"
                            minDate={new Date()}
                        />
                        <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                    viewBox="0 0 24 24" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd"
        d="M19.5 17.3505C19.5 18.54 18.54 19.5 17.3505 19.5H6.6495C5.46 19.5 4.5 18.54 4.5 17.3505V6.6495C4.5 5.46 5.46 4.5 6.6495 4.5H9V3.7575C9.00121 3.58102 9.0634 3.41039 9.17603 3.27452C9.28866 3.13866 9.44481 3.04591 9.618 3.012L9.75 3C10.164 3 10.5 3.321 10.5 3.7575V4.5H13.5V3.7575C13.5012 3.58102 13.5634 3.41039 13.676 3.27452C13.7887 3.13866 13.9448 3.04591 14.118 3.012L14.25 3C14.664 3 15 3.321 15 3.7575V4.5H17.3505C18.54 4.5 19.5 5.46 19.5 6.6495V17.3505ZM6 9V16.995C6 17.55 6.45 18 7.005 18H16.995C17.55 18 18 17.55 18 16.995V9H6ZM8.25 15C8.6175 15 8.925 15.2745 8.988 15.618L9 15.75C9 16.1175 8.7255 16.425 8.382 16.488L8.25 16.5C8.05169 16.498 7.86206 16.4184 7.72183 16.2782C7.5816 16.1379 7.50195 15.9483 7.5 15.75C7.5 15.3825 7.7745 15.075 8.118 15.012L8.25 15ZM12 15C12.3675 15 12.675 15.2745 12.738 15.618L12.75 15.75C12.75 16.1175 12.4755 16.425 12.132 16.488L12 16.5C11.8017 16.498 11.6121 16.4184 11.4718 16.2782C11.3316 16.1379 11.252 15.9483 11.25 15.75C11.25 15.3825 11.5245 15.075 11.868 15.012L12 15ZM15.75 15C16.1175 15 16.425 15.2745 16.488 15.618L16.5 15.75C16.5 16.1175 16.2255 16.425 15.882 16.488L15.75 16.5C15.5517 16.498 15.3621 16.4184 15.2218 16.2782C15.0816 16.1379 15.002 15.9483 15 15.75C15 15.3825 15.2745 15.075 15.618 15.012L15.75 15ZM8.25 12.75C8.6175 12.75 8.925 13.0245 8.988 13.368L9 13.5C9 13.8675 8.7255 14.175 8.382 14.238L8.25 14.25C8.05169 14.248 7.86206 14.1684 7.72183 14.0282C7.5816 13.8879 7.50195 13.6983 7.5 13.5C7.5 13.1325 7.7745 12.825 8.118 12.762L8.25 12.75ZM12 12.75C12.3675 12.75 12.675 13.0245 12.738 13.368L12.75 13.5C12.75 13.8675 12.4755 14.175 12.132 14.238L12 14.25C11.8017 14.248 11.6121 14.1684 11.4718 14.0282C11.3316 13.8879 11.252 13.6983 11.25 13.5C11.25 13.1325 11.5245 12.825 11.868 12.762L12 12.75ZM15.75 12.75C16.1175 12.75 16.425 13.0245 16.488 13.368L16.5 13.5C16.5 13.8675 16.2255 14.175 15.882 14.238L15.75 14.25C15.5517 14.248 15.3621 14.1684 15.2218 14.0282C15.0816 13.8879 15.002 13.6983 15 13.5C15 13.1325 15.2745 12.825 15.618 12.762L15.75 12.75ZM8.25 10.5C8.6175 10.5 8.925 10.7745 8.988 11.118L9 11.25C9 11.6175 8.7255 11.925 8.382 11.988L8.25 12C8.05169 11.998 7.86206 11.9184 7.72183 11.7782C7.5816 11.6379 7.50195 11.4483 7.5 11.25C7.5 10.8825 7.7745 10.575 8.118 10.512L8.25 10.5ZM12 10.5C12.3675 10.5 12.675 10.7745 12.738 11.118L12.75 11.25C12.75 11.6175 12.4755 11.925 12.132 11.988L12 12C11.8017 11.998 11.6121 11.9184 11.4718 11.7782C11.3316 11.6379 11.252 11.4483 11.25 11.25C11.25 10.8825 11.5245 10.575 11.868 10.512L12 10.5ZM15.75 10.5C16.1175 10.5 16.425 10.7745 16.488 11.118L16.5 11.25C16.5 11.6175 16.2255 11.925 15.882 11.988L15.75 12C15.5517 11.998 15.3621 11.9184 15.2218 11.7782C15.0816 11.6379 15.002 11.4483 15 11.25C15 10.8825 15.2745 10.575 15.618 10.512L15.75 10.5ZM6 7.5H18V7.005C18 6.45 17.55 6 16.995 6H7.005C6.45 6 6 6.45 6 7.005V7.5Z"
        fill="#474747"/>
</svg></span>
                    </div>

                    <div className="table_cont">
                        <table className="order-form__cart-table">
                            <thead>
                            <tr>
                                <th>Product name</th>
                                <th>Miqdar</th>
                                <th>Status</th>
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
                                    {group.items.map((item, index) => (
                                        <tr key={item.productId}>
                                            <td>{item.name}</td>
                                            <td>
                                                <div className="quantity-Cart">
                                                    <button onClick={() => handleQuantityChange(cartItems.findIndex(ci => ci.productId === item.productId), -1)}>-</button>
                                                    <p>{item.quantity}</p>
                                                    <button onClick={() => handleQuantityChange(cartItems.findIndex(ci => ci.productId === item.productId), 1)}>+</button>
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    className="order-form__delete-btn"
                                                    onClick={() => handleDeleteItem(cartItems.findIndex(ci => ci.productId === item.productId))}
                                                >
                                                    <svg
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
                                    ))}
                                </React.Fragment>
                            ))}
                            </tbody>

                        </table>
                    </div>

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Qeyd..."
                    />

                    <button
                        className="order-form__submit-btn"
                        onClick={() => setIsConfirmationModalOpen(true)}
                        disabled={!selectedDate || cartItems.length === 0}
                    >
                        Sifarişi təsdiqlə
                    </button>
                </div>
            </div>
            <OrderConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmOrder}
                cartItems={cartItems}
                description={description}
            />

            {/* ✅ Modal: Başarılı */}
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
