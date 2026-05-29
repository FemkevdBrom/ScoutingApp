function LeadersTable({ leaders }) {

    if (!leaders || leaders.length === 0) {
        return <div className="card">Geen leiding gevonden</div>;
    }

    return (
        <div className="card">
            <h2>Leiding</h2>

            <table>
                <thead>
                <tr>
                    <th>Naam</th>
                    <th>Rol</th>
                    <th>Geboortedatum</th>
                    <th>Leeftijd</th>
                </tr>
                </thead>

                <tbody>
                {leaders.map((l, i) => (
                    <tr key={i}>
                        <td>{l.fullName}</td>
                        <td>{l.role}</td>
                        <td>{formatDate(l.birthDate)}</td>
                        <td>{l.age}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
const formatDate = (date) =>
new Date(date).toLocaleDateString();
export default LeadersTable;