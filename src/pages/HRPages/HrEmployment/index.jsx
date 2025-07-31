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

const HrEmployment = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchColumn, setSearchColumn] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const pageSize = 8;
    const [deleteIndex, setDeleteIndex] = useState(null);
    const showPopup = usePopup()
    const [editingUser, setEditingUser] = useState(null);
    const [acceptIndex, setAcceptIndex] = useState(null);

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
    const handleAcceptCandidate = (user) => {
        // Burada API ya da əməliyyat yazılacaq
        showPopup("Qəbul edildi", `${user.name} qəbul edildi`, "success");
        setAcceptIndex(null);
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
        <div className="hr-sistem-employment-main">
            <div className="hr-sistem-employment">
                <div className={"headerr"}>
                    <div className={"head"}>
                        <h2>İşə qəbul</h2>
                        <p>Yeni işçilərin əlavə olunması və qəbul prosesinin idarə edilməsi</p>
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
                                <th>Ümumi Ə/h</th>
                                <th>CV</th>
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
                                    onClick={() => setAcceptIndex(pagedUsers.findIndex(u => u.id === user.id))}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 22C6.977 22 2.5 17.523 2.5 12C2.5 6.477 6.977 2 12.5 2C18.023 2 22.5 6.477 22.5 12C22.5 17.523 18.023 22 12.5 22ZM11.323 14.14L8.558 11.373L7.5 12.431L10.619 15.552C10.8065 15.7395 11.0608 15.8448 11.326 15.8448C11.5912 15.8448 11.8455 15.7395 12.033 15.552L17.985 9.602L16.923 8.54L11.323 14.14Z" fill="#31AC2E"/>
</svg>
                                </span>
                                <div className={"line"}></div>
                                <span
                                    className="action-icon delete"
                                    onClick={() => setDeleteIndex(pagedUsers.findIndex(u => u.id === user.id))}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
  <path d="M12.5 2C6.97 2 2.5 6.47 2.5 12C2.5 17.53 6.97 22 12.5 22C18.03 22 22.5 17.53 22.5 12C22.5 6.47 18.03 2 12.5 2ZM16.8 16.3C16.7075 16.3927 16.5976 16.4663 16.4766 16.5164C16.3557 16.5666 16.226 16.5924 16.095 16.5924C15.964 16.5924 15.8343 16.5666 15.7134 16.5164C15.5924 16.4663 15.4825 16.3927 15.39 16.3L12.5 13.41L9.61 16.3C9.42302 16.487 9.16943 16.592 8.905 16.592C8.64057 16.592 8.38698 16.487 8.2 16.3C8.01302 16.113 7.90798 15.8594 7.90798 15.595C7.90798 15.4641 7.93377 15.3344 7.98387 15.2135C8.03398 15.0925 8.10742 14.9826 8.2 14.89L11.09 12L8.2 9.11C8.01302 8.92302 7.90798 8.66943 7.90798 8.405C7.90798 8.14057 8.01302 7.88698 8.2 7.7C8.38698 7.51302 8.64057 7.40798 8.905 7.40798C9.16943 7.40798 9.42302 7.51302 9.61 7.7L12.5 10.59L15.39 7.7C15.4826 7.60742 15.5925 7.53398 15.7135 7.48387C15.8344 7.43377 15.9641 7.40798 16.095 7.40798C16.2259 7.40798 16.3556 7.43377 16.4765 7.48387C16.5975 7.53398 16.7074 7.60742 16.8 7.7C16.8926 7.79258 16.966 7.90249 17.0161 8.02346C17.0662 8.14442 17.092 8.27407 17.092 8.405C17.092 8.53593 17.0662 8.66558 17.0161 8.78654C16.966 8.90751 16.8926 9.01742 16.8 9.11L13.91 12L16.8 14.89C17.18 15.27 17.18 15.91 16.8 16.3Z" fill="#ED0303"/>
</svg>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/*<div className="hr-sistem-employment__pagination">*/}
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
            {acceptIndex !== null && (
                <div className="modal-overlay" onClick={() => setAcceptIndex(null)}>
                    <div className="accept-modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="accept-icon-wrapper">
                            <div className="accept-icon-circle-one">
                                <div className="accept-icon-circle">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4999 32.4716C7.68502 32.4716 0.539551 25.3261 0.539551 16.5112C0.539551 7.69625 7.68502 0.550781 16.4999 0.550781C25.3149 0.550781 32.4603 7.69625 32.4603 16.5112C32.4603 25.3261 25.3149 32.4716 16.4999 32.4716ZM14.6214 19.9267L10.2084 15.5105L8.51975 17.1991L13.4978 22.1803C13.7971 22.4795 14.203 22.6476 14.6262 22.6476C15.0494 22.6476 15.4553 22.4795 15.7546 22.1803L25.2542 12.6839L23.5592 10.9889L14.6214 19.9267Z" fill="#31AC2E"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="accept-message">Namizədi qəbul etmək istəyirsiniz?</p>
                        <div className="accept-modal-actions">
                            <button className="cancel-btn" onClick={() => setAcceptIndex(null)}>Xeyr</button>
                            <button className="confirm-btn" onClick={() => handleAcceptCandidate(pagedUsers[acceptIndex])}>Bəli</button>
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

export default HrEmployment;