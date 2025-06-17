// OrderHistoryDetail.jsx
import {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {FaCheckCircle, FaSearch, FaTimes} from 'react-icons/fa';
import './index.scss';

const OrderHistoryDetail = () => {
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [activeSearch, setActiveSearch] = useState(null); // 'name' | 'category' | null
    const [showModal, setShowModal] = useState(false);
    const order = {
        id: 'NP764543702735',
        status: 'Təsdiq gözləyən',
        items: Array.from({length: 20}).map(() => ({
            name: 'Sabun',
            category: 'Təmizlik',
            required: '15 ədəd',
            provided: '15 ədəd',
            price: '325 ₼',
            created: '16/05/25, 13:45',
            delivery: '16/05/25, 13:45',
            received: '16/05/25, 13:45',
        })),
    };

    // filtre uygula
    const filtered = order.items.filter(item => {
        const byName = item.name.toLowerCase().includes(searchName.toLowerCase());
        const byCat = item.category.toLowerCase().includes(searchCategory.toLowerCase());
        return byName && byCat;
    });

    return (
        <div className="order-history-detail-main">
            <div className="order-history-detail">
                <h2>
                    <NavLink className="link" to="/admin/history">— Tarixçə</NavLink>{' '}
                    — Sifariş detalları
                </h2>

                <div className="table-wrapper">
                    <div className="table-scroll">
                        <table className="order-history-detail__table">
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
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="table-footer">
                        <span>Ümumi məbləğ:</span>
                        <span>2450 ₼</span>
                    </div>
                </div>

                <div className="order-history-detail__actions">
          <span>
            Sifariş tələblərinə görə qəbul edilib. Davam etmək üçün siz də təsdiq etmalısınız.
          </span>
                    <button
                        className="order-history-detail__confirm"
                        onClick={() => setShowModal(true)}
                    >
                        Təsdiq et
                    </button>
                </div>
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
                                           <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">
                                               <path d="M11.7714 19.3539L22.1402 8.9852C22.3849 8.74051 22.6704 8.61816 22.9966 8.61816C23.3229 8.61816 23.6083 8.74051 23.853 8.9852C24.0977 9.22989 24.2201 9.52066 24.2201 9.85752C24.2201 10.1944 24.0977 10.4847 23.853 10.7286L12.6279 21.9844C12.3832 22.2291 12.0977 22.3514 11.7714 22.3514C11.4452 22.3514 11.1597 22.2291 10.915 21.9844L5.65419 16.7235C5.4095 16.4788 5.29205 16.1885 5.30183 15.8524C5.31162 15.5164 5.43927 15.2256 5.68477 14.9801C5.93028 14.7346 6.22105 14.6123 6.5571 14.6131C6.89314 14.6139 7.1835 14.7362 7.42819 14.9801L11.7714 19.3539Z" fill="white"/>
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
