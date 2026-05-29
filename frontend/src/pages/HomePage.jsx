import React, {useEffect, useState} from "react";
import DashboardCard from "../components/DashboardCard/DashboardCard";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8080/api/groups/my")
            .then((res) => res.json())
            .then((data) => {
                const mappedGroups = data.map((g) => ({
                    title: g.name,
                    subtitle: g.description,
                    color: g.colorHex,
                    onClick: () => navigate(`/groups/${g.id}`),
                }));

                setGroups(mappedGroups);
            })
            .catch((err) => console.error("Error fetching groups:", err));
    }, [navigate]);
    return (
        <div className="HomePage">
        <h2>Welcome,</h2>
            <div className="dashboard">
                <DashboardCard title="Opkomende agenda items" items={[]} />
                <DashboardCard title="Berichten" items={[]} />
                <DashboardCard title="Mijn groepen" items={groups} />
            </div>
        </div>
    );
}