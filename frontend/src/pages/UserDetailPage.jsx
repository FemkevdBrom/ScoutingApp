import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function UserDetailPage() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [parents, setParents] = useState([]);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        if (!user?.token) return;

        fetch(`${process.env.REACT_APP_API_URL}/api/users/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
            .then(res => res.json())
            .then(data => {
                setProfile(data);
                setForm(data);
            });

        fetch(`${process.env.REACT_APP_API_URL}/api/users/${id}/parents`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
            .then(res => res.json())
            .then(data => setParents(data))
            .catch(() => setParents([]));

    }, [id, user]);

    const handleSave = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify(form)
        }).then(() => {
            setProfile(form);
            setEditing(false);
        });
    };

    if (!profile) return <div>Laden...</div>;

    return (
        <div className="user-detail-page">
            <button onClick={() => navigate(-1)}>← Terug</button>
            <h1>{profile.firstName} {profile.infix} {profile.lastName}</h1>

            {editing ? (
                <div className="edit-form">
                    <label>Voornaam
                        <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                    </label>
                    <label>Tussenvoegsel
                        <input value={form.infix || ''} onChange={e => setForm({...form, infix: e.target.value})} />
                    </label>
                    <label>Achternaam
                        <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                    </label>
                    <label>Email
                        <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </label>
                    <label>Geboortedatum
                        <input type="date" value={form.birthDate || ''} onChange={e => setForm({...form, birthDate: e.target.value})} />
                    </label>
                    <label>Straat
                        <input value={form.street || ''} onChange={e => setForm({...form, street: e.target.value})} />
                    </label>
                    <label>Huisnummer
                        <input value={form.houseNumber || ''} onChange={e => setForm({...form, houseNumber: e.target.value})} />
                    </label>
                    <label>Postcode
                        <input value={form.postalCode || ''} onChange={e => setForm({...form, postalCode: e.target.value})} />
                    </label>
                    <label>Stad
                        <input value={form.city || ''} onChange={e => setForm({...form, city: e.target.value})} />
                    </label>
                    <label>Land
                        <input value={form.country || ''} onChange={e => setForm({...form, country: e.target.value})} />
                    </label>
                    <button onClick={handleSave}>Opslaan</button>
                    <button onClick={() => setEditing(false)}>Annuleren</button>
                </div>
            ) : (
                <div className="profile-info">
                    <table>
                        <tbody>
                        <tr><td>Email</td><td>{profile.email}</td></tr>
                        <tr><td>Geboortedatum</td><td>{profile.birthDate}</td></tr>
                        <tr><td>Straat</td><td>{profile.street} {profile.houseNumber}</td></tr>
                        <tr><td>Postcode</td><td>{profile.postalCode}</td></tr>
                        <tr><td>Stad</td><td>{profile.city}</td></tr>
                        <tr><td>Land</td><td>{profile.country}</td></tr>
                        </tbody>
                    </table>
                    <button onClick={() => setEditing(true)}>Gegevens bewerken</button>
                </div>
            )}

            {parents.length > 0 && (
                <section>
                    <h2>Ouders</h2>
                    <ul>
                        {parents.map((p, i) => (
                            <li key={i}>{p.firstName} {p.infix} {p.lastName} — {p.email}</li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}