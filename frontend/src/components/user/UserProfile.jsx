import React, { useEffect, useState } from "react";
import { getUserById } from "../../services/UserService";
import "./UserProfile.css";

const Field = ({ label, value }) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <div className="field-box">
                {value || "-"}
            </div>
        </div>
    );
};

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserById(1); // tijdelijk ID = 1
                setUser(data);
            } catch (error) {
                console.error(error);
                setError("Failed to load user");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!user) return <p>No user found</p>;


    return (
        <div className="profile-container">


            {/* BUTTON */}
            <div className="edit-container">
                <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
                    Edit
                </button>
            </div>

            {/* ACCOUNT */}
            <div className="card">
                <h3>Account gegevens</h3>

                <div className="form-row three">
                    <Field label="Voornaam" value={user.firstName} />
                    <Field label="Tussenvoegsel(s)" value={user.infix} />
                    <Field label="Achternaam" value={user.lastName} />
                </div>

                <div className="form-row two">
                    <Field label="Geboortedatum" value={user.birthDate} />
                    <Field label="Leeftijd" value={user.age} />
                </div>

                <div className="form-row one">
                    <Field label="Email" value={user.email} />
                </div>

                <div className="form-row two">
                    <Field label="Telefoonnummer" value={user.phone} />
                    <Field label="Lidnummer" value={user.memberNumber} />
                </div>

                <div className="form-row one">
                    <Field label="Persoonsnummer" value={user.personalNumber} />
                </div>
            </div>

            {/* ADRES */}
            <div className="card">
                <h3>Adres</h3>

                <div className="form-row three">
                    <Field label="Straatnaam" value={user.street} />
                    <Field label="Huisnummer" value={user.houseNumber} />
                    <Field label="Toevoeging" value={user.addition} />
                </div>

                <div className="form-row two">
                    <Field label="Gemeente" value={user.city} />
                    <Field label="Postcode" value={user.zipCode} />
                </div>

                <div className="form-row one">
                    <Field label="Land" value={user.country} />
                </div>
            </div>

            {/* GROEPEN */}
            <div className="card">
                <h3>Groepen</h3>

                <div className="form-row one">
                    <Field label="Scoutinggroep" value={user.groupName} />
                    <Field label="Lid van" value={user.memberOf} />
                    <Field label="Leiding van" value={user.leaderOf} />
                </div>
            </div>

        </div>
    );
};

export default UserProfile;
