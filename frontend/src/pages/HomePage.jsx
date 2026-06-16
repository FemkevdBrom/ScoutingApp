import React, { useContext } from "react";
import DashboardCard from "../components/DashboardCard/DashboardCard";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useAuthFetch } from "../hooks/useAuthFetch";

export default function HomePage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Gebruik de hook om groepen op te halen
    const { data: groupsData, loading: groupsLoading, error: groupsError } = useAuthFetch(
        user?.id
            ? `${process.env.REACT_APP_API_URL}/api/groups/my?userId=${user.id}`
            : null
    );

    // Mapping van backend data naar DashboardCard formaat
    const mappedGroups = groupsData?.map((g) => ({
        title: g.name,
        subtitle: g.description,
        color: g.colorHex,
        onClick: () => navigate(`/groups/${g.id}`),
    })) || [];

    if (!user) {
        return <div>Laden...</div>;
    }

    if (groupsLoading) {
        return <div>Groepen worden geladen...</div>;
    }

    if (groupsError) {
        return <div>Fout bij ophalen groepen: {groupsError}</div>;
    }

    return (
        <div className="HomePage">
            <h2>Welcome, {user.firstName}!</h2>

            <div className="dashboard">
                <DashboardCard
                    title="Opkomende agenda items"
                    items={[]}
                />

                <DashboardCard
                    title="Berichten"
                    items={[]}
                />

                <DashboardCard
                    title="Mijn groepen"
                    items={mappedGroups}
                />
            </div>
        </div>
    );
}