import './index.scss';
import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {FaTimes} from "react-icons/fa";
import {useDeleteJobMutation, useEditJobMutation, useGetAllJobsQuery} from "../../../services/adminApi.jsx";
import {usePopup} from "../../../components/Popup/PopupContext.jsx";

const  SuperAdminVezife = () => {
    const navigate = useNavigate();
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [newJobName, setNewJobName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const showPopup = usePopup()
    const [searchName, setSearchName] = useState('');
    const [activeSearch, setActiveSearch] = useState(null);
    const {data:getAllJobs,refetch} = useGetAllJobsQuery()
    const jobs = getAllJobs?.data || [];
    const [edit] = useEditJobMutation()
    const [deleteJob] = useDeleteJobMutation()
    useEffect(() => {
        refetch();
    }, []);
    const filteredJobs = jobs.filter((job) =>
        job.name.toLowerCase().includes(searchName.toLowerCase())
    );

    return (
        <div className="super-admin-vezife-main">
            <div className="super-admin-vezife">
                <div className={"headerr"}>
                    <div className={"head"}>
                        <h2>Vəzifə</h2>
                        <p>Sistemdəki istifadəçilərin rollarını buradan idarə edə və yeni vəzifələr təyin edə bilərsiniz.  </p>
                    </div>
                    <button onClick={()=>navigate("/superAdmin/vezifeAdd")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                            <path d="M12 23C6.21 23 1.5 18.29 1.5 12.5C1.5 6.71 6.21 2 12 2C17.79 2 22.5 6.71 22.5 12.5C22.5 18.29 17.79 23 12 23ZM12 3.5C7.035 3.5 3 7.535 3 12.5C3 17.465 7.035 21.5 12 21.5C16.965 21.5 21 17.465 21 12.5C21 7.535 16.965 3.5 12 3.5Z" fill="white"/>
                            <path d="M12 17.75C11.58 17.75 11.25 17.42 11.25 17V8C11.25 7.58 11.58 7.25 12 7.25C12.42 7.25 12.75 7.58 12.75 8V17C12.75 17.42 12.42 17.75 12 17.75Z" fill="white"/>
                            <path d="M16.5 13.25H7.5C7.08 13.25 6.75 12.92 6.75 12.5C6.75 12.08 7.08 11.75 7.5 11.75H16.5C16.92 11.75 17.25 12.08 17.25 12.5C17.25 12.92 16.92 13.25 16.5 13.25Z" fill="white"/>
                        </svg>
                        Vəzifə əlavə et
                    </button>
                </div>

                <div className="order-table-wrapper">
                        <table>
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
                                            <FaTimes onClick={() => { setActiveSearch(null); setSearchName(''); }} />
                                        </div>
                                    ) : (
                                        <div className="th-label">
                                            Vəzifə adı
                                            <svg onClick={() => setActiveSearch('name')} xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                                    <path d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z" fill="#7A7A7A"/>
                                            </svg>
                                        </div>
                                    )}
                                </th>
                                <th>İşçi sayı</th>
                                <th>Fəaliyyətlər</th> {/* Yeni sütun */}
                            </tr>
                            </thead>

                            <tbody>
                            {filteredJobs.map((order, idx) => (
                                <tr key={order.id}>
                                    <td>{order.name}</td>
                                    <td>{order.customers?.length}</td>

                                    {/* Yeni fəaliyyətlər sütunu */}
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                                            {/* edit icon */}
                                            <svg onClick={() => {
                                                setSelectedJob(order);
                                                setNewJobName(order.name);
                                                setModalVisible(true);
                                            }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 20 20" style={{ cursor: 'pointer' }}>
                                                <path d="M18.333 6.033a1 1 0 00-.042-.32 1 1 0 00-.199-.38L14.558 1.908a1 1 0 00-1.183-.182l-2.359 2.359-9.108 9.109a1 1 0 00-.275.553l-.001.029v3.533a1 1 0 001 1h3.533a1 1 0 00.554-.154l9.058-9.108 2.358-2.358a1 1 0 00.24-.756ZM5.692 16.667H3.333v-2.358l8.275-8.275 2.359 2.359-8.275 8.274ZM15.142 7.217l-2.359-2.359 1.184-1.175 2.358 2.358-1.183 1.176Z" fill="#919191"/>
                                            </svg>
                                            {/* delete icon */}
                                            <svg onClick={() => setJobToDelete(order)} xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none" style={{ cursor: 'pointer' }}>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.09167 1.875H11.9083C12.0892 1.875 12.2467 1.875 12.395 1.89833C12.6839 1.94462 12.958 2.05788 13.1953 2.22907C13.4326 2.40025 13.6266 2.6246 13.7617 2.88417C13.8317 3.0175 13.8808 3.16667 13.9383 3.3375L14.0308 3.61667L14.0558 3.6875C14.1312 3.89679 14.2717 4.07645 14.4566 4.20016C14.6415 4.32387 14.8611 4.38514 15.0833 4.375H17.5833C17.7491 4.375 17.9081 4.44085 18.0253 4.55806C18.1425 4.67527 18.2083 4.83424 18.2083 5C18.2083 5.16576 18.1425 5.32473 18.0253 5.44194C17.9081 5.55915 17.7491 5.625 17.5833 5.625H3.41667C3.25091 5.625 3.09194 5.55915 2.97473 5.44194C2.85752 5.32473 2.79167 5.16576 2.79167 5C2.79167 4.83424 2.85752 4.67527 2.97473 4.55806C3.09194 4.44085 3.25091 4.375 3.41667 4.375H5.99167C6.21425 4.36966 6.42927 4.29314 6.60519 4.15667C6.78111 4.02019 6.90867 3.83094 6.96917 3.61667L7.0625 3.3375C7.11917 3.16667 7.16833 3.0175 7.2375 2.88417C7.37266 2.6245 7.56674 2.40009 7.80421 2.2289C8.04168 2.05771 8.31593 1.9445 8.605 1.89833C8.75333 1.875 8.91083 1.875 9.09084 1.875M8.00584 4.375C8.06355 4.26004 8.11231 4.1408 8.15167 4.01833L8.235 3.76833C8.31083 3.54083 8.32833 3.495 8.34583 3.46167C8.39082 3.37501 8.45549 3.30009 8.53465 3.24293C8.61381 3.18577 8.70526 3.14795 8.80167 3.1325C8.91028 3.12288 9.0194 3.12037 9.12833 3.125H11.87C12.11 3.125 12.16 3.12667 12.1967 3.13333C12.293 3.14869 12.3844 3.18639 12.4636 3.2434C12.5427 3.30041 12.6074 3.37516 12.6525 3.46167C12.67 3.495 12.6875 3.54083 12.7633 3.76917L12.8467 4.01917L12.8792 4.1125C12.9119 4.20361 12.9497 4.29111 12.9925 4.375H8.00584Z" fill="#ED0303"/>
                                                <path d="M5.42917 7.04246C5.41812 6.87703 5.3418 6.72277 5.21701 6.6136C5.09222 6.50444 4.92918 6.44932 4.76375 6.46038C4.59832 6.47143 4.44406 6.54774 4.3349 6.67253C4.22573 6.79732 4.17062 6.96036 4.18167 7.12579L4.56833 12.9191C4.63917 13.9875 4.69667 14.8508 4.83167 15.5291C4.9725 16.2333 5.21083 16.8216 5.70417 17.2825C6.1975 17.7433 6.8 17.9433 7.5125 18.0358C8.1975 18.1258 9.0625 18.1258 10.1342 18.1258H10.8667C11.9375 18.1258 12.8033 18.1258 13.4883 18.0358C14.2 17.9433 14.8033 17.7441 15.2967 17.2825C15.7892 16.8216 16.0275 16.2325 16.1683 15.5291C16.3033 14.8516 16.36 13.9875 16.4317 12.9191L16.8183 7.12579C16.8294 6.96036 16.7743 6.79732 16.6651 6.67253C16.5559 6.54774 16.4017 6.47143 16.2362 6.46038C16.0708 6.44932 15.9078 6.50444 15.783 6.6136C15.6582 6.72277 15.5819 6.87703 15.5708 7.04246L15.1875 12.7925C15.1125 13.915 15.0592 14.6966 14.9425 15.2841C14.8283 15.855 14.67 16.1566 14.4425 16.37C14.2142 16.5833 13.9025 16.7216 13.3258 16.7966C12.7317 16.8741 11.9483 16.8758 10.8225 16.8758H10.1775C9.0525 16.8758 8.26917 16.8741 7.67417 16.7966C7.0975 16.7216 6.78583 16.5833 6.5575 16.37C6.33 16.1566 6.17167 15.855 6.0575 15.285C5.94083 14.6966 5.8875 13.915 5.8125 12.7916L5.42917 7.04246Z" fill="#ED0303"/>
                                                <path d="M8.35417 8.54413C8.51903 8.52761 8.68371 8.57723 8.812 8.68208C8.9403 8.78694 9.02171 8.93844 9.03833 9.1033L9.455 13.27C9.4672 13.4325 9.4154 13.5934 9.31065 13.7184C9.2059 13.8433 9.05648 13.9223 8.89427 13.9386C8.73206 13.9549 8.5699 13.9072 8.44238 13.8056C8.31486 13.7041 8.23207 13.5567 8.21167 13.395L7.795 9.2283C7.77848 9.06343 7.8281 8.89875 7.93295 8.77046C8.0378 8.64217 8.18931 8.56076 8.35417 8.54413ZM12.6458 8.54413C12.8105 8.56077 12.9619 8.64205 13.0667 8.77016C13.1716 8.89827 13.2213 9.06274 13.205 9.22747L12.7883 13.3941C12.7677 13.5556 12.6848 13.7026 12.5575 13.8039C12.4301 13.9052 12.2682 13.9529 12.1063 13.9367C11.9443 13.9205 11.7951 13.8418 11.6903 13.7173C11.5854 13.5928 11.5333 13.4323 11.545 13.27L11.9617 9.1033C11.9783 8.9386 12.0596 8.78723 12.1877 8.6824C12.3158 8.57757 12.4811 8.52784 12.6458 8.54413Z" fill="#ED0303"/>
                                            </svg>
                                        </div>
                                    </td>


                                </tr>
                            ))}
                            </tbody>

                        </table>


                </div>

            </div>
            {modalVisible && (
                <div className="vendor-edit-modal-overlay" onClick={() => setModalVisible(false)}>
                    <div className="vendor-edit-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setModalVisible(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M12.6668 3.33301L3.3335 12.6663M3.3335 3.33301L12.6668 12.6663" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <h3>Dəyişiklik et</h3>
                        <div className="modal-fields">
                            <label>Vəzifə adı</label>
                            <input
                                type="text"
                                value={newJobName}
                                onChange={(e) => setNewJobName(e.target.value)}
                                placeholder="Vəzifə adı"
                            />
                        </div>
                        <button
                            className="save-btn"
                            onClick={async () => {
                                if (!selectedJob) return;
                                try {
                                    await edit({ id: selectedJob.id, name: newJobName }).unwrap();
                                    setModalVisible(false);
                                    refetch();
                                    showPopup("Vəzifəyə düzəliş etdiniz","Dəyişikliklər uğurla yadda saxlanıldı","success")
                                } catch {
                                    showPopup("Sistem xətası","Əməliyyat tamamlanmadı. Təkrar cəhd edin və ya dəstəyə müraciət edin.","error")
                                }
                            }}
                        >
                            Yadda saxla
                        </button>

                    </div>
                </div>
            )}
            {jobToDelete !== null && (
                <div className="modal-overlay" onClick={() => setJobToDelete(null)}>
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
                        <p className="delete-message">Vəzifəni silmək istədiyinizə əminsiz? </p>
                        <div className="delete-modal-actions">
                            <button className="cancel-btn" onClick={() => setJobToDelete(null)}>Ləğv et</button>
                            <button
                                className="confirm-btn"
                                onClick={async () => {
                                    try {
                                        await deleteJob(jobToDelete.id).unwrap();
                                        setJobToDelete(null);
                                        refetch();
                                        showPopup("Vəzifəni uğurla sildiniz","Seçilmiş vəzifə sistemdən silindi","success")
                                    } catch {
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

export default SuperAdminVezife;
