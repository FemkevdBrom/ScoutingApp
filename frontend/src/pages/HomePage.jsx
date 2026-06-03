import React, {useContext, useEffect, useState} from "react";
import DashboardCard from "../components/DashboardCard/DashboardCard";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

export default function HomePage() {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);

    useEffect(() => {
        console.log("=== HomePage Debug ===");
        console.log("User:", user);
        console.log("User ID:", user?.id);

        if (!user?.id) {
            console.log("Geen user ID gevonden, wachten...");
            return;
        }

        console.log(`Fetching groups for userId: ${user.id}`);

        fetch(`http://localhost:8080/api/groups/my?userId=${user.id}`)
            .then((res) => {
                console.log("Response status:", res.status);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                console.log("Groups ontvangen van backend:", data);
                const mappedGroups = data.map((g) => ({
                    title: g.name,
                    subtitle: g.description,
                    color: g.colorHex,
                    onClick: () => navigate(`/groups/${g.id}`),
                }));
                setGroups(mappedGroups);
            })
            .catch((err) => {
                console.error("Error fetching groups:", err);
            });
    }, [user, navigate]);

    if (!user) {
        return <div>Laden...</div>;
    }
    return (
        <div className="HomePage">
        <h2>Welcome, {user.firstName}!</h2>
            <div className="dashboard">
                <DashboardCard title="Opkomende agenda items" items={[]} />
                <DashboardCard title="Berichten" items={[]} />
                <DashboardCard title="Mijn groepen" items={groups} />
            </div>
        </div>
    );
}