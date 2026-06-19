import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useAuthMutation } from '../hooks/useAuthMutation';
import './ProfilePage.css';

function formatDateNL(dateStr) {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
}

export default function UserDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: profile, loading, error } = useAuthFetch(`${process.env.REACT_APP_API_URL}/api/users/${id}`);
    const { data: parents } = useAuthFetch(`${process.env.REACT_APP_API_URL}/api/users/${id}/parents`);
    const { mutate } = useAuthMutation();

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        if (profile) setForm(profile);
    }, [profile]);

    const handleSave = async () => {
        try {
            await mutate(`${process.env.REACT_APP_API_URL}/api/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(form)
            });
            setEditing(false);
        } catch (err) {
            alert('Opslaan mislukt');
        }
    };

    const field = (label, key, type = 'text') => (
        <label>
            {label}
            <input
                type={type}
                value={form[key] || ''}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
            />
        </label>
    );

    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">Fout: {error}</div>;
    if (!profile) return <div>Gebruiker niet gevonden</div>;

    return (
        <div className="profile-page">
            <button className="back-btn" onClick={() => navigate(-1)}>← Terug</button>
            <h1 className="profile-title">{profile.firstName} {profile.infix} {profile.lastName}</h1>

            {editing ? (
                <div className="info-card">
                    <h2>Gegevens bewerken</h2>
                    <div className="edit-form">
                        {field('Voornaam', 'firstName')}
                        {field('Tussenvoegsel', 'infix')}
                        {field('Achternaam', 'lastName')}
                        {field('Email', 'email')}
                        {field('Geboortedatum', 'birthDate', 'date')}
                        {field('Straat', 'street')}
                        {field('Huisnummer', 'houseNumber')}
                        {field('Postcode', 'postalCode')}
                        {field('Stad', 'city')}
                        {field('Land', 'country')}
                    </div>
                    <div className="actions">
                        <button onClick={handleSave}>Opslaan</button>
                        <button className="btn-secondary" onClick={() => setEditing(false)}>Annuleren</button>
                    </div>
                </div>
            ) : (
                <div className="info-card">
                    <h2>Gegevens</h2>
                    <div className="info-grid">
                        <div><strong>Email:</strong> {profile.email || '-'}</div>
                        <div><strong>Geboortedatum:</strong> {formatDateNL(profile.birthDate)}</div>
                        <div><strong>Straat:</strong> {profile.street || '-'} {profile.houseNumber || ''}</div>
                        <div><strong>Postcode:</strong> {profile.postalCode || '-'}</div>
                        <div><strong>Stad:</strong> {profile.city || '-'}</div>
                        <div><strong>Land:</strong> {profile.country || '-'}</div>
                    </div>
                    <div className="actions">
                        <button onClick={() => setEditing(true)}>Gegevens bewerken</button>
                    </div>
                </div>
            )}

            {parents?.length > 0 && (
                <div className="section">
                    <h2>Ouders</h2>
                    <div className="cards-container">
                        {parents.map((p, i) => (
                            <div key={i} className="person-card">
                                <div>
                                    <div className="card-name">{p.firstName} {p.infix} {p.lastName}</div>
                                    <div className="card-role">{p.email}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}