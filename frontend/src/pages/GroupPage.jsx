import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

export default function GroupPage() {
    const {id} = useParams();
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);

    useEffect(() => {
        if (!user?.token) return;
        fetch(`${process.env.REACT_APP_API_URL}/api/groups/${id}`, {
            headers: {Authorization: `Bearer ${user.token}`}
        })
            .then(res => res.json())
            .then(data => setGroup(data));
    }, [id, user]);

    if (!group) return <div>Laden...</div>;

    const role = group.userRole?.toUpperCase();
    const isLeider = role === 'LEIDER' || role === 'TEAMLEIDER';
    const isTeamleider = role === 'TEAMLEIDER';

    return (
        <div className="group-page">
            <h1>{group.groupName}</h1>

            <section>
                <h2>Groepsinformatie</h2>
                <p>Email: {group.info?.groupEmail}</p>
                <p>Type: {group.info?.groupType}</p>
                <p>Leeftijd: {group.info?.groupAge}</p>
                <p>Status: {group.info?.groupStatus}</p>
                <p>Beschrijving: {group.info?.description}</p>
            </section>

            <section>
                <h2>Leiding</h2>
                <ul>
                    {group.leaders?.map((l, i) => (
                        <li
                            key={i}
                            onClick={() => isTeamleider && navigate(`/users/${l.id}`)}
                            style={{cursor: isTeamleider ? 'pointer' : 'default'}}
                        >
                            {l.fullName} — {l.role}
                        </li>
                    ))}
                </ul>
            </section>

            {isLeider && (
                <section>
                    <h2>Leden</h2>
                    <ul>
                        {group.members?.map((m, i) => (
                            <li
                                key={i}
                                onClick={() => isTeamleider && navigate(`/users/${m.id}`)}
                                style={{cursor: isTeamleider ? 'pointer' : 'default'}}
                            >
                                {m.fullName}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {isTeamleider && (
                <section>
                    <button onClick={() => navigate(`/groups/${id}/edit`)}>
                        Groepsgegevens aanpassen
                    </button>
                    <button onClick={() => navigate(`/groups/${id}/members`)}>
                        Leden beheren
                    </button>
                </section>
            )}
        </div>
    );
}