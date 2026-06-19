import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useAuthMutation } from '../hooks/useAuthMutation';
import './ProfilePage.css';

const GROUP_TYPES = ['LANDSCOUTS', 'WATERSCOUTS', 'LUCHTSCOUTS'];
const GROUP_STATUSES = ['ACTIEF', 'INACTIEF'];
const GROUP_GENDERS = ['VROUWELIJK', 'MANNELIJK', 'GEMENGD'];
const GROUP_AGES = ['_4_7', '_7_11', '_11_15', '_15_18', '_18_21', '_18_PLUS', '_21_PLUS', 'NVT'];

const formatAgeLabel = (age) => age.replace(/^_/, '').replace(/_/g, ' - ').replace('PLUS', '+');

export default function GroupEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: groupData } = useAuthFetch(`${process.env.REACT_APP_API_URL}/api/groups/${id}`);
    const { mutate, loading: saving } = useAuthMutation();

    const [form, setForm] = useState({
        name: '', description: '', groupEmail: '', groupAge: '',
        groupType: '', groupStatus: '', groupGender: '', color: '#2f4f6f'
    });

    useEffect(() => {
        if (groupData) {
            setForm({
                name: groupData.groupName || '',
                description: groupData.info?.groupDescription === '-' ? '' : (groupData.info?.groupDescription || ''),
                groupEmail: groupData.info?.groupEmail === '-' ? '' : (groupData.info?.groupEmail || ''),
                groupAge: groupData.info?.groupAge === '-' ? '' : (groupData.info?.groupAge || ''),
                groupType: groupData.info?.groupType === '-' ? '' : (groupData.info?.groupType || ''),
                groupStatus: groupData.info?.groupStatus === '-' ? '' : (groupData.info?.groupStatus || ''),
                groupGender: groupData.info?.groupGender === '-' ? '' : (groupData.info?.groupGender || ''),
                color: groupData.colorHex || '#2f4f6f',
            });
        }
    }, [groupData]);

    const handleSave = async () => {
        try {
            await mutate(`${process.env.REACT_APP_API_URL}/api/groups/${id}`, {
                method: 'PUT',
                body: JSON.stringify(form)
            });
            navigate(`/groups/${id}`);
        } catch (err) {
            alert('Opslaan mislukt: ' + err.message);
        }
    };

    return (
        <div className="profile-page">
            <button className="back-btn" onClick={() => navigate(-1)}>← Terug</button>
            <h1 className="profile-title">Groepsgegevens aanpassen</h1>

            <div className="info-card">
                <div className="edit-form">
                    <label>Naam
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </label>
                    <label>Beschrijving
                        <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </label>
                    <label>Email
                        <input value={form.groupEmail} onChange={e => setForm({ ...form, groupEmail: e.target.value })} />
                    </label>
                    <label>Leeftijd
                        <select value={form.groupAge} onChange={e => setForm({ ...form, groupAge: e.target.value })}>
                            <option value="">-- Kies --</option>
                            {GROUP_AGES.map(a => (
                                <option key={a} value={a}>{formatAgeLabel(a)}</option>
                            ))}
                        </select>
                    </label>
                    <label>Type
                        <select value={form.groupType} onChange={e => setForm({ ...form, groupType: e.target.value })}>
                            <option value="">-- Kies --</option>
                            {GROUP_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </label>
                    <label>Status
                        <select value={form.groupStatus} onChange={e => setForm({ ...form, groupStatus: e.target.value })}>
                            <option value="">-- Kies --</option>
                            {GROUP_STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </label>
                    <label>Geslacht
                        <select value={form.groupGender} onChange={e => setForm({ ...form, groupGender: e.target.value })}>
                            <option value="">-- Kies --</option>
                            {GROUP_GENDERS.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </label>
                    <label>Kleur
                        <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
                    </label>
                </div>

                <div className="actions">
                    <button onClick={handleSave} disabled={saving}>
                        {saving ? "Bezig met opslaan..." : "Opslaan"}
                    </button>
                    <button className="btn-secondary" onClick={() => navigate(-1)}>Annuleren</button>
                </div>
            </div>
        </div>
    );
}