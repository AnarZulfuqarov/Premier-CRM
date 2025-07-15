import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from 'js-cookie';
import "./index.scss"
import OrderConfirmationModal from '../../../components/UserComponents/OrderConfirmationModal';
import OrderSuccessModal from '../../../components/UserComponents/OrderSuccessModal';
import {useCreateOrdersMutation} from '../../../services/adminApi';

const MobileCartPage = () => {
    const {state} = useLocation();
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
                            {cartItems.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.name}</td>
                                    <td>
                                        <div className="quantity-Cart">
                                            <button onClick={() => handleQuantityChange(i, -1)}>-</button>
                                            <p>{item.quantity}</p>
                                            <button onClick={() => handleQuantityChange(i, 1)}>+</button>
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            className="order-form__delete-btn"
                                            onClick={() => handleDeleteItem(i)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21"
                                                 viewBox="0 0 21 21" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                      d="M8.66007 2.3125H11.4982C11.6805 2.3125 11.8392 2.3125 11.9886 2.33601C12.2798 2.38265 12.5559 2.49678 12.7951 2.66927C13.0342 2.84176 13.2296 3.06782 13.3657 3.32937C13.4363 3.46372 13.4858 3.61403 13.5437 3.78616L13.6369 4.06746L13.6621 4.13884C13.7381 4.34973 13.8796 4.53076 14.0659 4.65541C14.2522 4.78007 14.4735 4.84181 14.6975 4.83158H17.2166C17.3836 4.83158 17.5438 4.89793 17.6619 5.01604C17.78 5.13414 17.8463 5.29433 17.8463 5.46135C17.8463 5.62838 17.78 5.78857 17.6619 5.90667C17.5438 6.02478 17.3836 6.09113 17.2166 6.09113H2.94175C2.77473 6.09113 2.61454 6.02478 2.49644 5.90667C2.37833 5.78857 2.31198 5.62838 2.31198 5.46135C2.31198 5.29433 2.37833 5.13414 2.49644 5.01604C2.61454 4.89793 2.77473 4.83158 2.94175 4.83158H5.53641C5.76069 4.8262 5.97735 4.7491 6.15462 4.61158C6.33188 4.47407 6.46041 4.28337 6.52137 4.06746L6.61542 3.78616C6.67252 3.61403 6.72206 3.46372 6.79175 3.32937C6.92794 3.06772 7.12351 2.84159 7.36279 2.6691C7.60207 2.4966 7.87841 2.38253 8.16969 2.33601C8.31916 2.3125 8.47786 2.3125 8.65923 2.3125M7.56595 4.83158C7.62411 4.71575 7.67323 4.59559 7.7129 4.47219L7.79687 4.22029C7.87328 3.99105 7.89091 3.94487 7.90855 3.91128C7.95388 3.82396 8.01904 3.74847 8.0988 3.69087C8.17856 3.63327 8.27071 3.59516 8.36786 3.5796C8.4773 3.56991 8.58725 3.56738 8.69702 3.57204H11.4596C11.7014 3.57204 11.7518 3.57372 11.7888 3.58044C11.8858 3.59591 11.9779 3.6339 12.0577 3.69135C12.1375 3.74879 12.2027 3.82411 12.2481 3.91128C12.2657 3.94487 12.2834 3.99105 12.3598 4.22113L12.4437 4.47303L12.4765 4.56708C12.5095 4.65889 12.5476 4.74705 12.5907 4.83158H7.56595Z"
                                                      fill="black"/>
                                                <path
                                                    d="M4.96866 7.51957C4.95753 7.35288 4.88063 7.19744 4.75489 7.08744C4.62914 6.97745 4.46486 6.92191 4.29816 6.93304C4.13147 6.94418 3.97603 7.02107 3.86604 7.14682C3.75604 7.27256 3.7005 7.43685 3.71164 7.60354L4.10126 13.4411C4.17263 14.5176 4.23057 15.3875 4.3666 16.071C4.50851 16.7806 4.74866 17.3734 5.24576 17.8377C5.74286 18.3021 6.34996 18.5036 7.0679 18.5968C7.75813 18.6875 8.62973 18.6875 9.70958 18.6875H10.4477C11.5267 18.6875 12.3991 18.6875 13.0893 18.5968C13.8064 18.5036 14.4144 18.3029 14.9115 17.8377C15.4077 17.3734 15.6479 16.7797 15.7898 16.071C15.9258 15.3883 15.9829 14.5176 16.0551 13.4411L16.4448 7.60354C16.4559 7.43685 16.4004 7.27256 16.2904 7.14682C16.1804 7.02107 16.0249 6.94418 15.8582 6.93304C15.6915 6.92191 15.5273 6.97745 15.4015 7.08744C15.2758 7.19744 15.1989 7.35288 15.1877 7.51957L14.8015 13.3135C14.7259 14.4445 14.6722 15.2322 14.5546 15.8242C14.4396 16.3993 14.28 16.7033 14.0508 16.9183C13.8207 17.1332 13.5067 17.2726 12.9256 17.3482C12.3269 17.4263 11.5376 17.428 10.4032 17.428H9.75324C8.61965 17.428 7.83034 17.4263 7.2308 17.3482C6.64973 17.2726 6.33568 17.1332 6.10561 16.9183C5.87637 16.7033 5.71683 16.3993 5.60179 15.825C5.48423 15.2322 5.43049 14.4445 5.35492 13.3126L4.96866 7.51957Z"
                                                    fill="black"/>
                                                <path
                                                    d="M7.91507 9.03439C8.0812 9.01774 8.24713 9.06774 8.37641 9.1734C8.50568 9.27905 8.58771 9.43171 8.60446 9.59783L9.02431 13.7963C9.03661 13.9601 8.98441 14.1222 8.87886 14.2481C8.77331 14.374 8.62275 14.4536 8.4593 14.4701C8.29586 14.4865 8.13246 14.4384 8.00396 14.3361C7.87546 14.2337 7.79204 14.0852 7.77148 13.9223L7.35164 9.72378C7.33499 9.55766 7.38499 9.39172 7.49064 9.26245C7.5963 9.13317 7.74896 9.05114 7.91507 9.03439ZM12.2395 9.03439C12.4055 9.05115 12.558 9.13306 12.6636 9.26215C12.7692 9.39123 12.8193 9.55695 12.8029 9.72294L12.3831 13.9214C12.3623 14.0841 12.2788 14.2322 12.1505 14.3343C12.0221 14.4364 11.859 14.4844 11.6958 14.4681C11.5326 14.4518 11.3823 14.3725 11.2766 14.247C11.171 14.1216 11.1185 13.9599 11.1303 13.7963L11.5501 9.59783C11.5669 9.43187 11.6488 9.27935 11.7779 9.17372C11.907 9.06809 12.0735 9.01798 12.2395 9.03439Z"
                                                    fill="black"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
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
