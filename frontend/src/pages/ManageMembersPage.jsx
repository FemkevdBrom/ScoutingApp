import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useAuthMutation } from '../hooks/useAuthMutation';

export default function ManageMembersPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: group, loading, error, refetch } = useAuthFetch(
        `${process.env.REACT_APP_API_URL}/api/groups/${id}`
    );
    const { mutate } = useAuthMutation();

    const [newUserId, setNewUserId] = useState('');
    const [newUserRole, setNewUserRole] = useState('LID');

    const handleAdd = async () => {
        try {
            await mutate(`${process.env.REACT_APP_API_URL}/api/groups/${id}/members`, {
                method: 'POST',
                body: JSON.stringify({ userId: Number(newUserId), roleName: newUserRole })
            });
            setNewUserId('');
            refetch(); // vernieuw de lijst
        } catch (err) {
            alert('Toevoegen mislukt');
        }
    };

    const handleRemove = async (memberId) => {
        if (!window.confirm('Weet je zeker dat je dit lid wilt verwijderen?')) return;

        try {
            await mutate(`${process.env.REACT_APP_API_URL}/api/groups/${id}/members/${memberId}`, {
                method: 'DELETE'
            });
            refetch();
        } catch (err) {
            alert('Verwijderen mislukt');
        }
    };

    if (loading) return <div>Laden...</div>;
    if (error) return <div>Fout: {error}</div>;
    if (!group) return <div>Groep niet gevonden</div>;

    const allPersons = [...(group.leaders || []), ...(group.members || [])];

    return (
        <div className="manage-members-page">
            <button onClick={() => navigate(-1)}>← Terug</button>
            <h1>Leden beheren — {group.groupName}</h1>

            <section>
                <h2>Huidige leden en leiding</h2>
                <ul>
                    {allPersons.map((p, i) => (
                        <li key={i}>
                            {p.name || p.fullName} — {p.role || 'Lid'}
                            <button onClick={() => handleRemove(p.id)}>Verwijderen</button>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Lid toevoegen</h2>
                <label>User ID
                    <input value={newUserId} onChange={e => setNewUserId(e.target.value)} placeholder="Bijv. 42" />
                </label>
                <label>Rol
                    <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)}>
                        <option value="LID">Lid</option>
                        <option value="OUDER">Ouder</option>
                        <option value="LEIDER">Leider</option>
                        <option value="TEAMLEIDER">Teamleider</option>
                    </select>
                </label>
                <button onClick={handleAdd}>Toevoegen</button>
            </section>
        </div>
    );
}