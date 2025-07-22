import {useEffect, useState} from 'react';
import {NavLink, useNavigate, useParams} from 'react-router-dom';
import { FaTimes} from 'react-icons/fa';
import './index.scss';
import {useDeleteOrderAdminMutation, useGetMyOrdersIdQuery} from "../../../services/adminApi.jsx";
import {usePopup} from "../../../components/Popup/PopupContext.jsx";

const OrderHistoryDetailSuperAdmin = () => {
    const {id} = useParams();
    const [searchName, setSearchName] = useState('');
    const [isOverheadModalOpen, setIsOverheadModalOpen] = useState(false);
    const [selectedOverheadImage, setSelectedOverheadImage] = useState(null);

    const [searchCategory, setSearchCategory] = useState('');
    const [activeSearch, setActiveSearch] = useState(null); // 'name' | 'category' | null
    const {data:getMyOrdersId,refetch} = useGetMyOrdersIdQuery(id)
    const orderData = getMyOrdersId?.data
    let status = '';

    if (orderData?.employeeConfirm && orderData?.fighterConfirm && orderData?.employeeDelivery) {
        status = 'Tamamlanmış';
    } else if (orderData?.employeeConfirm && orderData?.fighterConfirm) {
        status = 'Sifarişçidən təhvil gözləyən';
    } else if (orderData?.employeeConfirm && !orderData?.fighterConfirm) {
        status = 'Təchizatçıdan təsdiq gözləyən';
    }
    const itemCount = orderData?.items?.length || 0;

    const uniqueCategories = [
        ...new Set(orderData?.items?.map(item => item.product?.categoryName).filter(Boolean))
    ];
    const categoryCount = uniqueCategories.length;
    useEffect(() => {
        refetch()
    }, []);
    const [deleteOrder] =useDeleteOrderAdminMutation()
    // filtre uygula
    const showPopup = usePopup()
    const filtered = orderData?.items?.map((item) => {
        const name = item.product?.name || '—';
        const category = item.product?.categoryName || '—';
        const required = `${item.requiredQuantity} ${item.product?.measure || ''}`;
        const provided = `${item.suppliedQuantity} ${item.product?.measure || ''}`;
        const price = `${(item.suppliedQuantity * (item.price || 0)).toFixed(2)} ₼`;
        const created = orderData?.createdDate;
        const delivery = orderData?.orderLimitTime;
        const received = item.orderItemDeliveryTime === '01.01.0001' ? '—' : item.orderItemDeliveryTime;

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
        const byName = item.name.toLowerCase().includes(searchName.toLowerCase());
        const byCat = item.category.toLowerCase().includes(searchCategory.toLowerCase());
        return byName && byCat;
    }) || [];
    const navigate = useNavigate()
    return (
        <div className="order-history-detail-super-admin-main">
            <div className="order-history-detail-super-admin">
                <h2>
                    <NavLink className="link" to="/superAdmin/history">— Tarixçə</NavLink>{' '}
                    — Sifariş detalları
                </h2>
                <div key={orderData?.id} className="order-history-detail-super-admin_item">
                    <div className={"techizat"}>
                        <div className={"order-history-super-admin__ids"}>
                            <p className="order-history-super-admin__id">
                                <span>Təchizatçının adı:</span> {orderData?.fighterInfo?.name} {orderData?.fighterInfo?.surname}
                            </p>
                            <p className="order-history-super-admin__id">
                                <span>Sifarişçinin adı:</span> {orderData?.adminInfo?.name} {orderData?.adminInfo?.surname}
                            </p>
                        </div>
                    </div>
                    <div className="order-history-super-admin__details">
                        <div className={"order-history-super-admin__ids"}>
                            <p className="order-history-super-admin__id">
                                <span>Order ID</span> {orderData?.id}
                            </p>
                            <p className="order-history-super-admin__id">
                                <span>Ümumi məbləğ:</span> {
                                orderData?.items?.reduce((sum, item) =>
                                    sum + (item.suppliedQuantity * (item?.price || 0)), 0
                                ).toFixed(2)
                            } ₼
                            </p>
                        </div>
                        <span
                            className={`order-history-super-admin__status ${status === 'Tamamlanmış' ? 'completed' : status === 'Təchizatçıdan təsdiq gözləyən' ? 'pending' : 'pending'}`}>
  {status}
</span>
                    </div>
                    <div className="order-history-super-admin__data">
                        <p>{orderData?.items?.map(item => item.product?.name).join(', ')}</p>
                        <p>
                            <span className="quantity-count">{itemCount}</span>{' '}
                            <span className="quantity-label">məhsul,</span>{' '}
                            <span className="quantity-count">{categoryCount}</span>{' '}
                            <span className="quantity-label">kateqoriya</span>
                        </p>
                    </div>
                </div>
                <div className="table-wrapper">
                    <div className="table-scroll">
                        <table className="order-history-detail-super-admin__table">
                            <thead>
                            <tr>
                                <th>
                                    {activeSearch === 'name' ? (
                                        <div className="th-search">
                                            <input
                                                autoFocus
                                                value={searchName}
                                                onChange={e => setSearchName(e.target.value)}
                                                placeholder="Axtar..."
                                            />
                                            <FaTimes onClick={() => {
                                                setActiveSearch(null);
                                                setSearchName('');
                                            }}/>
                                        </div>
                                    ) : (
                                        <div className="th-label">
                                            Məhsulun adı
                                            <svg onClick={() => setActiveSearch('name')}
                                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
                                                    fill="#7A7A7A"/>
                                            </svg>
                                        </div>
                                    )}
                                </th>
                                <th>
                                    {activeSearch === 'category' ? (
                                        <div className="th-search">
                                            <input
                                                autoFocus
                                                value={searchCategory}
                                                onChange={e => setSearchCategory(e.target.value)}
                                                placeholder="Axtar..."
                                            />
                                            <FaTimes onClick={() => {
                                                setActiveSearch(null);
                                                setSearchCategory('');
                                            }}/>
                                        </div>
                                    ) : (
                                        <div className="th-label">
                                            Kateqoriyası
                                            <svg onClick={() => setActiveSearch('category')}
                                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
                                                    fill="#7A7A7A"/>
                                            </svg>
                                        </div>
                                    )}
                                </th>
                                <th>Tələb olunan miqdar</th>
                                <th>Təmin olunan miqdar</th>
                                <th>Sifarişin məbləği</th>
                                <th>Sifarişin yaradılma tarixi</th>
                                <th>Çatdırılacaq tarixi</th>
                                <th>Təhvil alınma tarixi</th>
                                {status === 'Tamamlanmış'  && (
                                    <th>
                                        İnyovsa Bax
                                    </th>
                                )}

                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>{item.required}</td>
                                    <td>{item.provided}</td>
                                    <td>{item.price}</td>
                                    <td>{item.created}</td>
                                    <td>{item.delivery}</td>
                                    <td>{item.received}</td>
                                    {status === 'Tamamlanmış' &&(
                                        <td style={{
                                            textAlign:"center"
                                        }}>
                                            <svg onClick={() => setIsOverheadModalOpen(true)} style={{cursor:"pointer"}} xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                                <path d="M13 10C13 10.663 12.7366 11.2989 12.2678 11.7678C11.7989 12.2366 11.163 12.5 10.5 12.5C9.83696 12.5 9.20107 12.2366 8.73223 11.7678C8.26339 11.2989 8 10.663 8 10C8 9.33696 8.26339 8.70107 8.73223 8.23223C9.20107 7.76339 9.83696 7.5 10.5 7.5C11.163 7.5 11.7989 7.76339 12.2678 8.23223C12.7366 8.70107 13 9.33696 13 10Z" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M2.16602 10.0003C3.49935 6.58616 6.61268 4.16699 10.4993 4.16699C14.386 4.16699 17.4993 6.58616 18.8327 10.0003C17.4993 13.4145 14.386 15.8337 10.4993 15.8337C6.61268 15.8337 3.49935 13.4145 2.16602 10.0003Z" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="table-footer sticky-footer">
                            <span>Ümumi məbləğ:</span>
                            <span>
  {
      `${orderData?.items?.reduce((sum, item) => sum + item.suppliedQuantity * (item?.price || 0), 0).toFixed(2)} ₼`
  }
</span>

                        </div>
                    </div>

                    {status === 'Təchizatçıdan təsdiq gözləyən' && (
                        <div className="order-history-detail-super-admin__delete">
                            <button className="delete-btn" onClick={() => {
                                navigate('/superAdmin/history')
                                deleteOrder(id)
                                showPopup("Sifarişinizi uğurla sildiniz","Seçilmiş sifariş sistemdən silindi","success")
                            }}>
                                Sil
                            </button>
                        </div>
                    )}

                </div>

            </div>
            {isOverheadModalOpen && (
                <div className="overhead-modal-overlay" onClick={() => setIsOverheadModalOpen(false)}>
                    <div className="overhead-modal" onClick={e => e.stopPropagation()}>
                        <h3>İnvoys Şəkilləri</h3>
                        <div className="overhead-images">
                            {orderData?.overheadNames?.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`overhead-${i}`}
                                    onClick={() => setSelectedOverheadImage(img)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {selectedOverheadImage && (
                <div className="image-preview-modal" onClick={() => setSelectedOverheadImage(null)}>
                    <div className="image-preview-content" onClick={e => e.stopPropagation()}>
                        <img src={selectedOverheadImage} alt="preview" />
                    </div>
                </div>
            )}


        </div>
    );
};

export default OrderHistoryDetailSuperAdmin;
