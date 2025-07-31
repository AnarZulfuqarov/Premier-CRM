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

const HrSalary = () => {
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
        <div className="hr-sistem-salary-main">
            <div className="hr-sistem-salary">
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
                                <th rowSpan="2">Ad</th>
                                <th rowSpan="2">Soyad</th>
                                <th rowSpan="2">Şirkət</th>
                                <th rowSpan="2">Vəzifə</th>
                                <th colSpan="2" className="top-header">Ümumi əmək haqqı</th>
                                <th colSpan="4" className="top-header yellow">Aylıq əmək haqqı</th>
                            </tr>
                            <tr>
                                <th>Əldən</th>
                                <th>Rəsmi</th>
                                <th>Əldən ödəniləcək</th>
                                <th>Əldən ödənilməyəcək</th>
                                <th>Rəsmi ödənilən</th>
                                <th>Rəsmi ödənilməyən</th>
                            </tr>
                            </thead>

                            <tbody>
                            {pagedUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.surname}</td>
                                    <td>
                                        {[...new Set(user.sections?.map(sec => sec.companyName))].join(', ')}
                                    </td>
                                    <td>{user.jobName}</td>

                                    {/* Ümumi əmək haqqı */}
                                    <td>500₼</td> {/* Əldən */}
                                    <td>500₼</td> {/* Rəsmi */}

                                    {/* Aylıq əmək haqqı */}
                                    <td>500₼</td> {/* Əldən ödəniləcək */}
                                    <td>500₼</td> {/* Əldən ödənilməyəcək */}
                                    <td>500₼</td> {/* Rəsmi ödənilən */}
                                    <td>500₼</td> {/* Rəsmi ödənilməyən */}


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

                            </div>
                        ))}
                    </div>
                </div>

                {/*<div className="hr-sistem-salary__pagination">*/}
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
                        <h3>Burada əmək haqqı üzrə məlumatların idarə edə və dəyişiklik edə bilərsiniz</h3>

                        <div className="salary-table-container">


                            <table className="salary-table general-salary">
                                <thead>
                                <tr>
                                    <th colSpan={2}>Ümumi əmək haqqı</th>
                                </tr>
                                <tr>
                                    <th className={'agTh'}>Əldən</th>
                                    <th className={'agTh'}>Rəsmi</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>
                                        <input
                                            type="number"
                                            value={editingUser?.totalCashSalary || ''}
                                            onChange={(e) => setEditingUser({...editingUser, totalCashSalary: e.target.value})}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={editingUser?.totalCardSalary || ''}
                                            onChange={(e) => setEditingUser({...editingUser, totalCardSalary: e.target.value})}
                                        />
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            <table className="salary-table monthly-salary">
                                <thead>
                                <tr>
                                    <th colSpan={4}>Aylıq əmək haqqı</th>
                                </tr>
                                <tr>
                                    <th className={"agTh"}>Əldən ödənilən</th>
                                    <th className={"agTh"}>Əldən ödənilməyəcək</th>
                                    <th className={"agTh"}>Rəsmi ödənilən</th>
                                    <th className={"agTh"}>Rəsmi ödənilməyən</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>
                                        <input
                                            type="number"
                                            value={editingUser?.monthlyCashPaid || ''}
                                            onChange={(e) => setEditingUser({...editingUser, monthlyCashPaid: e.target.value})}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={editingUser?.monthlyCashUnpaid || ''}
                                            onChange={(e) => setEditingUser({...editingUser, monthlyCashUnpaid: e.target.value})}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={editingUser?.monthlyCardPaid || ''}
                                            onChange={(e) => setEditingUser({...editingUser, monthlyCardPaid: e.target.value})}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={editingUser?.monthlyCardUnpaid || ''}
                                            onChange={(e) => setEditingUser({...editingUser, monthlyCardUnpaid: e.target.value})}
                                        />
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            <button className="save-btn" onClick={() => handleSave(editingUser)}>
                                Yadda saxla
                            </button>
                        </div>


                    </div>
                </div>
            )}


        </div>
    );
};

export default HrSalary;