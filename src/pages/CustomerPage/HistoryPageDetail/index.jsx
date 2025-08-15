// OrderHistoryDetail.jsx
import {useEffect, useState} from 'react';
import {NavLink, useNavigate, useParams} from 'react-router-dom';
import {FaTimes} from 'react-icons/fa';
import './index.scss';
import {useDeleteOrderMutation, useGetMyOrdersIdQuery, useOrderConfirmMutation} from "../../../services/adminApi.jsx";
import {usePopup} from "../../../components/Popup/PopupContext.jsx";

const OrderHistoryDetail = () => {
    const {id} = useParams();
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    const showPopup= usePopup()
    const {data: getMyOrdersId,refetch} = useGetMyOrdersIdQuery(id)
    const orderData = getMyOrdersId?.data
    let status = '';

    if (orderData?.employeeConfirm && orderData?.fighterConfirm) {
        if (orderData?.employeeDelivery && !orderData?.incompledEmployee) {
            status = 'Tamamlanmış';
        } else if (!orderData?.employeeDelivery && orderData?.incompledEmployee) {
            status = 'Natamam sifariş';
        } else if (!orderData?.employeeDelivery && !orderData?.incompledEmployee) {
            status = 'Təhvil alınmayan';
        }
    } else if (orderData?.employeeConfirm && !orderData?.fighterConfirm) {
        status = 'Təchizatçıdan təsdiq gözləyən';
    }
    const vendorName = orderData?.fighterInfo
        ? `${orderData.fighterInfo.name} ${orderData.fighterInfo.surname}`
        : null;

    const totalPricee = orderData?.items?.reduce((sum, item) =>
        sum + item.suppliedQuantity * (item?.price || 0), 0
    ) || 0;
    const itemCount = orderData?.items?.length || 0;
    const totalPrice = totalPricee.toFixed(2)
    const uniqueCategories = [
        ...new Set(orderData?.items?.map(item => item.product?.categoryName).filter(Boolean))
    ];
    const categoryCount = uniqueCategories.length;
    useEffect(() => {
        refetch()
    }, []);
        // filtre uygula
    const [tehvil, { isSuccess: isTehvilSuccess }] = useOrderConfirmMutation();

    useEffect(() => {
        if (isTehvilSuccess) {
            navigate('/customer/history');
        }
    }, [isTehvilSuccess]);

    const filtered = orderData?.items?.map((item) => {
        const name = item.product?.name || '—';
        const category = item.product?.categoryName || '—';
        const required = `${item.requiredQuantity} ${item.product?.measure || ''}`;
        const provided = `${item.suppliedQuantity} ${item.product?.measure || ''}`;
        const priceTotal = item.price;
        const price = `${item.suppliedQuantity * priceTotal} ₼`;
        const priceEach = `${priceTotal} ₼`;
        const created = orderData?.createdDate;
        const delivery = orderData?.orderLimitTime;
        const received = item.orderDeliveryTime === '01.01.0001' ? '—' : item.orderItemDeliveryTime;

        const isIncomplete = item.suppliedQuantity < item.requiredQuantity;

        return {
            name,
            category,
            required,
            provided,
            price,
            priceEach,
            created,
            delivery,
            received,
            isIncomplete, // ✅ əlavə edildi
        };
    }).filter(item => {
        const byName = item.name?.toLowerCase().includes(searchName.toLowerCase());
        const byCat = item.category?.toLowerCase().includes(searchCategory.toLowerCase());
        return byName && byCat;
    }) || [];



    const [deleteOrder, { isSuccess }] = useDeleteOrderMutation();

    const navigate = useNavigate();
    useEffect(() => {
        if (isSuccess) {
            showPopup("Sifariş ləğv edildi","Seçilmiş sifariş sistemdən silindi.","success")
            navigate('/customer/history');
        }
    }, [isSuccess, navigate]);
    const [isNameSearchOpen, setIsNameSearchOpen] = useState(false);
    const [isCategorySearchOpen, setIsCategorySearchOpen] = useState(false);

    const toggleNameSearch = () => setIsNameSearchOpen(prev => !prev);
    const toggleCategorySearch = () => setIsCategorySearchOpen(prev => !prev);

    return (
        <div className="order-history-detail-main">
            <div className="order-history-detail">
                <h2>
                    <NavLink className="link" to="/customer/history">— Tarixçə</NavLink>{' '}
                    — Sifariş detalları
                </h2>
                <div className="order-history-detail__list">
                    <div className="order-history-detail__item">
                        {['Tamamlanmış', 'Təhvil alınmayan'].includes(status) && (
                                <p className={"order-history-detail__id-tech"}>
                                    <span>Təchizatçının adı:</span> {vendorName || '—'}
                                </p>

                        )}
                        <div className="order-history-detail__details">
                            <div className={"orderAndPrice"}>
                                <p className="order-history-detail__id">
                                    <span>Order ID</span> {orderData?.id}
                                </p>
                                {['Tamamlanmış', 'Təhvil alınmayan','Natamam sifariş'].includes(status) && (

                                        <p className={"order-history-detail__id"}>
                                            <span>Ümumi məbləğ:</span> {totalPrice} ₼
                                        </p>

                                )}
                            </div>
                            <span
                                className={`order-history-detail__status ${
                                    status === 'Tamamlanmış' ? 'completed' :
                                        status === 'Təchizatçıdan təsdiq gözləyən' ? 'pending' :
                                            status === 'Təhvil alınmayan' ? 'not-completed' :
                                                status === 'Natamam sifariş' ? 'incomplete' : ''
                                }`}
                            >
  {status}
</span>
                        </div>
                        <div className="order-history-detail__data">
                            <p>{orderData?.items?.map(item => item.product?.name).join(', ')}</p>
                            <p>
                                <span className="quantity-count">{itemCount}</span>{' '}
                                <span className="quantity-label">məhsul,</span>{' '}
                                <span className="quantity-count">{categoryCount}</span>{' '}
                                <span className="quantity-label">kateqoriya</span>
                            </p>

                        </div>

                    </div>
                </div>
                <div className="table-wrapper">
                    <div className="table-scroll">
                        <table className="order-history-detail__table">
                            <thead>
                            <tr>
                                <th>
                                    Ad
                                    <span
                                        className="order-history-detail__search-icon"
                                        onClick={toggleNameSearch}
                                    >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z" fill="#7A7A7A"/>
</svg>
      </span>
                                    {isNameSearchOpen && (
                                        <div className="order-history-detail__search-box">
                                            <input
                                                type="text"
                                                placeholder="Məhsul axtar..."
                                                value={searchName}
                                                onChange={(e) => setSearchName(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </th>
                                <th>
                                    Kateqoriya
                                    <span
                                        className="order-history-detail__search-icon"
                                        onClick={toggleCategorySearch}
                                    >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z" fill="#7A7A7A"/>
</svg>
      </span>
                                    {isCategorySearchOpen && (
                                        <div className="order-history-detail__search-box">
                                            <input
                                                type="text"
                                                placeholder="Kateqoriya axtar..."
                                                value={searchCategory}
                                                onChange={(e) => setSearchCategory(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </th>
                                <th>Tələb olunan miqdar</th>
                                {status !== 'Təchizatçıdan təsdiq gözləyən' && <th>Təmin olunan miqdar</th>}
                                {status !== 'Təchizatçıdan təsdiq gözləyən' && <th>Sifarişin məbləği</th>}
                                {status !== 'Təchizatçıdan təsdiq gözləyən' && <th>Qiyməti</th>}
                                <th>Sifarişin yaradılma tarixi</th>
                                {status !== 'Tamamlanmış' && <th>Çatdırılacaq tarixi</th>}
                                {status === 'Tamamlanmış' && <th>Təhvil alınma tarixi</th>}
                            </tr>
                            </thead>


                            <tbody>
                            {filtered.map((item, i) => (
                                <tr key={i} className={item.isIncomplete ? 'row-incomplete' : ''}>
                                    <td>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>{item.required}</td>
                                    {status !== 'Təchizatçıdan təsdiq gözləyən' && <td>{item.provided}</td>}
                                    {status !== 'Təchizatçıdan təsdiq gözləyən' && <td>{item.price}</td>}
                                    {status !== 'Təchizatçıdan təsdiq gözləyən' && <td>{item.priceEach}</td>}
                                    <td>{item.created}</td>
                                    {status !== 'Tamamlanmış' && <td>{item.delivery}</td>}
                                    {status === 'Tamamlanmış' && <td>{item.received}</td>}
                                </tr>
                            ))}
                            </tbody>


                        </table>

                        {(status === 'Təhvil alınmayan' || status === 'Tamamlanmış') && (
                            <div className="table-footer sticky-footer">
                                <span>Ümumi məbləğ:</span>
                                <span>{totalPrice} ₼</span>
                            </div>
                        )}
                    </div>



                </div>


                    {status === 'Təchizatçıdan təsdiq gözləyən' && (
                        <div className="order-history-detail__actions">
                            <span>Sifariş təsdiqlənməyib. İmtina etmək üçün silə bilərsiniz.</span>
                            <button
                                className="btn delete order-history-detail__confirm"
                                onClick={() => {
                                    deleteOrder(id);

                                }}

                            >
                                Sil
                            </button>

                        </div>
                    )}

                    {(status === 'Təhvil alınmayan' || status === "Natamam sifariş") && (
                        <div className="order-history-detail__actions">
                            <span>Sifariş hazırdır. Təhvil almağı təsdiq edin.</span>
                            <button
                                className="btn confirm order-history-detail__confirm"
                                onClick={() => {
                                    tehvil(id); // Order ID-ni backend-ə göndər
                                    setShowModal(true); // Modalı göstər
                                }}
                            >
                                Təhvil al
                            </button>

                        </div>
                    )}

                </div>
            {showModal && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal">
                        <FaTimes
                            className="confirm-modal__close"
                            onClick={() => setShowModal(false)}
                        />
                        <div className={"confirm-modal__iconHead"}>
                            <div className={"confirm-modal__iconMain"}>
                                <div className="confirm-modal__icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31"
                                         fill="none">
                                        <path
                                            d="M11.7714 19.3539L22.1402 8.9852C22.3849 8.74051 22.6704 8.61816 22.9966 8.61816C23.3229 8.61816 23.6083 8.74051 23.853 8.9852C24.0977 9.22989 24.2201 9.52066 24.2201 9.85752C24.2201 10.1944 24.0977 10.4847 23.853 10.7286L12.6279 21.9844C12.3832 22.2291 12.0977 22.3514 11.7714 22.3514C11.4452 22.3514 11.1597 22.2291 10.915 21.9844L5.65419 16.7235C5.4095 16.4788 5.29205 16.1885 5.30183 15.8524C5.31162 15.5164 5.43927 15.2256 5.68477 14.9801C5.93028 14.7346 6.22105 14.6123 6.5571 14.6131C6.89314 14.6139 7.1835 14.7362 7.42819 14.9801L11.7714 19.3539Z"
                                            fill="white"/>
                                    </svg>
                                </div>

                            </div>
                        </div>
                        <p className="confirm-modal__text">
                            Təhvil alma prosesi uğurla həyata keçirildi !
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistoryDetail;
