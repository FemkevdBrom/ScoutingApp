import React, {useEffect, useState} from "react";
import DashboardCard from "../components/DashboardCard/DashboardCard";
import "./HomePage.css";


export default function HomePage() {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/groups/my")
            .then((res) => res.json())
            .then((data) => {
                // 🔥 omzetten naar jouw UI format
                const mappedGroups = data.map((g) => ({
                    title: g.name,
                    subtitle: g.description, // jij hebt deze ook in DB 👀 nice
                    color: g.colorHex,
                    onClick: () => {
                        console.log("Klik op groep:", g.id);
                        // later: navigate(`/groups/${g.id}`)
                    },
                }));

                setGroups(mappedGroups);
            })
            .catch((err) => console.error("Error fetching groups:", err));
    }, []);

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