import './index.scss';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/UserComponents/Navbar/Navbar.jsx';
import Footer from '../../components/UserComponents/Footer/index.jsx';
import StartPage from '../UserPages/StartPage/StartPage.jsx';

const MainPage = () => {
    const [showStart, setShowStart] = useState(true);
    const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed (768px is a common mobile threshold)

    useEffect(() => {
        // Only set the timeout if not on mobile
        if (!isMobile) {
            const timer = setTimeout(() => {
                setShowStart(false); // Hide StartPage after 8 seconds
            }, 8000); // 8000ms = 8 seconds

            // Cleanup the timer when the component unmounts
            return () => clearTimeout(timer);
        } else {
            setShowStart(false); // Immediately hide StartPage on mobile
        }
    }, []); // Empty dependency array to run only once on mount

    return (
        <div id="mainPage">
            {showStart && !isMobile ? (
                <>
                    <div className="start-page">
                        <StartPage />
                    </div>
                    <div style={{ display: 'none' }}>
                        <Navbar />
                        <Outlet />
                        <Footer />
                    </div>
                </>
            ) : (
                <>
                    <Navbar />
                    <Outlet />
                    <Footer />
                </>
            )}
        </div>
    );
};

export default MainPage;