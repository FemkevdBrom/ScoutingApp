import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useAuthMutation } from '../hooks/useAuthMutation';

export default function GroupEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: groupData } = useAuthFetch(`${process.env.REACT_APP_API_URL}/api/groups/${id}`);
    const { mutate, loading: saving } = useAuthMutation();

    const [form, setForm] = useState({
        name: '', description: '', groupEmail: '', groupAge: '',
        groupType: '', groupStatus: '', color: ''
    });

    useEffect(() => {
        if (groupData) {
            setForm({
                name: groupData.groupName || '',
                description: groupData.info?.description || '',
                groupEmail: groupData.info?.groupEmail || '',
                groupAge: groupData.info?.groupAge || '',
                groupType: groupData.info?.groupType || '',
                groupStatus: groupData.info?.groupStatus || '',
                color: groupData.colorHex || '',
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
        <div className="group-edit-page">
            <button onClick={() => navigate(-1)}>← Terug</button>
            <h1>Groepsgegevens aanpassen</h1>

            <label>Naam <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></label>
            <label>Beschrijving <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></label>
            <label>Email <input value={form.groupEmail} onChange={e => setForm({...form, groupEmail: e.target.value})} /></label>
            <label>Leeftijd <input value={form.groupAge} onChange={e => setForm({...form, groupAge: e.target.value})} /></label>
            <label>Kleur <input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} /></label>

            <button onClick={handleSave} disabled={saving}>
                {saving ? "Bezig met opslaan..." : "Opslaan"}
            </button>
        </div>
    );
}