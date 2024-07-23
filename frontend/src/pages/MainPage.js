// MainPage.js

import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MainPage.css'; 
import branchImage from '../img/branch_BL.png';
import { checkAuthStatus } from '../api/axiosInstance';

const MainPage = () => {
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);

     // Check authentication status
     useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await checkAuthStatus();
                if (response.valid) {
                    navigate('/chat');
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
            }
        };

        checkAuth();
    }, [navigate]);

    const LoginClick = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    const NewSignupClick = useCallback(() => {
        navigate('/signup');
    }, [navigate]);

    const handleClick = () => {
        setIsClicked(true);
    };

    return (
        <div className='main' onClick={handleClick}>
            <div className={`mainChild ${isClicked ? 'shrink' : ''}`}>
                <img className='branchBl1' alt="" src={branchImage} />
            </div>
            <div className={`mainItem ${isClicked ? 'visible' : ''}`}>
                <div className={`wrapper ${isClicked ? 'visible' : ''}`} onClick={LoginClick}>
                    <div className='div'>로그인</div>
                </div>
                <div className={`component3 ${isClicked ? 'visible' : ''}`} onClick={NewSignupClick}>
                    <div className='div'>회원가입</div>
                </div>
            </div> 
        </div>
    );
};

export default MainPage;
