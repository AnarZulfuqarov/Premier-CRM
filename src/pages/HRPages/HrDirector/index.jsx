import './index.scss';
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {useDeleteFighterMutation, useEditFighterMutation, useGetAllFightersQuery} from "../../../services/adminApi.jsx";
import {usePopup} from "../../../components/Popup/PopupContext.jsx";

const HrDirector = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchColumn, setSearchColumn] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const pageSize = 8;
    const [deleteIndex, setDeleteIndex] = useState(null);
    const showPopup = usePopup()
    const [editingUser, setEditingUser] = useState(null);
    const {data:getAllFighters,refetch} = useGetAllFightersQuery()
    const supliers = getAllFighters?.data
    const [editFighter] = useEditFighterMutation();
    const [deleteFighter] = useDeleteFighterMutation();
    useEffect(() => {
        refetch();
    },[])
    const users = supliers?.map((s) => ({
        id: s.id,
        name: s.name,
        surname: s.surname,
        fin: s.finCode,
        phone: s.phoneNumber,
        password: s.password ?? '********'
    })) || [];
    const columnKeyMap = {
        'Ad': 'name',
        'Soyad': 'surname',
        'fin': 'fin',
        'Mobil nömrə': 'phone'
    };

    // Filter users based on search term and column
    const filteredUsers = users.filter(user => {
        if (!searchTerm || !searchColumn) return true;
        const key = columnKeyMap[searchColumn]; // düzgün açarı al
        const value = user[key]?.toString().toLowerCase();
        return value?.includes(searchTerm.toLowerCase());
    });


    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const pagedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return pages;
    };

    const handleSearchClick = (column) => {
        setSearchColumn(searchColumn === column ? null : column);
        setSearchTerm('');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCloseSearch = () => {
        setSearchColumn(null);
        setSearchTerm('');
    };

    const handleEdit = (id) => {
        const selectedUser = users.find(u => u.id === id);
        setEditingUser(selectedUser);
    };

    const handleDelete = (id) => {
        if (window.confirm("Silmək istədiyinizə əminsiniz?")) {
            alert(`Sifariş ${id} silindi!`);
        }
    };

    const handleSave = async (updatedUser) => {
        const isPasswordChanged = updatedUser.password !== '********';

        try {
            await editFighter({
                id: updatedUser.id,
                name: updatedUser.name,
                surname: updatedUser.surname,
                finCode: updatedUser.fin,
                password: isPasswordChanged ? updatedUser.password : null
            }).unwrap();

            showPopup("Təchizatçıya düzəliş etdiniz","Dəyişikliklər uğurla yadda saxlanıldı","success")
            setEditingUser(null);
            refetch();
        } catch  {
            showPopup("Sistem xətası","Əməliyyat tamamlanmadı. Təkrar cəhd edin və ya dəstəyə müraciət edin.","error")
        }
    };




    return (
        <div className="hr-director-main">
            <div className="hr-director">
                <div className={"headerr"}>
                    <div className={"head"}>
                        <h2>Direktor</h2>
                        <p>Burada işçilərin ümumi əmək haqqı məlumatlarına baxa və hesabatları izləyə bilərsiniz.</p>
                    </div>
                    <div>
                        <button onClick={()=>navigate("/hr/directorAdd")}>
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
                            <span>Direktor əlavə et</span></button>
                    </div>
                </div>
                <div className="order-table-wrapper">
                    <div className="scrollable-part">
                        <table>
                            <thead>
                            <tr>
                                {['Şirkət','Ad', 'Soyad', 'Mobil nömrə']. map((column) => (
                                    <th key={column}>
                                        {column.charAt(0).toUpperCase() + column.slice(1)}
                                        <span
                                            className="search-icon"
                                            onClick={() => handleSearchClick(column)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <path
                                                    d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
                                                    fill="#7A7A7A"
                                                />
                                            </svg>
                                        </span>
                                        {searchColumn === column && (
                                            <div className="search-input-wrapper">
                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={handleSearchChange}
                                                    placeholder={`Search ${column}`}
                                                    autoFocus
                                                />
                                                <span
                                                    className="close-search"
                                                    onClick={handleCloseSearch}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 16 16"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5"
                                                            stroke="#7A7A7A"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                            </div>
                                        )}
                                    </th>
                                ))}
                                <th>Şifrə</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pagedUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.surname}</td>
                                    <td>{user.fin}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.password}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="fixed-column">
                        <div className="header">Fəaliyyətlər</div>
                        {pagedUsers.map((user) => (
                            <div key={user.id} className="cell">

                                <span
                                    className="action-icon edit"
                                    onClick={() => handleEdit(user.id)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width ="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                    >
                                        <path
                                            d="M18.3333 6.03367C18.334 5.924 18.313 5.81528 18.2715 5.71375C18.23 5.61222 18.1689 5.51987 18.0917 5.44201L14.5583 1.90867C14.4805 1.83144 14.3881 1.77033 14.2866 1.72886C14.1851 1.68739 14.0763 1.66637 13.9667 1.66701C13.857 1.66637 13.7483 1.68739 13.6467 1.72886C13.5452 1.77033 13.4529 1.83144 13.375 1.90867L11.0167 4.26701L1.90834 13.3753C1.8311 13.4532 1.77 13.5456 1.72853 13.6471C1.68706 13.7486 1.66604 13.8573 1.66667 13.967V17.5003C1.66667 17.7214 1.75447 17.9333 1.91075 18.0896C2.06703 18.2459 2.27899 18.3337 2.5 18.3337H6.03334C6.14994 18.34 6.26658 18.3218 6.37569 18.2801C6.48479 18.2385 6.58393 18.1744 6.66667 18.092L15.725 8.98367L18.0917 6.66701C18.1676 6.58614 18.2296 6.49321 18.275 6.39201C18.283 6.32558 18.283 6.25843 18.275 6.19201C18.2789 6.15321 18.2789 6.11413 18.275 6.07534L18.3333 6.03367ZM5.69167 16.667H3.33334V14.3087L11.6083 6.03367L13.9667 8.39201L5.69167 16.667ZM15.1417 7.21701L12.7833 4.85867L13.9667 3.68367L16.3167 6.03367L15.1417 7.21701Z"
                                            fill="#606060"
                                        />
                                    </svg>
                                </span>
                                <span
                                    className="action-icon delete"
                                    onClick={() => setDeleteIndex(pagedUsers.findIndex(u => u.id === user.id))}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M8.59166 1.875H11.4083C11.5892 1.875 11.7467 1.875 11.895 1.89833C12.1839 1.94462 12.458 2.05788 12.6953 2.22907C12.9326 2.40025 13.1266 2.6246 13.2617 2.88417C13.3317 3.0175 13.3808 3.16667 13.4383 3.3375L13.5308 3.61667L13.5558 3.6875C13.6312 3.89679 13.7717 4.07645 13.9566 4.20016C14.1415 4.32387 14.3611 4.38514 14.5833 4.375H17.0833C17.2491 4.375 17.4081 4.44085 17.5253 4.55806C17.6425 4.67527 17.7083 4.83424 17.7083 5C17.7083 5.16576 17.6425 5.32473 17.5253 5.44194C17.4081 5.55915 17.2491 5.625 17.0833 5.625H2.91666C2.7509 5.625 2.59193 5.55915 2.47472 5.44194C2.35751 5.32473 2.29166 5.16576 2.29166 5C2.29166 4.83424 2.35751 4.67527 2.47472 4.55806C2.59193 4.44085 2.7509 4.375 2.91666 4.375H5.49166C5.71425 4.36966 5.92927 4.29314 6.10519 4.15667C6.28111 4.02019 6.40867 3.83094 6.46916 3.61667L6.5625 3.3375C6.61916 3.16667 6.66833 3.0175 6.7375 2.88417C6.87266 2.6245 7.06674 2.40009 7.30421 2.2289C7.54167 2.05771 7.81592 1.9445 8.105 1.89833C8.25333 1.875 8.41083 1.875 8.59083 1.875M7.50583 4.375C7.56355 4.26004 7.6123 4.1408 7.65166 4.01833L7.735 3.76833C7.81083 3.54083 7.82833 3.495 7.84583 3.46167C7.89082 3.37501 7.95548 3.30009 8.03464 3.24293C8.1138 3.18577 8.20525 3.14795 8.30166 3.1325C8.41027 3.12288 8.5194 3.12037 8.62833 3.125H11.37C11.61 3.125 11.66 3.12667 11.6967 3.13333C11.793 3.14869 11.8844 3.18639 11.9635 3.2434C12.0427 3.30041 12.1074 3.37516 12.1525 3.46167C12.17 3.495 12.1875 3.54083 12.2633 3.76917L12.3467 4.01917L12.3792 4.1125C12.4119 4.20361 12.4497 4.29111 12.4925 4.375H7.50583Z"
                                            fill="#ED0303"
                                        />
                                        <path
                                            d="M4.92917 7.04148C4.91812 6.87605 4.8418 6.72179 4.71701 6.61263C4.59222 6.50347 4.42918 6.44835 4.26375 6.4594C4.09832 6.47045 3.94406 6.54676 3.8349 6.67155C3.72573 6.79634 3.67062 6.95939 3.68167 7.12482L4.06833 12.9181C4.13917 13.9865 4.19667 14.8498 4.33167 15.5281C4.4725 16.2323 4.71083 16.8207 5.20417 17.2815C5.6975 17.7423 6.3 17.9423 7.0125 18.0348C7.6975 18.1248 8.5625 18.1248 9.63417 18.1248H10.3667C11.4375 18.1248 12.3033 18.1248 12.9883 18.0348C13.7 17.9423 14.3033 17.7431 14.7967 17.2815C15.2892 16.8207 15.5275 16.2315 15.6683 15.5281C15.8033 14.8506 15.86 13.9865 15.9317 12.9181L16.3183 7.12482C16.3294 6.95939 16.2743 6.79634 16.1651 6.67155C16.0559 6.54676 15.9017 6.47045 15.7362 6.4594C15.5708 6.44835 15.4078 6.50347 15.283 6.61263C15.1582 6.72179 15.0819 6.87605 15.0708 7.04148L14.6875 12.7915C14.6125 13.914 14.5592 14.6956 14.4425 15.2831C14.3283 15.854 14.17 16.1556 13.9425 16.369C13.7142 16.5823 13.4025 16.7206 12.8258 16.7956C12.2317 16.8731 11.4483 16.8748 10.3225 16.8748H9.6775C8.5525 16.8748 7.76917 16.8731 7.17417 16.7956C6.5975 16.7206 6.28583 16.5823 6.0575 16.369C5.83 16.1556 5.67167 15.854 5.5575 15.284C5.44083 14.6956 5.3875 13.914 5.3125 12.7906L4.92917 7.04148Z"
                                            fill="#ED0303"
                                        />
                                        <path
                                            d="M7.85417 8.54511C8.01903 8.52859 8.18371 8.57821 8.31201 8.68306C8.4403 8.78792 8.52171 8.93942 8.53834 9.10428L8.955 13.2709C8.96721 13.4335 8.91541 13.5944 8.81065 13.7193C8.7059 13.8442 8.55648 13.9233 8.39428 13.9396C8.23207 13.9559 8.06991 13.9082 7.94238 13.8066C7.81486 13.7051 7.73207 13.5577 7.71167 13.3959L7.295 9.22928C7.27848 9.06441 7.3281 8.89973 7.43295 8.77144C7.53781 8.64314 7.68931 8.56174 7.85417 8.54511ZM12.1458 8.54511C12.3105 8.56174 12.4619 8.64303 12.5667 8.77114C12.6716 8.89925 12.7213 9.06371 12.705 9.22844L12.2883 13.3951C12.2677 13.5565 12.1848 13.7036 12.0575 13.8049C11.9301 13.9062 11.7682 13.9538 11.6063 13.9377C11.4443 13.9215 11.2951 13.8428 11.1903 13.7183C11.0854 13.5938 11.0333 13.4333 11.045 13.2709L11.4617 9.10428C11.4783 8.93958 11.5596 8.78821 11.6877 8.68338C11.8158 8.57855 11.9811 8.52882 12.1458 8.54511Z"
                                            fill="#ED0303"
                                        />
                                    </svg>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hr-director__pagination">
                    <button
                        onClick={() => setCurrentPage((p) => p - 1)}
                        disabled={currentPage === 1}
                    >
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
                    <button
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </div>
            </div>
            <div className="xett"></div>
            {editingUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setEditingUser(null)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M15.8333 4.16699L4.16663 15.8337M4.16663 4.16699L15.8333 15.8337" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <h3>Burada istifadəçi məlumatlarını gözdən keçira və lazım olduqda dəyişiklik edə bilərsiniz</h3>
                        <div className="form">
                            <div className="form-row">
                                <div>
                                    <label>Ad</label>
                                    <input
                                        type="text"
                                        value={editingUser.name}
                                        onChange={(e) =>
                                            setEditingUser({ ...editingUser, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label>Soyad</label>
                                    <input
                                        type="text"
                                        value={editingUser.surname}
                                        onChange={(e) =>
                                            setEditingUser({ ...editingUser, surname: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <label>FIN</label>
                            <input
                                type="text"
                                value={editingUser.fin}
                                onChange={(e) =>
                                    setEditingUser({ ...editingUser, fin: e.target.value })
                                }
                            />

                            <label>Parol</label>
                            <input
                                type="password"
                                value={editingUser.password}
                                placeholder="Parolu dəyişmək üçün daxil et"
                                onChange={(e) =>
                                    setEditingUser({ ...editingUser, password: e.target.value })
                                }
                            />


                            <button className="save-btn" onClick={() => handleSave(editingUser)}>
                                Yadda saxla
                            </button>
                        </div>

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
                        <p className="delete-message">Direktoru silmək istədiyinizə əminsiz?</p>
                        <div className="delete-modal-actions">
                            <button className="cancel-btn" onClick={() => setDeleteIndex(null)}>Ləğv et</button>
                            <button
                                className="confirm-btn"
                                onClick={async () => {
                                    try {
                                        const phoneNumber = pagedUsers[deleteIndex]?.phone;
                                        if (!phoneNumber) {
                                            alert("İstifadəçi ID-si tapılmadı.");
                                            return;
                                        }

                                        await deleteFighter(phoneNumber).unwrap();
                                        showPopup("Təchizatçını sildiniz","Seçilmiş təchizatçı sistemdən uğurla silindi","success")
                                        setDeleteIndex(null);
                                        refetch();
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

export default HrDirector;