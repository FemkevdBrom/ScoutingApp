import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function GroupEditPage() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '', description: '', groupEmail: '', groupAge: '', groupType: '', groupStatus: '', color: ''
    });

    useEffect(() => {
        if (!user?.token) return;
        fetch(`${process.env.REACT_APP_API_URL}/api/groups/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
            .then(res => res.json())
            .then(data => setForm({
                name: data.groupName || '',
                description: data.info?.description || '',
                groupEmail: data.info?.groupEmail || '',
                groupAge: data.info?.groupAge || '',
                groupType: data.info?.groupType || '',
                groupStatus: data.info?.groupStatus || '',
                color: ''
            }));
    }, [id, user]);

    const handleSave = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/groups/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify(form)
        }).then(() => navigate(`/groups/${id}`));
    };

    return (
        <div className="group-edit-page">
            <button onClick={() => navigate(-1)}>← Terug</button>
            <h1>Groepsgegevens aanpassen</h1>

            <label>Naam
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </label>
            <label>Beschrijving
                <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </label>
            <label>Email
                <input value={form.groupEmail} onChange={e => setForm({...form, groupEmail: e.target.value})} />
            </label>
            <label>Leeftijd
                <input value={form.groupAge} onChange={e => setForm({...form, groupAge: e.target.value})} />
            </label>
            <label>Kleur
                <input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
            </label>

            <button onClick={handleSave}>Opslaan</button>
        </div>
    );
}