import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from 'js-cookie';

import OrderConfirmationModal from '../../../components/UserComponents/OrderConfirmationModal';
import OrderSuccessModal from '../../../components/UserComponents/OrderSuccessModal';
import { useCreateOrdersMutation } from '../../../services/adminApi';

const MobileCartPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [postOrder] = useCreateOrdersMutation();

    const [selectedDate, setSelectedDate] = useState(state?.selectedDate || null);
    const [description, setDescription] = useState(state?.description || '');
    const [cartItems, setCartItems] = useState(state?.cartItems || []);

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
            await postOrder(payload);
            setIsConfirmationModalOpen(false);
            setIsSuccessModalOpen(true);
        } catch (err) {
            console.error('Sifariş xətası:', err);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <button onClick={() => navigate('/customer/customerAdd')}>← Geri</button>

            <h2>Səbət</h2>
            <ul>
                {cartItems.map((item, i) => (
                    <li key={i}>{item.name} – {item.quantity}</li>
                ))}
            </ul>

            <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                dateFormat="dd/MM/yyyy"
                placeholderText="Tarix seç"
            />

            <textarea
                placeholder="Qeyd..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <button
                onClick={() => setIsConfirmationModalOpen(true)}
                disabled={!selectedDate || cartItems.length === 0}
            >
                Sifarişi təsdiqlə
            </button>

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
                    navigate('/order');
                }}
            />
        </div>
    );
};

export default MobileCartPage;
