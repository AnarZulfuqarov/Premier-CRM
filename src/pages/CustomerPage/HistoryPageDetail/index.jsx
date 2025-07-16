// OrderHistoryDetail.jsx
import {useEffect, useState} from 'react';
import {NavLink, useNavigate, useParams} from 'react-router-dom';
import {FaTimes} from 'react-icons/fa';
import './index.scss';
import {useDeleteOrderMutation, useGetMyOrdersIdQuery, useOrderConfirmMutation} from "../../../services/adminApi.jsx";

const OrderHistoryDetail = () => {
    const {id} = useParams();
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    const {data: getMyOrdersId,refetch} = useGetMyOrdersIdQuery(id)
    const orderData = getMyOrdersId?.data
    let status = '';

    if (orderData?.employeeConfirm && orderData?.fighterConfirm && orderData?.employeeDelivery) {
        status = 'Tamamlanmış';
    } else if (orderData?.employeeConfirm && orderData?.fighterConfirm) {
        status = 'Təhvil alınmayan';
    } else if (orderData?.employeeConfirm && !orderData?.fighterConfirm) {
        status = 'Təchizatçıdan təsdiq gözləyən';
    }
    const vendorName = orderData?.fighterInfo
        ? `${orderData.fighterInfo.name} ${orderData.fighterInfo.surname}`
        : null;

    const totalPrice = orderData?.items?.reduce((sum, item) => sum + (item.price || 0), 0);
    const itemCount = orderData?.items?.length || 0;

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
        const priceTotal = item.price ;
        const price = `${priceTotal} ₼`;
        const created = orderData?.createdDate;
        const delivery = orderData?.orderLimitTime;
        const received = item.orderDeliveryTime === '01.01.0001' ? '—' : item.orderItemDeliveryTime;
        return {
            name,
            category,
            required,
            provided,
            price,
            created,
            delivery,
            received
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
            navigate('/customer/history');
        }
    }, [isSuccess, navigate]);

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
                            <div style={{
                                display: 'flex',
                                gap: '40px',
                            }}>
                                <p className="order-history-detail__id">
                                    <span>Order ID</span> {orderData?.id}
                                </p>
                                {['Tamamlanmış', 'Təhvil alınmayan'].includes(status) && (

                                        <p className={"order-history-detail__id"}>
                                            <span>Ümumi məbləğ:</span> {totalPrice} ₼
                                        </p>

                                )}
                            </div>
                            <span
                                className={`order-history-detail__status ${status === 'Tamamlanmış' ? 'completed' : status === 'Təchizatçıdan təsdiq gözləyən' ? 'pending' : 'not-completed'}`}>
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
                                <th>Ad</th>
                                <th>Kateqoriya</th>
                                <th>Tələb olunan miqdar</th>
                                {status !== 'Təchizatçıdan təsdiq gözləyən' && <th>Təmin olunan miqdar</th>}
                                {status !== 'Təchizatçıdan təsdiq gözləyən' && <th>Sifarişin məbləği</th>}
                                <th>Sifarişin yaradılma tarixi</th>
                                {status !== 'Tamamlanmış' && <th>Çatdırılacaq tarixi</th>}
                                {status === 'Tamamlanmış' && <th>Təhvil alınma tarixi</th>}
                            </tr>
                            </thead>

                            <tbody>
                            {filtered.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>{item.required}</td>
                                    {status !== 'Təchizatçıdan təsdiq gözləyən' && <td>{item.provided}</td>}
                                    {status !== 'Təchizatçıdan təsdiq gözləyən' && <td>{item.price}</td>}
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
                                onClick={() => deleteOrder(id)}
                            >
                                Sil
                            </button>

                        </div>
                    )}

                    {status === 'Təhvil alınmayan' && (
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
