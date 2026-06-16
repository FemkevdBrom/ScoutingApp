import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthFetch } from '../hooks/useAuthFetch';

import GroupInfoCard from '../components/GroupPage/GroupInfoCard';
import PersonCard from '../components/GroupPage/PersonCard';
import './GroupPage.css';   // ← Vergeet dit niet!

export default function GroupPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: group, loading, error } = useAuthFetch(
        `${process.env.REACT_APP_API_URL}/api/groups/${id}`
    );

    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">Fout bij ophalen groep: {error}</div>;
    if (!group) return <div>Groep niet gevonden</div>;

    const role = group.userRole?.toUpperCase();
    const isLeider = role === 'LEIDER' || role === 'TEAMLEIDER';
    const isTeamleider = role === 'TEAMLEIDER';

    const handlePersonClick = (personId) => {
        if (isTeamleider) {
            navigate(`/users/${personId}`);
        }
    };

    return (
        <div className="group-page">
            <h1 className="group-title">{group.groupName || group.name}</h1>

            <div className="group-content">
                <GroupInfoCard group={group} />

                {/* Leiding */}
                <div className="section">
                    <h2>Leiding</h2>
                    <div className="cards-container">
                        {group.leaders?.length > 0 ? (
                            group.leaders.map((leader) => (
                                <PersonCard
                                    key={leader.id}
                                    person={leader}
                                    onClick={() => handlePersonClick(leader.id)}
                                    isClickable={isTeamleider}
                                />
                            ))
                        ) : (
                            <p>Geen leiding gevonden</p>
                        )}
                    </div>
                </div>

                {/* Leden - alleen voor leiders */}
                {isLeider && (
                    <div className="section">
                        <h2>Leden</h2>
                        <div className="cards-container">
                            {group.members?.length > 0 ? (
                                group.members.map((member) => (
                                    <PersonCard
                                        key={member.id}
                                        person={member}
                                        onClick={() => handlePersonClick(member.id)}
                                        isClickable={isTeamleider}
                                    />
                                ))
                            ) : (
                                <p>Geen leden gevonden</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Acties */}
                {isTeamleider && (
                    <div className="actions">
                        <button onClick={() => navigate(`/groups/${id}/edit`)}>
                            Groepsgegevens aanpassen
                        </button>
                        <button onClick={() => navigate(`/groups/${id}/members`)}>
                            Leden beheren
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}