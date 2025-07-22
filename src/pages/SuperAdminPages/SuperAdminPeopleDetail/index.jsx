import './index.scss';
import React, {useState} from 'react';
import {NavLink, useNavigate, useParams} from 'react-router-dom';
import {FaTimes} from "react-icons/fa";
import {useDeleteCustomerBolmeMutation, useGetByIdCustomersQuery} from "../../../services/adminApi.jsx";
import {usePopup} from "../../../components/Popup/PopupContext.jsx";

const SuperAdminPeopleDetail = () => {
    const {id} = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [activeSearch, setActiveSearch] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const showPopup = usePopup()
    const navigate = useNavigate();
    const pageSize = 9;
    const {data: getByIdCustomers,refetch} = useGetByIdCustomersQuery(id);
    const customer = getByIdCustomers?.data;
    const sections = customer?.sections || [];
    const [deleteSection] = useDeleteCustomerBolmeMutation()
    const filtered = sections.filter(section => {
        const byName = section.name?.toLowerCase().includes(searchName.toLowerCase());
        const byCat = section.departmentName?.toLowerCase().includes(searchCategory.toLowerCase());
        return byName && byCat;
    });

    const totalPages = Math.ceil(filtered.length / pageSize);
    const pagedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);


    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return pages;
    };

    return (
        <div className="super-admin-people-detail-main">

            <div className="super-admin-people-detail">
                <div className={"headerr"}>
                    <div className={"head"}>
                        <h2>Sifarişçilər icazəsi olduğu bölmələr</h2>
                        <p>Burada sifarişçilərin hansı sistem bölmələrinə giriş və səlahiyyətlərinin olduğunu görə
                            bilərsiniz.</p>
                    </div>
                    <div>
                        <button onClick={() => navigate(`/superAdmin/people/${id}/bolmeAdd`)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none">
                                <path
                                    d="M12 22.5C6.21 22.5 1.5 17.79 1.5 12C1.5 6.21 6.21 1.5 12 1.5C17.79 1.5 22.5 6.21 22.5 12C22.5 17.79 17.79 22.5 12 22.5ZM12 3C7.035 3 3 7.035 3 12C3 16.965 7.035 21 12 21C16.965 21 21 16.965 21 12C21 7.035 16.965 3 12 3Z"
                                    fill="white"/>
                                <path
                                    d="M12 17.25C11.58 17.25 11.25 16.92 11.25 16.5V7.5C11.25 7.08 11.58 6.75 12 6.75C12.42 6.75 12.75 7.08 12.75 7.5V16.5C12.75 16.92 12.42 17.25 12 17.25Z"
                                    fill="white"/>
                                <path
                                    d="M16.5 12.75H7.5C7.08 12.75 6.75 12.42 6.75 12C6.75 11.58 7.08 11.25 7.5 11.25H16.5C16.92 11.25 17.25 11.58 17.25 12C17.25 12.42 16.92 12.75 16.5 12.75Z"
                                    fill="white"/>
                            </svg>
                            <span>Bölmə əlavə et</span></button>
                    </div>
                </div>
                <div className={"path"}>
                    <h2>
                        <NavLink className="link" to="/superAdmin/people">— Sifarişçilər</NavLink>{' '}
                        — {customer?.name} {customer?.surname}
                    </h2>
                </div>
                <div className="table-wrapper">
                    <div className="table-scroll">
                        <table className="order-history-detail-supplier__table">
                            <thead>
                            <tr>
                                <th>
                                    {activeSearch === 'name' ? (
                                        <div className="th-search">
                                            <input
                                                autoFocus
                                                value={searchName}
                                                onChange={(e) => setSearchName(e.target.value)}
                                                placeholder="Axtar..."
                                            />
                                            <FaTimes
                                                onClick={() => {
                                                    setActiveSearch(null);
                                                    setSearchName('');
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="th-label">
                                            Şöbə
                                            <svg
                                                onClick={() => setActiveSearch('name')}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <path d="..." fill="#7A7A7A"/>
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
                                                onChange={(e) => setSearchCategory(e.target.value)}
                                                placeholder="Axtar..."
                                            />
                                            <FaTimes
                                                onClick={() => {
                                                    setActiveSearch(null);
                                                    setSearchCategory('');
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="th-label">
                                            Bölmə
                                            <svg
                                                onClick={() => setActiveSearch('category')}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <path d="..." fill="#7A7A7A"/>
                                            </svg>
                                        </div>
                                    )}
                                </th>
                                <th>Şirkət</th>
                                <th>Fəaliyyətlər</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pagedItems.map((section, i) => {
                                const absoluteIndex = (currentPage - 1) * pageSize + i;
                                return (
                                    <tr key={section.id}>
                                        <td>{section.name}</td>
                                        <td>{section.departmentName}</td>
                                        <td>{section.companyName}</td>
                                        <td>
          <span style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
               <svg onClick={() => setDeleteIndex(i)} style={{cursor: 'pointer'}} xmlns="http://www.w3.org/2000/svg"
                    width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd"
        d="M8.59175 1.875H11.4084C11.5892 1.875 11.7467 1.875 11.8951 1.89833C12.184 1.94462 12.4581 2.05788 12.6954 2.22907C12.9327 2.40025 13.1267 2.6246 13.2617 2.88417C13.3317 3.0175 13.3809 3.16667 13.4384 3.3375L13.5309 3.61667L13.5559 3.6875C13.6313 3.89679 13.7718 4.07645 13.9566 4.20016C14.1415 4.32387 14.3612 4.38514 14.5834 4.375H17.0834C17.2492 4.375 17.4081 4.44085 17.5254 4.55806C17.6426 4.67527 17.7084 4.83424 17.7084 5C17.7084 5.16576 17.6426 5.32473 17.5254 5.44194C17.4081 5.55915 17.2492 5.625 17.0834 5.625H2.91675C2.75099 5.625 2.59202 5.55915 2.47481 5.44194C2.3576 5.32473 2.29175 5.16576 2.29175 5C2.29175 4.83424 2.3576 4.67527 2.47481 4.55806C2.59202 4.44085 2.75099 4.375 2.91675 4.375H5.49175C5.71433 4.36966 5.92935 4.29314 6.10527 4.15667C6.28119 4.02019 6.40875 3.83094 6.46925 3.61667L6.56258 3.3375C6.61925 3.16667 6.66842 3.0175 6.73758 2.88417C6.87274 2.6245 7.06682 2.40009 7.30429 2.2289C7.54176 2.05771 7.81601 1.9445 8.10508 1.89833C8.25341 1.875 8.41091 1.875 8.59092 1.875M7.50592 4.375C7.56363 4.26004 7.61239 4.1408 7.65175 4.01833L7.73508 3.76833C7.81091 3.54083 7.82841 3.495 7.84591 3.46167C7.8909 3.37501 7.95557 3.30009 8.03473 3.24293C8.11389 3.18577 8.20534 3.14795 8.30175 3.1325C8.41036 3.12288 8.51948 3.12037 8.62842 3.125H11.3701C11.6101 3.125 11.6601 3.12667 11.6967 3.13333C11.7931 3.14869 11.8845 3.18639 11.9636 3.2434C12.0428 3.30041 12.1075 3.37516 12.1526 3.46167C12.1701 3.495 12.1876 3.54083 12.2634 3.76917L12.3467 4.01917L12.3792 4.1125C12.412 4.20361 12.4498 4.29111 12.4926 4.375H7.50592Z"
        fill="#ED0303"/>
  <path
      d="M4.92907 7.04148C4.91802 6.87605 4.8417 6.72179 4.71691 6.61263C4.59212 6.50347 4.42908 6.44835 4.26365 6.4594C4.09822 6.47045 3.94396 6.54676 3.8348 6.67155C3.72563 6.79634 3.67052 6.95939 3.68157 7.12482L4.06823 12.9181C4.13907 13.9865 4.19657 14.8498 4.33157 15.5281C4.4724 16.2323 4.71073 16.8207 5.20407 17.2815C5.6974 17.7423 6.2999 17.9423 7.0124 18.0348C7.6974 18.1248 8.5624 18.1248 9.63407 18.1248H10.3666C11.4374 18.1248 12.3032 18.1248 12.9882 18.0348C13.6999 17.9423 14.3032 17.7431 14.7966 17.2815C15.2891 16.8207 15.5274 16.2315 15.6682 15.5281C15.8032 14.8506 15.8599 13.9865 15.9316 12.9181L16.3182 7.12482C16.3293 6.95939 16.2742 6.79634 16.165 6.67155C16.0558 6.54676 15.9016 6.47045 15.7361 6.4594C15.5707 6.44835 15.4077 6.50347 15.2829 6.61263C15.1581 6.72179 15.0818 6.87605 15.0707 7.04148L14.6874 12.7915C14.6124 13.914 14.5591 14.6956 14.4424 15.2831C14.3282 15.854 14.1699 16.1556 13.9424 16.369C13.7141 16.5823 13.4024 16.7206 12.8257 16.7956C12.2316 16.8731 11.4482 16.8748 10.3224 16.8748H9.6774C8.5524 16.8748 7.76907 16.8731 7.17407 16.7956C6.5974 16.7206 6.28573 16.5823 6.0574 16.369C5.8299 16.1556 5.67157 15.854 5.5574 15.284C5.44073 14.6956 5.3874 13.914 5.3124 12.7906L4.92907 7.04148Z"
      fill="#ED0303"/>
  <path
      d="M7.85428 8.54511C8.01914 8.52859 8.18382 8.57821 8.31211 8.68306C8.44041 8.78792 8.52182 8.93942 8.53844 9.10428L8.95511 13.2709C8.96731 13.4335 8.91551 13.5944 8.81076 13.7193C8.70601 13.8442 8.55659 13.9233 8.39438 13.9396C8.23217 13.9559 8.07001 13.9082 7.94249 13.8066C7.81497 13.7051 7.73218 13.5577 7.71178 13.3959L7.29511 9.22928C7.27859 9.06441 7.32821 8.89973 7.43306 8.77144C7.53792 8.64314 7.68942 8.56174 7.85428 8.54511ZM12.1459 8.54511C12.3106 8.56174 12.462 8.64303 12.5668 8.77114C12.6717 8.89925 12.7214 9.06371 12.7051 9.22844L12.2884 13.3951C12.2678 13.5565 12.185 13.7036 12.0576 13.8049C11.9302 13.9062 11.7683 13.9538 11.6064 13.9377C11.4444 13.9215 11.2952 13.8428 11.1904 13.7183C11.0856 13.5938 11.0334 13.4333 11.0451 13.2709L11.4618 9.10428C11.4784 8.93958 11.5597 8.78821 11.6878 8.68338C11.8159 8.57855 11.9812 8.52882 12.1459 8.54511Z"
      fill="#ED0303"/>
</svg>

                                        </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>

                        </table>
                    </div>
                </div>
                <div className="super-admin-people-detail__pagination">
                    <button onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}>
                        &lt;
                    </button>
                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            className={page === currentPage ? 'active' : ''}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}>
                        &gt;
                    </button>
                </div>
            </div>

            <div className="xett"></div>

            {deleteIndex !== null && (
                <div className="modal-overlay" onClick={() => setDeleteIndex(null)}>
                    <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon-wrapper">
                            <div className={"delete-icon-circle-one"}>
                                <div className="delete-icon-circle">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="44" viewBox="0 0 45 44"
                                         fill="none">
                                        <path
                                            d="M22.5008 24.566L27.8175 29.8827C28.1536 30.2188 28.5814 30.3869 29.1009 30.3869C29.6203 30.3869 30.0481 30.2188 30.3842 29.8827C30.7203 29.5466 30.8884 29.1188 30.8884 28.5994C30.8884 28.0799 30.7203 27.6522 30.3842 27.3161L25.0675 21.9994L30.3842 16.6827C30.7203 16.3466 30.8884 15.9188 30.8884 15.3994C30.8884 14.8799 30.7203 14.4521 30.3842 14.116C30.0481 13.7799 29.6203 13.6119 29.1009 13.6119C28.5814 13.6119 28.1536 13.7799 27.8175 14.116L22.5008 19.4327L17.1842 14.116C16.8481 13.7799 16.4203 13.6119 15.9008 13.6119C15.3814 13.6119 14.9536 13.7799 14.6175 14.116C14.2814 14.4521 14.1133 14.8799 14.1133 15.3994C14.1133 15.9188 14.2814 16.3466 14.6175 16.6827L19.9342 21.9994L14.6175 27.3161C14.2814 27.6522 14.1133 28.0799 14.1133 28.5994C14.1133 29.1188 14.2814 29.5466 14.6175 29.8827C14.9536 30.2188 15.3814 30.3869 15.9008 30.3869C16.4203 30.3869 16.8481 30.2188 17.1842 29.8827L22.5008 24.566ZM22.5008 40.3327C19.9647 40.3327 17.5814 39.8512 15.3508 38.8881C13.1203 37.925 11.18 36.619 9.52999 34.9702C7.87999 33.3215 6.57404 31.3812 5.61215 29.1494C4.65026 26.9176 4.16871 24.5343 4.16748 21.9994C4.16626 19.4645 4.64782 17.0811 5.61215 14.8494C6.57649 12.6176 7.88243 10.6773 9.52999 9.02852C11.1775 7.37974 13.1178 6.0738 15.3508 5.11068C17.5838 4.14757 19.9672 3.66602 22.5008 3.66602C25.0345 3.66602 27.4179 4.14757 29.6509 5.11068C31.8839 6.0738 33.8241 7.37974 35.4717 9.02852C37.1193 10.6773 38.4258 12.6176 39.3914 14.8494C40.3569 17.0811 40.8379 19.4645 40.8342 21.9994C40.8305 24.5343 40.349 26.9176 39.3895 29.1494C38.4301 31.3812 37.1241 33.3215 35.4717 34.9702C33.8193 36.619 31.879 37.9256 29.6509 38.8899C27.4227 39.8542 25.0394 40.3352 22.5008 40.3327Z"
                                            fill="#E60D0D"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="delete-message">Bölməni silməyə əminsinizmi ?</p>
                        <div className="delete-modal-actions">
                            <button className="cancel-btn" onClick={() => setDeleteIndex(null)}>Ləğv et</button>
                            <button
                                className="confirm-btn"
                                onClick={async () => {
                                    try {
                                        const sectionId = pagedItems[deleteIndex].id;
                                        await deleteSection({ customerId: id, sectionId });
                                        setDeleteIndex(null);
                                        refetch()
                                        showPopup("Bölmə icazəsi deaktiv edildi","Seçilmiş istifadəçinin bölmə icazəsini ləğv etdiniz","success")
                                    } catch  {
                                        showPopup("Sistem xətası","Əməliyyat tamamlanmadı. Təkrar cəhd edin və ya dəstəyə müraciət edin.","error")
                                    }
                                }}
                            >
                                Sil
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SuperAdminPeopleDetail;
