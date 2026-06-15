import React, {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';
import "./Header.css";

export default function Header() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="header">
            <div className="header-title">Scouting App</div>
            {user && (
                <button className="header-user" onClick={() => navigate('/profile')}>
                    Welkom, {user.firstName}
                </button>
            )}
        </div>
    );
}