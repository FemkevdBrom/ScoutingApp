function MembersTable({ members }) {

    if (!members || members.length === 0) {
        return <div className="card">Geen leden gevonden</div>;
    }

    return (
        <div className="card">
            <h2>Leden</h2>

            <table>
                <thead>
                <tr>
                    <th>Naam</th>
                    <th>Geboortedatum</th>
                    <th>Leeftijd</th>
                </tr>
                </thead>

                <tbody>
                {members.map((m, i) => (
                    <tr key={i}>
                        <td>{m.fullName}</td>
                        <td>{formatDate(m.birthDate)}</td>
                        <td>{m.age}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

const formatDate = (date) =>
    new Date(date).toLocaleDateString();

export default MembersTable;