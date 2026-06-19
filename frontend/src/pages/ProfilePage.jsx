import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useAuthFetch } from "../hooks/useAuthFetch";
import './ProfilePage.css';

function formatDateNL(dateStr) {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
}

export default function ProfilePage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const { data: groups } = useAuthFetch(
        user?.id
            ? `${process.env.REACT_APP_API_URL}/api/groups/my?userId=${user.id}`
            : null
    );

    if (!user) return <div className="loading">Laden...</div>;

    return (
        <div className="profile-page">
            <h1 className="profile-title">{user.firstName} {user.infix} {user.lastName}</h1>

            <div className="info-card">
                <h2>Mijn gegevens</h2>
                <div className="info-grid">
                    <div><strong>Email:</strong> {user.email || '-'}</div>
                    <div><strong>Geboortedatum:</strong> {formatDateNL(user.birthDate)}</div>
                    <div><strong>Straat:</strong> {user.street || '-'} {user.houseNumber || ''}</div>
                    <div><strong>Postcode:</strong> {user.postalCode || '-'}</div>
                    <div><strong>Stad:</strong> {user.city || '-'}</div>
                    <div><strong>Land:</strong> {user.country || '-'}</div>
                </div>
            </div>

            {groups?.length > 0 && (
                <div className="section">
                    <h2>Mijn groepen</h2>
                    <div className="cards-container">
                        {groups.map((g) => (
                            <div
                                key={g.id}
                                className="person-card clickable"
                                style={{ borderLeft: `4px solid ${g.colorHex}` }}
                                onClick={() => navigate(`/groups/${g.id}`)}
                            >
                                <div>
                                    <div className="card-name">{g.name}</div>
                                    {g.roleName && <div className="card-role">{g.roleName}</div>}
                                </div>
                                <span className="card-arrow">→</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}