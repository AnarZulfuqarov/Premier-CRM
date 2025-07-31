import './index.scss';
import React, {useEffect, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {FaTimes} from "react-icons/fa";
import {
    useDeleteCategoriesMutation,
    useGetAllCategoriesQuery,
    useGetCategorieAddMyPendingQuery,
    useGetCategorieDeleteMyPendingQuery,
    useGetCategorieUpdateMyPendingQuery,
    useUpdateCategoriesMutation
} from "../../../services/adminApi.jsx";
import * as pagedItems from "react-bootstrap/ElementChildren";
import { useLocation } from 'react-router-dom';
import {usePopup} from "../../../components/Popup/PopupContext.jsx";
const SupplierCategories = () => {
    const location = useLocation();
    const { state } = location;
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [activeSearch, setActiveSearch] = useState(null);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [modalData, setModalData] = useState(null);
    const showPopup = usePopup()
    const [confirmedRows, setConfirmedRows] = useState({});
    const [activeTab, setActiveTab] = useState('products'); // Sekme kontrolü eklendi
    const [deleteIndex, setDeleteIndex] = useState(null);
    useEffect(() => {
        if (state?.type === "create" || state?.type === "delete") {
            setActiveTab("requests");
        } else if (state?.type === "update") {
            setActiveTab("edit");
        }
    }, [state]);
    const navigate = useNavigate();
    //Sorgular
    const {data: getAllCategories , refetch} = useGetAllCategoriesQuery()
    const categories = getAllCategories?.data

    const [edit] = useUpdateCategoriesMutation()
    const [deleteCategory] = useDeleteCategoriesMutation()
    useEffect(() => {
        refetch()
    },[])


    const filteredCategories = categories?.filter(category =>
        category.name.toLowerCase().includes(searchName.toLowerCase())
    ) || [];


    const {data:getCategorieAddMyPending} = useGetCategorieAddMyPendingQuery()
    const addRequests = getCategorieAddMyPending?.data
    const {data:getCategorieDeleteMyPending} = useGetCategorieDeleteMyPendingQuery()
    const deleteRequest = getCategorieDeleteMyPending?.data

    const filteredAddRequests = addRequests?.filter(item => item.isCreated === false) || [];
    const filteredDeleteRequests = deleteRequest?.filter(item => item.deleted === true) || [];

    const combinedRequests = [
        ...filteredAddRequests.map(item => ({ ...item, statusType: 'add' })),
        ...filteredDeleteRequests.map(item => ({ ...item, statusType: 'delete' })),
    ];
    const currentDataSet = activeTab === 'requests' ? combinedRequests : filteredCategories || [];
    const pagedItemsdelAdd = currentDataSet

    const {data:getCategorieUpdateMyPending} = useGetCategorieUpdateMyPendingQuery()
    const editRequest = getCategorieUpdateMyPending?.data
    return (
        <div className="supplier-category-main">

            <div className="supplier-category">
                <div className={"headerr"}>
                    <div className={"head"}>
                        <h2>Kateqoriyalar</h2>
                        <p>Buradan kateqoriyaları idarə edə və yenilərini yarada bilərsiniz.</p>
                    </div>
                    <div>
                        <button onClick={()=>navigate("/supplier/categoryAdd")}>
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
                            <span>Kateqoriya əlavə et</span></button>
                    </div>
                </div>
                <div className="tab-header">
                    <div className={`tab-item ${activeTab === 'products' ? 'active' : ''}`}
                         onClick={() => setActiveTab('products')}>
                        Kateqoriyalar
                    </div>
                    <div className={`tab-item ${activeTab === 'requests' ? 'active' : ''}`}
                         onClick={() => setActiveTab('requests')}>
                        Kateqoriya istəkləri
                    </div>
                    <div className={`tab-item ${activeTab === 'edit' ? 'active' : ''}`}
                         onClick={() => setActiveTab('edit')}>
                        Düzəliş
                    </div>
                </div>
                {activeTab === 'products' && (
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
                                                Kateqoriya adı
                                                <svg
                                                    onClick={() => setActiveSearch('name')}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                        <path d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z" fill="#7A7A7A"/>

                                                </svg>
                                            </div>
                                        )}
                                    </th>

                                    <th>Məhsul sayı</th>
                                    <th>Fəaliyyətlər</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredCategories.map((item, i) => {
                                    const absoluteIndex =  i;
                                    return (
                                        <tr key={i}>
                                            <td>{item.name}</td>
                                            <td>{item?.products?.length}</td>
                                            <td>
                  <span style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                      <div style={{
                          width:"30px",
                          display:"flex",
                          justifyContent:"end",
                          borderRight:"1px solid #ccc",
                          paddingRight:"10px"

                      }}>
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              onClick={() => {
                                  setSelectedRowIndex(absoluteIndex);
                                  setModalData({
                                      id: item.id, // <-- ID əlavə edildi
                                      name: item.name,
                                  });
                              }}
                              style={{ cursor: 'pointer' }}
                          >
    <path d="M18.3334 6.03318C18.3341 5.92351 18.313 5.81479 18.2716 5.71326C18.2301 5.61173 18.169 5.51938 18.0918 5.44152L14.5584 1.90818C14.4806 1.83095 14.3882 1.76985 14.2867 1.72838C14.1852 1.6869 14.0764 1.66588 13.9668 1.66652C13.8571 1.66588 13.7484 1.6869 13.6468 1.72838C13.5453 1.76985 13.453 1.83095 13.3751 1.90818L11.0168 4.26652L1.90843 13.3749C1.83119 13.4527 1.77009 13.5451 1.72862 13.6466C1.68715 13.7481 1.66613 13.8568 1.66676 13.9665V17.4999C1.66676 17.7209 1.75456 17.9328 1.91084 18.0891C2.06712 18.2454 2.27908 18.3332 2.5001 18.3332H6.03343C6.15003 18.3395 6.26667 18.3213 6.37578 18.2797C6.48488 18.238 6.58402 18.1739 6.66676 18.0915L15.7251 8.98318L18.0918 6.66652C18.1677 6.58565 18.2297 6.49272 18.2751 6.39152C18.2831 6.32509 18.2831 6.25794 18.2751 6.19152C18.279 6.15273 18.279 6.11364 18.2751 6.07485L18.3334 6.03318ZM5.69176 16.6665H3.33343V14.3082L11.6084 6.03318L13.9668 8.39152L5.69176 16.6665ZM15.1418 7.21652L12.7834 4.85818L13.9668 3.68318L16.3168 6.03318L15.1418 7.21652Z" fill="#919191"/>

</svg>
                      </div>


                    <svg onClick={() => setDeleteIndex(item.id)} style={{ cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.59175 1.875H11.4084C11.5892 1.875 11.7467 1.875 11.8951 1.89833C12.184 1.94462 12.4581 2.05788 12.6954 2.22907C12.9327 2.40025 13.1267 2.6246 13.2617 2.88417C13.3317 3.0175 13.3809 3.16667 13.4384 3.3375L13.5309 3.61667L13.5559 3.6875C13.6313 3.89679 13.7718 4.07645 13.9566 4.20016C14.1415 4.32387 14.3612 4.38514 14.5834 4.375H17.0834C17.2492 4.375 17.4081 4.44085 17.5254 4.55806C17.6426 4.67527 17.7084 4.83424 17.7084 5C17.7084 5.16576 17.6426 5.32473 17.5254 5.44194C17.4081 5.55915 17.2492 5.625 17.0834 5.625H2.91675C2.75099 5.625 2.59202 5.55915 2.47481 5.44194C2.3576 5.32473 2.29175 5.16576 2.29175 5C2.29175 4.83424 2.3576 4.67527 2.47481 4.55806C2.59202 4.44085 2.75099 4.375 2.91675 4.375H5.49175C5.71433 4.36966 5.92935 4.29314 6.10527 4.15667C6.28119 4.02019 6.40875 3.83094 6.46925 3.61667L6.56258 3.3375C6.61925 3.16667 6.66842 3.0175 6.73758 2.88417C6.87274 2.6245 7.06682 2.40009 7.30429 2.2289C7.54176 2.05771 7.81601 1.9445 8.10508 1.89833C8.25341 1.875 8.41091 1.875 8.59092 1.875M7.50592 4.375C7.56363 4.26004 7.61239 4.1408 7.65175 4.01833L7.73508 3.76833C7.81091 3.54083 7.82841 3.495 7.84591 3.46167C7.8909 3.37501 7.95557 3.30009 8.03473 3.24293C8.11389 3.18577 8.20534 3.14795 8.30175 3.1325C8.41036 3.12288 8.51948 3.12037 8.62842 3.125H11.3701C11.6101 3.125 11.6601 3.12667 11.6967 3.13333C11.7931 3.14869 11.8845 3.18639 11.9636 3.2434C12.0428 3.30041 12.1075 3.37516 12.1526 3.46167C12.1701 3.495 12.1876 3.54083 12.2634 3.76917L12.3467 4.01917L12.3792 4.1125C12.412 4.20361 12.4498 4.29111 12.4926 4.375H7.50592Z" fill="#ED0303"/>
  <path d="M4.92907 7.04148C4.91802 6.87605 4.8417 6.72179 4.71691 6.61263C4.59212 6.50347 4.42908 6.44835 4.26365 6.4594C4.09822 6.47045 3.94396 6.54676 3.8348 6.67155C3.72563 6.79634 3.67052 6.95939 3.68157 7.12482L4.06823 12.9181C4.13907 13.9865 4.19657 14.8498 4.33157 15.5281C4.4724 16.2323 4.71073 16.8207 5.20407 17.2815C5.6974 17.7423 6.2999 17.9423 7.0124 18.0348C7.6974 18.1248 8.5624 18.1248 9.63407 18.1248H10.3666C11.4374 18.1248 12.3032 18.1248 12.9882 18.0348C13.6999 17.9423 14.3032 17.7431 14.7966 17.2815C15.2891 16.8207 15.5274 16.2315 15.6682 15.5281C15.8032 14.8506 15.8599 13.9865 15.9316 12.9181L16.3182 7.12482C16.3293 6.95939 16.2742 6.79634 16.165 6.67155C16.0558 6.54676 15.9016 6.47045 15.7361 6.4594C15.5707 6.44835 15.4077 6.50347 15.2829 6.61263C15.1581 6.72179 15.0818 6.87605 15.0707 7.04148L14.6874 12.7915C14.6124 13.914 14.5591 14.6956 14.4424 15.2831C14.3282 15.854 14.1699 16.1556 13.9424 16.369C13.7141 16.5823 13.4024 16.7206 12.8257 16.7956C12.2316 16.8731 11.4482 16.8748 10.3224 16.8748H9.6774C8.5524 16.8748 7.76907 16.8731 7.17407 16.7956C6.5974 16.7206 6.28573 16.5823 6.0574 16.369C5.8299 16.1556 5.67157 15.854 5.5574 15.284C5.44073 14.6956 5.3874 13.914 5.3124 12.7906L4.92907 7.04148Z" fill="#ED0303"/>
  <path d="M7.85428 8.54511C8.01914 8.52859 8.18382 8.57821 8.31211 8.68306C8.44041 8.78792 8.52182 8.93942 8.53844 9.10428L8.95511 13.2709C8.96731 13.4335 8.91551 13.5944 8.81076 13.7193C8.70601 13.8442 8.55659 13.9233 8.39438 13.9396C8.23217 13.9559 8.07001 13.9082 7.94249 13.8066C7.81497 13.7051 7.73218 13.5577 7.71178 13.3959L7.29511 9.22928C7.27859 9.06441 7.32821 8.89973 7.43306 8.77144C7.53792 8.64314 7.68942 8.56174 7.85428 8.54511ZM12.1459 8.54511C12.3106 8.56174 12.462 8.64303 12.5668 8.77114C12.6717 8.89925 12.7214 9.06371 12.7051 9.22844L12.2884 13.3951C12.2678 13.5565 12.185 13.7036 12.0576 13.8049C11.9302 13.9062 11.7683 13.9538 11.6064 13.9377C11.4444 13.9215 11.2952 13.8428 11.1904 13.7183C11.0856 13.5938 11.0334 13.4333 11.0451 13.2709L11.4618 9.10428C11.4784 8.93958 11.5597 8.78821 11.6878 8.68338C11.8159 8.57855 11.9812 8.52882 12.1459 8.54511Z" fill="#ED0303"/>
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
                )}


                {activeTab === 'requests' && (
                    <>
                        <div className={"warningg"}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10.0041 14.3985V9.121M9.99992 17.9168C12.0995 17.9168 14.1132 17.0828 15.5978 15.5981C17.0825 14.1134 17.9166 12.0998 17.9166 10.0002C17.9166 7.90053 17.0825 5.8869 15.5978 4.40223C14.1132 2.91757 12.0995 2.0835 9.99992 2.0835C7.90029 2.0835 5.88665 2.91757 4.40199 4.40223C2.91733 5.8869 2.08325 7.90053 2.08325 10.0002C2.08325 12.0998 2.91733 14.1134 4.40199 15.5981C5.88665 17.0828 7.90029 17.9168 9.99992 17.9168Z" stroke="#ED0303" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.96313 6.20264H9.97183" stroke="#ED0303" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Burada olan məhsullar admindən təsdiq gözləyir.
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
                                                    Kateqoriya adı
                                                    <svg onClick={() => setActiveSearch('name')} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z" fill="#7A7A7A"/>
                                                    </svg>
                                                </div>
                                            )}
                                        </th>

                                        <th>Məhsul sayı</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {pagedItemsdelAdd?.map((item, i) => {
                                        const isConfirmed = item.statusType === 'add';
                                        const statusText = isConfirmed ? 'Təsdiq gözləyən' : 'Silinmə gözləyən';

                                        return (
                                            <tr key={i}>
                                                <td>{item.name}</td>
                                                <td>{item?.products?.length}</td>
                                                <td>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        color: isConfirmed ? '#D49100' : '#F04438'
                                                    }}>
                                                        {isConfirmed ? (
                                                            <div className={"statusss"} style={{
                                                                backgroundColor:"#FAC22833"
                                                            }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                                                    <path d="M13.25 9C11.18 9 9.5 10.68 9.5 12.75C9.5 14.82 11.18 16.5 13.25 16.5C15.32 16.5 17 14.82 17 12.75C17 10.68 15.32 9 13.25 9ZM14.4875 14.5125L12.875 12.9V10.5H13.625V12.5925L15.0125 13.98L14.4875 14.5125ZM14 2.25H11.615C11.3 1.38 10.475 0.75 9.5 0.75C8.525 0.75 7.7 1.38 7.385 2.25H5C4.175 2.25 3.5 2.925 3.5 3.75V15C3.5 15.825 4.175 16.5 5 16.5H9.5825C9.13822 16.0698 8.77717 15.5613 8.5175 15H5V3.75H6.5V6H12.5V3.75H14V7.56C14.5325 7.635 15.035 7.7925 15.5 8.01V3.75C15.5 2.925 14.825 2.25 14 2.25ZM9.5 3.75C9.0875 3.75 8.75 3.4125 8.75 3C8.75 2.5875 9.0875 2.25 9.5 2.25C9.9125 2.25 10.25 2.5875 10.25 3C10.25 3.4125 9.9125 3.75 9.5 3.75Z" fill="#FAC228"/>
                                                                </svg>
                                                            </div>
                                                        ) : (
                                                            <div style={{
                                                                backgroundColor:"#FFCECE78"
                                                            }} className={"statusss"}><svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                                                <path d="M5.56836 12.9324L9.50061 9.00012M9.50061 9.00012L13.4329 5.06787M9.50061 9.00012L5.56836 5.06787M9.50061 9.00012L13.4329 12.9324" stroke="#ED0303" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                            </svg></div>
                                                        )}
                                                        <span style={{
                                                            color:"#6c6c6c"
                                                        }}>{statusText}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div></>
                )}


                {activeTab === 'edit' && (
                    <>
                        <div className={"warningg"}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10.0041 14.3985V9.121M9.99992 17.9168C12.0995 17.9168 14.1132 17.0828 15.5978 15.5981C17.0825 14.1134 17.9166 12.0998 17.9166 10.0002C17.9166 7.90053 17.0825 5.8869 15.5978 4.40223C14.1132 2.91757 12.0995 2.0835 9.99992 2.0835C7.90029 2.0835 5.88665 2.91757 4.40199 4.40223C2.91733 5.8869 2.08325 7.90053 2.08325 10.0002C2.08325 12.0998 2.91733 14.1134 4.40199 15.5981C5.88665 17.0828 7.90029 17.9168 9.99992 17.9168Z" stroke="#ED0303" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.96313 6.20264H9.97183" stroke="#ED0303" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Burada olan məhsullar admindən təsdiq gözləyir.
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
                                                    Kateqoriya adı
                                                    <svg onClick={() => setActiveSearch('name')} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z" fill="#7A7A7A"/>
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
                                                    Yeni kateqoriya adı
                                                    <svg onClick={() => setActiveSearch('category')} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="..." fill="#7A7A7A" />
                                                    </svg>
                                                </div>
                                            )}
                                        </th>

                                    </tr>
                                    </thead>
                                    <tbody>
                                    {editRequest.map((item, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{item.oldName}</td>
                                                <td>{item.newName}</td>

                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}



            </div>

            {modalData && (
                <div className="modal-overlay" onClick={() => setModalData(null)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3>Dəyişiklik et</h3>
                        <div className={"closeBtn"} onClick={() => setModalData(null)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M12.6668 3.33301L3.3335 12.6663M3.3335 3.33301L12.6668 12.6663" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div className="modal-fields">
                            <label>Kateqoriya adı</label>
                            <input
                                value={modalData.name}
                                onChange={(e) =>
                                    setModalData({ ...modalData, name: e.target.value })
                                }
                                placeholder="Kateqoriya adı"
                            />
                        </div>
                        <button
                            onClick={async () => {
                                try {
                                    await edit({
                                        id: modalData.id,
                                        newName: modalData.name
                                    });
                                    setModalData(null);
                                    refetch(); // Backend'dən son data al
                                    showPopup("Kateqoriya düzəliş tələbi göndərildi","Seçilmiş kateqoriya üzrə redaktə tələbiniz uğurla göndərildi və baxılmaq üçün sistemə daxil edildi.","success")
                                } catch (error) {
                                    showPopup("Sistem xətası", "Əməliyyat tamamlanmadı. Təkrar cəhd edin və ya dəstəyə müraciət edin.", "error");

                                }
                            }}
                        >
                            Yadda saxla
                        </button>
                    </div>
                </div>
            )}
            {deleteIndex !== null && (
                <div className="modal-overlay" onClick={() => setDeleteIndex(null)}>
                    <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon-wrapper">
                           <div className={"delete-icon-circle-one"}>
                               <div className="delete-icon-circle">
                                   <svg xmlns="http://www.w3.org/2000/svg" width="45" height="44" viewBox="0 0 45 44" fill="none">
                                       <path d="M22.5008 24.566L27.8175 29.8827C28.1536 30.2188 28.5814 30.3869 29.1009 30.3869C29.6203 30.3869 30.0481 30.2188 30.3842 29.8827C30.7203 29.5466 30.8884 29.1188 30.8884 28.5994C30.8884 28.0799 30.7203 27.6522 30.3842 27.3161L25.0675 21.9994L30.3842 16.6827C30.7203 16.3466 30.8884 15.9188 30.8884 15.3994C30.8884 14.8799 30.7203 14.4521 30.3842 14.116C30.0481 13.7799 29.6203 13.6119 29.1009 13.6119C28.5814 13.6119 28.1536 13.7799 27.8175 14.116L22.5008 19.4327L17.1842 14.116C16.8481 13.7799 16.4203 13.6119 15.9008 13.6119C15.3814 13.6119 14.9536 13.7799 14.6175 14.116C14.2814 14.4521 14.1133 14.8799 14.1133 15.3994C14.1133 15.9188 14.2814 16.3466 14.6175 16.6827L19.9342 21.9994L14.6175 27.3161C14.2814 27.6522 14.1133 28.0799 14.1133 28.5994C14.1133 29.1188 14.2814 29.5466 14.6175 29.8827C14.9536 30.2188 15.3814 30.3869 15.9008 30.3869C16.4203 30.3869 16.8481 30.2188 17.1842 29.8827L22.5008 24.566ZM22.5008 40.3327C19.9647 40.3327 17.5814 39.8512 15.3508 38.8881C13.1203 37.925 11.18 36.619 9.52999 34.9702C7.87999 33.3215 6.57404 31.3812 5.61215 29.1494C4.65026 26.9176 4.16871 24.5343 4.16748 21.9994C4.16626 19.4645 4.64782 17.0811 5.61215 14.8494C6.57649 12.6176 7.88243 10.6773 9.52999 9.02852C11.1775 7.37974 13.1178 6.0738 15.3508 5.11068C17.5838 4.14757 19.9672 3.66602 22.5008 3.66602C25.0345 3.66602 27.4179 4.14757 29.6509 5.11068C31.8839 6.0738 33.8241 7.37974 35.4717 9.02852C37.1193 10.6773 38.4258 12.6176 39.3914 14.8494C40.3569 17.0811 40.8379 19.4645 40.8342 21.9994C40.8305 24.5343 40.349 26.9176 39.3895 29.1494C38.4301 31.3812 37.1241 33.3215 35.4717 34.9702C33.8193 36.619 31.879 37.9256 29.6509 38.8899C27.4227 39.8542 25.0394 40.3352 22.5008 40.3327Z" fill="#E60D0D"/>
                                   </svg>
                               </div>
                           </div>
                        </div>
                        <p className="delete-message">Məhsulun silinməsi üçün administratora bildiriş göndəriləcək.</p>
                        <p className="delete-sub">Silinmə yalnız təsdiqdən sonra həyata keçiriləcək.</p>
                        <div className="delete-modal-actions">
                            <button className="cancel-btn" onClick={() => setDeleteIndex(null)}>Ləğv et</button>
                            <button
                                className="confirm-btn"
                                onClick={async () => {
                                    try {
                                        await deleteCategory(deleteIndex);
                                        setDeleteIndex(null);
                                        refetch();
                                        showPopup("Kateqoriyanın silinmə tələbi göndərildi","Seçilmiş kateqoriya üzrə silinmə tələbiniz uğurla göndərildi və baxılmaq üçün sistemə daxil edildi.",'success')
                                    } catch (error) {
                                        showPopup("Sistem xətası", "Əməliyyat tamamlanmadı. Təkrar cəhd edin və ya dəstəyə müraciət edin.", "error");
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

export default SupplierCategories;
