import React, {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';
import "./Header.css";

export default function Header() {
    const { user, logout } = useContext(AuthContext); // logout toevoegen
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="header">
            <div className="header-title"
                 onClick={() => navigate('/home')}
                 style={{cursor: 'pointer'}}>
                Scouting App
            </div>
            {user && (
                <>
                    <button className="header-user" onClick={() => navigate('/profile')}>
                        Welkom, {user.firstName}
                    </button>
                    <button className="header-logout" onClick={handleLogout}>
                        Uitloggen
                    </button>
                </>
            )}
        </div>
    );
}