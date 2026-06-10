import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Wachtwoord eisen — zelfde regex als de backend
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
// Email formaat
const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.(nl|com|org|net|be|de|eu)$/;

function RegisterPage() {
    const navigate = useNavigate();

    // Formulier state
    const [form, setForm] = useState({
        firstName:      "",
        infix:          "",
        lastName:       "",
        birthDate:      "",
        email:          "",
        password:       "",
        passwordCheck:  "",
        street:         "",
        houseNumber:    "",
        postalCode:     "",
        city:           "",
        country:        "Nederland",
        scoutingGroupId: "",
    });

    const [scoutingGroups, setScoutingGroups] = useState([]);
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [success, setSuccess]   = useState(false);

    // Haal scoutinggroepen op voor de dropdown
    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVICE_URL}/auth/scouting-groups`)
            .then((res) => res.json())
            .then((data) => setScoutingGroups(data))
            .catch(() => setApiError("Kon scoutinggroepen niet ophalen"));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Verwijder de foutmelding voor dit veld zodra de gebruiker typt
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // Valideer het formulier aan de frontend kant
    const validate = () => {
        const newErrors = {};

        if (!form.firstName.trim())    newErrors.firstName    = "Voornaam is verplicht";
        if (!form.lastName.trim())     newErrors.lastName     = "Achternaam is verplicht";
        if (!form.birthDate)           newErrors.birthDate    = "Geboortedatum is verplicht";
        if (!form.street.trim())       newErrors.street       = "Straat is verplicht";
        if (!form.houseNumber.trim())  newErrors.houseNumber  = "Huisnummer is verplicht";
        if (!form.postalCode.trim())   newErrors.postalCode   = "Postcode is verplicht";
        if (!form.city.trim())         newErrors.city         = "Stad is verplicht";
        if (!form.country.trim())      newErrors.country      = "Land is verplicht";
        if (!form.scoutingGroupId)     newErrors.scoutingGroupId = "Kies een scoutinggroep";

        if (!form.email) {
            newErrors.email = "Email is verplicht";
        } else if (!EMAIL_REGEX.test(form.email)) {
            newErrors.email = "Ongeldig emailformaat (bijv. naam@voorbeeld.nl)";
        }

        if (!form.password) {
            newErrors.password = "Wachtwoord is verplicht";
        } else if (!PASSWORD_REGEX.test(form.password)) {
            newErrors.password =
                "Wachtwoord moet minimaal 8 tekens bevatten, met minstens 1 hoofdletter, 1 kleine letter, 1 cijfer en 1 speciaal teken";
        }

        if (form.password !== form.passwordCheck) {
            newErrors.passwordCheck = "Wachtwoorden komen niet overeen";
        }

        return newErrors;
    };

    const handleRegister = async () => {
        setApiError("");
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const { passwordCheck, ...payload } = form; // passwordCheck niet naar backend sturen
            payload.scoutingGroupId = Number(payload.scoutingGroupId);

            const response = await fetch(`${process.env.REACT_APP_SERVICE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg || "Registratie mislukt");
            }

            setSuccess(true);
            setTimeout(() => navigate("/"), 2000); // Terug naar login na 2 seconden
        } catch (err) {
            setApiError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div>
                <h2>Registratie gelukt!</h2>
                <p>Je wordt doorgestuurd naar de loginpagina...</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Registreren</h2>

            {/* Persoonsgegevens */}
            <h3>Persoonsgegevens</h3>

            <label>Voornaam *</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} />
            {errors.firstName && <p style={{ color: "red" }}>{errors.firstName}</p>}

            <label>Tussenvoegsel</label>
            <input name="infix" value={form.infix} onChange={handleChange} />

            <label>Achternaam *</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} />
            {errors.lastName && <p style={{ color: "red" }}>{errors.lastName}</p>}

            <label>Geboortedatum *</label>
            <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
            {errors.birthDate && <p style={{ color: "red" }}>{errors.birthDate}</p>}

            {/* Adres */}
            <h3>Adres</h3>

            <label>Straat *</label>
            <input name="street" value={form.street} onChange={handleChange} />
            {errors.street && <p style={{ color: "red" }}>{errors.street}</p>}

            <label>Huisnummer *</label>
            <input name="houseNumber" value={form.houseNumber} onChange={handleChange} />
            {errors.houseNumber && <p style={{ color: "red" }}>{errors.houseNumber}</p>}

            <label>Postcode *</label>
            <input name="postalCode" value={form.postalCode} onChange={handleChange} />
            {errors.postalCode && <p style={{ color: "red" }}>{errors.postalCode}</p>}

            <label>Stad *</label>
            <input name="city" value={form.city} onChange={handleChange} />
            {errors.city && <p style={{ color: "red" }}>{errors.city}</p>}

            <label>Land *</label>
            <input name="country" value={form.country} onChange={handleChange} />
            {errors.country && <p style={{ color: "red" }}>{errors.country}</p>}

            {/* Account */}
            <h3>Accountgegevens</h3>

            <label>Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

            <label>Wachtwoord *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} />
            {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

            <label>Herhaal wachtwoord *</label>
            <input type="password" name="passwordCheck" value={form.passwordCheck} onChange={handleChange} />
            {errors.passwordCheck && <p style={{ color: "red" }}>{errors.passwordCheck}</p>}

            {/* Scoutinggroep */}
            <h3>Scoutinggroep</h3>

            <label>Scoutinggroep *</label>
            <select name="scoutingGroupId" value={form.scoutingGroupId} onChange={handleChange}>
                <option value="">-- Kies een scoutinggroep --</option>
                {scoutingGroups.map((sg) => (
                    <option key={sg.id} value={sg.id}>
                        {sg.name}{sg.city ? ` (${sg.city})` : ""}
                    </option>
                ))}
            </select>
            {errors.scoutingGroupId && <p style={{ color: "red" }}>{errors.scoutingGroupId}</p>}

            {apiError && <p style={{ color: "red" }}>{apiError}</p>}

            <br />
            <button onClick={handleRegister} disabled={loading}>
                {loading ? "Bezig met registreren..." : "Registreren"}
            </button>

            <button onClick={() => navigate("/")} style={{ marginLeft: "8px" }}>
                Terug naar inloggen
            </button>
        </div>
    );
}

export default RegisterPage;