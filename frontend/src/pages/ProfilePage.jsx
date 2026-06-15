import React, {useContext} from "react";
import UserProfile from "../components/user/UserProfile";
import {AuthContext} from "../context/AuthContext";


export default function ProfilePage() {
    const {user} = useContext(AuthContext);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="profile-page">
            <h1>Mijn Profiel</h1>
            <table>
                <tbody>
                <tr><td>Naam</td><td>{user.firstName} {user.infix} {user.lastName}</td></tr>
                <tr><td>Email</td><td>{user.email}</td></tr>
                <tr><td>Geboortedatum</td><td>{user.birthDate}</td></tr>
                <tr><td>Straat</td><td>{user.street} {user.houseNumber}</td></tr>
                <tr><td>Postcode</td><td>{user.postalCode}</td></tr>
                <tr><td>Stad</td><td>{user.city}</td></tr>
                <tr><td>Land</td><td>{user.country}</td></tr>
                </tbody>
            </table>
        </div>
    );
}