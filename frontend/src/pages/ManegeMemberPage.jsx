import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ManageMembersPage() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [newUserId, setNewUserId] = useState('');
    const [newUserRole, setNewUserRole] = useState('LID');

    const fetchGroup = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/groups/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
            .then(res => res.json())
            .then(data => setGroup(data));
    };

    useEffect(() => {
        if (!user?.token) return;
        fetchGroup();
    }, [id, user]);

    const handleAdd = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/groups/${id}/members`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({ userId: Number(newUserId), roleName: newUserRole })
        }).then(() => {
            setNewUserId('');
            fetchGroup();
        });
    };

    const handleRemove = (memberId) => {
        fetch(`${process.env.REACT_APP_API_URL}/api/groups/${id}/members/${memberId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(() => fetchGroup());
    };

    if (!group) return <div>Laden...</div>;

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
                            {p.name} — {p.role || 'Lid'}
                            <button onClick={() => handleRemove(p.id)}>Verwijderen</button>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Lid toevoegen</h2>
                <label>User ID
                    <input
                        value={newUserId}
                        onChange={e => setNewUserId(e.target.value)}
                        placeholder="Bijv. 42"
                    />
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