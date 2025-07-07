import './index.scss';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import icon from '/src/assets/ph_building-light.svg';
import {useGetUserCompaniesDepartmentBolmeQuery} from "../../../services/adminApi.jsx";
import Cookies from 'js-cookie';
function CompanySectionPage() {
    const departmentId = Cookies.get('departmentId');
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState(null);

    const { data: getUserCompaniesDepartmentBolme } = useGetUserCompaniesDepartmentBolmeQuery({departmentId});
    const sections = getUserCompaniesDepartmentBolme?.data || [];




    const handleSubmit = () => {
        if (selectedSection) {
            Cookies.set('sectionId', selectedSection);
            navigate('/customer/customerAdd');
        }
    };


    return (
        <div id="company-section">
            <div className="header">
                <h2>Logo and name</h2>
            </div>
            <div>
                <div className="company-panel">

                    <div className="company-form">
                        <h1>Bölmə seçin</h1>
                        <p>Seçdiyiniz şölməyə uyğun bölməni seçin və davam edin.</p>

                        <div className="choose">
                            {sections.map(c => (
                                <div
                                    key={c.id}
                                    className={`company ${selectedSection === c.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedSection(c.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={e => e.key === 'Enter' && setSelectedSection(c.id)}
                                >
                                    <span className={`select-circle ${selectedSection === c.id ? 'checked' : ''}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none">
  <path
      d="M6 15L9.233 17.425C9.43936 17.5797 9.69752 17.6487 9.95356 17.6176C10.2096 17.5865 10.4437 17.4577 10.607 17.258L19 7"
      stroke="#384871" stroke-width="2" stroke-linecap="round"/>
</svg>
                                    </span>
                                    <p>{c.name}</p>

                                </div>
                            ))}
                        </div>

                       <div className={"buttons"}>
                           <button className={"backk"} onClick={()=>navigate('/choose-company-companyDepartment')}>
                               <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                   <path d="M6.85398 4.14592C6.90054 4.19236 6.93748 4.24754 6.96269 4.30828C6.9879 4.36903 7.00087 4.43415 7.00087 4.49992C7.00087 4.56568 6.9879 4.63081 6.96269 4.69155C6.93748 4.7523 6.90054 4.80747 6.85398 4.85392L4.20698 7.49992H8.99998C10.4587 7.49992 11.8576 8.07938 12.8891 9.11083C13.9205 10.1423 14.5 11.5412 14.5 12.9999C14.5 13.1325 14.4473 13.2597 14.3535 13.3535C14.2598 13.4472 14.1326 13.4999 14 13.4999C13.8674 13.4999 13.7402 13.4472 13.6464 13.3535C13.5527 13.2597 13.5 13.1325 13.5 12.9999C13.5 11.8064 13.0259 10.6619 12.182 9.81794C11.338 8.97402 10.1935 8.49992 8.99998 8.49992H4.20698L6.85398 11.1459C6.90047 11.1924 6.93734 11.2476 6.9625 11.3083C6.98766 11.3691 7.00061 11.4342 7.00061 11.4999C7.00061 11.5657 6.98766 11.6308 6.9625 11.6915C6.93734 11.7522 6.90047 11.8074 6.85398 11.8539C6.80749 11.9004 6.7523 11.9373 6.69156 11.9624C6.63082 11.9876 6.56572 12.0005 6.49998 12.0005C6.43423 12.0005 6.36913 11.9876 6.30839 11.9624C6.24766 11.9373 6.19247 11.9004 6.14598 11.8539L2.64598 8.35392C2.59941 8.30747 2.56247 8.2523 2.53727 8.19155C2.51206 8.13081 2.49908 8.06568 2.49908 7.99992C2.49908 7.93415 2.51206 7.86903 2.53727 7.80828C2.56247 7.74754 2.59941 7.69236 2.64598 7.64592L6.14598 4.14592C6.19242 4.09935 6.2476 4.06241 6.30834 4.0372C6.36909 4.012 6.43421 3.99902 6.49998 3.99902C6.56575 3.99902 6.63087 4.012 6.69161 4.0372C6.75236 4.06241 6.80753 4.09935 6.85398 4.14592Z" fill="#747474"/>
                               </svg> Geri
                           </button>
                           <button
                               type="button"
                               className="submit"
                               disabled={selectedSection === null}
                               onClick={handleSubmit}
                           >
                               Davam et
                           </button>

                       </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="copyRight">
                    <p>Copyright@2025</p>
                </div>
                <div className="terms">
                    <p>Sistemə giriş yalnız icazəli şəxslər üçün mümkündür.</p>
                </div>
            </div>
        </div>
    );
}

export default CompanySectionPage;
