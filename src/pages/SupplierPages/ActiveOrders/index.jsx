import './index.scss';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useGetOrderCompanyByPageQuery, useGetOrdersQuery} from "../../../services/adminApi.jsx";
import Cookies from "js-cookie";

const ActiveOrders = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
    const id = Cookies.get("companyId");
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 576);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const {data: getOrders, refetch} = useGetOrderCompanyByPageQuery(id)
    const orderss = getOrders?.data
    const orders = orderss
        ?.filter(order => {
            const {employeeConfirm, fighterConfirm, employeeDelivery} = order;
            const bothConfirmed = employeeConfirm && fighterConfirm;
            const allTrue = employeeConfirm && fighterConfirm && employeeDelivery;
            return !(bothConfirmed || allTrue); // true olanları çıxarırıq
        })
        .map(order => {
            const amount = order.items.reduce((sum, item) => {
                return sum + item.price;
            }, 0);

            return {
                id: order.id,
                company: order.section?.companyName || '—',
                person: `${order.adminInfo?.name || ''} ${order.adminInfo?.surname || ''}`,
                amount: `${order.section?.companyName || ''}`,
                orderDate: order.createdDate,
                deliveryDate: order.orderLimitTime,
            };
        }) || [];


    const [searchCompany, setSearchCompany] = useState('');
    const [searchPerson, setSearchPerson] = useState('');
    const [isCompanySearchOpen, setIsCompanySearchOpen] = useState(false);
    const [isPersonSearchOpen, setIsPersonSearchOpen] = useState(false);
    const filteredOrders = orders.filter(order => {
        const companyMatch = order.company.toLowerCase().includes(searchCompany.toLowerCase());
        const personMatch = order.person.toLowerCase().includes(searchPerson.toLowerCase());
        return companyMatch && personMatch;
    });


    return (
        <div className="active-order-main">
            <div className="active-order">
                <h2>Aktiv sifarişlər</h2>
                <p>Aşağıdan məhsulları seçərək yeni sifarişinizi tamamlaya bilərsiniz</p>

                <div className="order-table-wrapper">
                    <div className="scrollable-part">
                        <table>
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>
                                    Sifarişi verən şirkət
                                    <span
                                        className="search-icon"
                                        onClick={() => setIsCompanySearchOpen(prev => !prev)}
                                    >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path
      d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
      fill="#7A7A7A"/>
</svg>
      </span>
                                    {isCompanySearchOpen && (
                                        <div className="search-input-box">
                                            <input
                                                type="text"
                                                placeholder="Şirkət axtar..."
                                                value={searchCompany}
                                                onChange={(e) => setSearchCompany(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </th>
                                <th>
                                    Sifarişi verən şəxs
                                    <span
                                        className="search-icon"
                                        onClick={() => setIsPersonSearchOpen(prev => !prev)}
                                    >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path
      d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
      fill="#7A7A7A"/>
</svg>
      </span>
                                    {isPersonSearchOpen && (
                                        <div className="search-input-box">
                                            <input
                                                type="text"
                                                placeholder="Şəxs axtar..."
                                                value={searchPerson}
                                                onChange={(e) => setSearchPerson(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </th>
                                <th>Sifariş tarixi</th>
                                <th>Çatdırılacaq tarix</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredOrders?.length > 0 ? (filteredOrders.map((order, idx) => (
                                <tr key={order.id}>
                                    <td>{idx + 1}</td>
                                    <td>{order.amount}</td>
                                    <td>{order.person}</td>
                                    <td>{order.orderDate}</td>
                                    <td>{order.deliveryDate}</td>
                                </tr>
                            ))) : (<tr>
                                <td colSpan="5">Heç bir sifariş tapılmadı</td>
                            </tr>)}
                            </tbody>
                        </table>
                    </div>

                    <div className="fixed-column">
                        <div className="header">Sifariş detalları</div>
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="cell">
                                <button onClick={() => navigate(`/supplier/activeOrder/${order.id}`)}>
                                    {isMobile ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                     viewBox="0 0 20 20" fill="none">
                                        <path
                                            d="M12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 10 12.5C9.33696 12.5 8.70107 12.2366 8.23223 11.7678C7.76339 11.2989 7.5 10.663 7.5 10C7.5 9.33696 7.76339 8.70107 8.23223 8.23223C8.70107 7.76339 9.33696 7.5 10 7.5C10.663 7.5 11.2989 7.76339 11.7678 8.23223C12.2366 8.70107 12.5 9.33696 12.5 10Z"
                                            stroke="#606060" stroke-width="1.5" stroke-linecap="round"
                                            stroke-linejoin="round"/>
                                        <path
                                            d="M1.66675 10.0013C3.00008 6.58714 6.11341 4.16797 10.0001 4.16797C13.8867 4.16797 17.0001 6.58714 18.3334 10.0013C17.0001 13.4155 13.8867 15.8346 10.0001 15.8346C6.11341 15.8346 3.00008 13.4155 1.66675 10.0013Z"
                                            stroke="#606060" stroke-width="1.5" stroke-linecap="round"
                                            stroke-linejoin="round"/>
                                    </svg> : 'Ətraflı bax'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ActiveOrders;
