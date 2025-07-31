import './index.scss';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    useDeleteCustomerMutation,
    useEditCustomerMutation,
    useGetAllCustomersQuery, useGetAllJobsQuery
} from "../../../services/adminApi.jsx";
import {IoSearchSharp} from "react-icons/io5";
import {MdOutlineRemoveRedEye} from "react-icons/md";
import {LuPencil} from "react-icons/lu";
import {GoPlusCircle, GoTrash} from "react-icons/go";
import {usePopup} from "../../../components/Popup/PopupContext.jsx";

const HrPeople = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchColumn, setSearchColumn] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const pageSize = 8;
    const [deleteIndex, setDeleteIndex] = useState(null);
    const showPopup = usePopup()
    const [editingUser, setEditingUser] = useState(null);

    const {data: getAllCustomers, refetch} = useGetAllCustomersQuery();
    const customers = getAllCustomers?.data || [];
    const [deleteCustomer] = useDeleteCustomerMutation()
    const [editCustomer] = useEditCustomerMutation()
    const {data: getAllJobs} = useGetAllJobsQuery()
    const jobs = getAllJobs?.data || [];
    useEffect(() => {
        refetch()
    }, [])
    const columnKeyMap = {
        'Ad': 'name',
        'Soyad': 'surname',
        'fin': 'finCode',
        'Vəzifə': 'jobName',
        'Mobil nömrə': 'phoneNumber',
        'Şirkətlər': 'companyNames'
    };

    // Filter users based on search term and column
    const filteredUsers = customers.filter(user => {
        if (!searchTerm || !searchColumn) return true;
        const key = columnKeyMap[searchColumn];

        if (key === 'companyNames') {
            const companyNames = user.sections?.map(sec => sec.companyName.toLowerCase()) || [];
            return companyNames.some(name => name.includes(searchTerm.toLowerCase()));
        }

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
        const selectedUser = customers.find(u => u.id === id);
        setEditingUser(selectedUser);
    };


    const handleSave = async (updatedUser) => {
        const payload = {
            id: updatedUser.id,
            name: updatedUser.name,
            surname: updatedUser.surname,
            jobId: updatedUser.jobId,
            password: updatedUser.password,
            finCode: updatedUser.finCode,
        };

        try {
            await editCustomer(payload).unwrap();
            setEditingUser(null);
            refetch();
            showPopup("İstifadəçiyə uğurla düzəliş etdiniz","Dəyişikliklər yadda saxlanıldı","success")
        } catch (error) {
            showPopup("Sistem xətası","Əməliyyat tamamlanmadı. Təkrar cəhd edin və ya dəstəyə müraciət edin.","error")
        }
    };

    const handleDeleteConfirm = async () => {
        const userToDelete = pagedUsers[deleteIndex];
        if (!userToDelete) return;

        try {
            await deleteCustomer(userToDelete.id).unwrap();
            setDeleteIndex(null);
            refetch();
            showPopup("İstifadəçini uğurla sildiniz","Seçilmiş istifadəçi sistemdən silindi","success")
        } catch (err) {
            showPopup("Sistem xətası","Əməliyyat tamamlanmadı. Təkrar cəhd edin və ya dəstəyə müraciət edin.","error")
        }
    };

    return (
        <div className="hr-sistem-main">
            <div className="hr-sistem">
                <div className={"headerr"}>
                    <div className={"head"}>
                        <h2>İşçilər</h2>
                        <p>İşçi siyahısını izləyin, əmək haqqı detallarına və vəzifələrə nəzarət edin.</p>
                    </div>

                </div>
                <div className="order-table-wrapper">
                    <div className="scrollable-part">
                        <table>
                            <thead>
                            <tr>
                                {['Şirkətlər','Vəzifə','Ad', 'Soyad'].map((column) => (
                                    <th key={column}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}>
                                            {column.charAt(0).toUpperCase() + column.slice(1)}
                                            <span
                                                onClick={() => handleSearchClick(column)}
                                            >
                                           <IoSearchSharp style={{
                                               marginTop: '-3px',
                                               color: '#7A7A7A',
                                           }}/>
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
                                        </div>
                                    </th>
                                ))}
                                <th>Nağd Ə/h</th>
                                <th>Kart Ə/h</th>
                                <th>Ümumi Ə/h</th>
                            </tr>
                            </thead>
                            <tbody>

                            {pagedUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className={"firstCell"}>
                                        <div className="scrolling-company-cell">
                                            {[...new Set(user.sections?.map(sec => sec.companyName))].join(', ')}
                                        </div>
                                    </td>


                                    <td>{user.jobName}</td>
                                    <td>{user.name}</td>
                                    <td>{user.surname}</td>
                                    <td>{user.finCode}</td>

                                    <td>{user.phoneNumber}</td>
                                    <td>********</td>
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
                                    <LuPencil/>
                                </span>
                                <div className={"line"}></div>
                                <span
                                    className="action-icon delete"
                                    onClick={() => setDeleteIndex(pagedUsers.findIndex(u => u.id === user.id))}
                                >
                                    <GoTrash/>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/*<div className="hr-sistem__pagination">*/}
                {/*    <button*/}
                {/*        onClick={() => setCurrentPage((p) => p - 1)}*/}
                {/*        disabled={currentPage === 1}*/}
                {/*    >*/}
                {/*        &lt;*/}
                {/*    </button>*/}
                {/*    {getPageNumbers().map((page) => (*/}
                {/*        <button*/}
                {/*            key={page}*/}
                {/*            className={page === currentPage ? 'active' : ''}*/}
                {/*            onClick={() => setCurrentPage(page)}*/}
                {/*        >*/}
                {/*            {page}*/}
                {/*        </button>*/}
                {/*    ))}*/}
                {/*    <button*/}
                {/*        onClick={() => setCurrentPage((p) => p + 1)}*/}
                {/*        disabled={currentPage === totalPages}*/}
                {/*    >*/}
                {/*        &gt;*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
            {/*<div className="xett"></div>*/}
            {editingUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setEditingUser(null)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M15.8334 4.16797L4.16675 15.8346M4.16675 4.16797L15.8334 15.8346" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <h3>Burada işçi məlumatlarını gözdən keçira və lazım olduqda dəyişiklik edə bilərsiniz</h3>

                        <div className="form">
                            <div className="form-row">
                                <div>
                                    <label>Ad</label>
                                    <input
                                        type="text"
                                        value={editingUser.name}
                                        onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label>Soyad</label>
                                    <input
                                        type="text"
                                        value={editingUser.surname}
                                        onChange={(e) => setEditingUser({...editingUser, surname: e.target.value})}
                                    />
                                </div>
                            </div>

                            <label>Şirkət</label>
                            <input
                                type="text"
                                value={editingUser.companyName || ''}
                                disabled
                            />

                            <label>Vəzifə</label>
                            <input
                                type="text"
                                value={editingUser.jobName || ''}
                                disabled
                            />

                            <div className="form-row">
                                <div>
                                    <label>Nağd Ə/h</label>
                                    <input
                                        type="text"
                                        value={editingUser.cashSalary || ''}
                                        onChange={(e) => setEditingUser({...editingUser, cashSalary: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label>Kart Ə/h</label>
                                    <input
                                        type="text"
                                        value={editingUser.cardSalary || ''}
                                        onChange={(e) => setEditingUser({...editingUser, cardSalary: e.target.value})}
                                    />
                                </div>
                            </div>

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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="44" viewBox="0 0 45 44"
                                         fill="none">
                                        <path
                                            d="M22.5008 24.566L27.8175 29.8827C28.1536 30.2188 28.5814 30.3869 29.1009 30.3869C29.6203 30.3869 30.0481 30.2188 30.3842 29.8827C30.7203 29.5466 30.8884 29.1188 30.8884 28.5994C30.8884 28.0799 30.7203 27.6522 30.3842 27.3161L25.0675 21.9994L30.3842 16.6827C30.7203 16.3466 30.8884 15.9188 30.8884 15.3994C30.8884 14.8799 30.7203 14.4521 30.3842 14.116C30.0481 13.7799 29.6203 13.6119 29.1009 13.6119C28.5814 13.6119 28.1536 13.7799 27.8175 14.116L22.5008 19.4327L17.1842 14.116C16.8481 13.7799 16.4203 13.6119 15.9008 13.6119C15.3814 13.6119 14.9536 13.7799 14.6175 14.116C14.2814 14.4521 14.1133 14.8799 14.1133 15.3994C14.1133 15.9188 14.2814 16.3466 14.6175 16.6827L19.9342 21.9994L14.6175 27.3161C14.2814 27.6522 14.1133 28.0799 14.1133 28.5994C14.1133 29.1188 14.2814 29.5466 14.6175 29.8827C14.9536 30.2188 15.3814 30.3869 15.9008 30.3869C16.4203 30.3869 16.8481 30.2188 17.1842 29.8827L22.5008 24.566ZM22.5008 40.3327C19.9647 40.3327 17.5814 39.8512 15.3508 38.8881C13.1203 37.925 11.18 36.619 9.52999 34.9702C7.87999 33.3215 6.57404 31.3812 5.61215 29.1494C4.65026 26.9176 4.16871 24.5343 4.16748 21.9994C4.16626 19.4645 4.64782 17.0811 5.61215 14.8494C6.57649 12.6176 7.88243 10.6773 9.52999 9.02852C11.1775 7.37974 13.1178 6.0738 15.3508 5.11068C17.5838 4.14757 19.9672 3.66602 22.5008 3.66602C25.0345 3.66602 27.4179 4.14757 29.6509 5.11068C31.8839 6.0738 33.8241 7.37974 35.4717 9.02852C37.1193 10.6773 38.4258 12.6176 39.3914 14.8494C40.3569 17.0811 40.8379 19.4645 40.8342 21.9994C40.8305 24.5343 40.349 26.9176 39.3895 29.1494C38.4301 31.3812 37.1241 33.3215 35.4717 34.9702C33.8193 36.619 31.879 37.9256 29.6509 38.8899C27.4227 39.8542 25.0394 40.3352 22.5008 40.3327Z"
                                            fill="#E60D0D"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="delete-message">Bu işçini silmək istədiyinizə əminsiniz?</p>
                        <div className="delete-modal-actions">
                            <button className="cancel-btn" onClick={() => setDeleteIndex(null)}>Ləğv et</button>
                            <button
                                className="confirm-btn"
                                onClick={handleDeleteConfirm}
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

export default HrPeople;