function GroupInfo({ info }) {

    if (!info) {
        return <div className="card">Geen groepsinformatie</div>;
    }

    const format = (v) =>
        v ? v.charAt(0) + v.slice(1).toLowerCase() : "-";

    return (
        <div className="card">
            <h2>Groepsinformatie</h2>

            <p><strong>Beschrijving:</strong> {info.description}</p>
            <p><strong>Email:</strong> {info.email}</p>
            <p><strong>Type:</strong> {format(info.groupType)}</p>
            <p><strong>Status:</strong> {format(info.groupStatus)}</p>
            <p><strong>Leeftijdsgroep:</strong> {info.groupAge}</p>
            <p><strong>Scoutinggroep:</strong> {info.scoutingGroup || "-"}</p>
        </div>
    );
}

export default GroupInfo;