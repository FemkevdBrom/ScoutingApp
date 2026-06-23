import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LeadersTable from "../../components/GroupPage/LeadersTable";

describe("LeadersTable", () => {

    const leaders = [
        {
            fullName: "Jan Jansen",
            role: "TEAMLEIDER",
            birthDate: "1990-05-15",
            age: 35
        },
        {
            fullName: "Piet Peters",
            role: "LEIDER",
            birthDate: "1995-01-10",
            age: 30
        }
    ];

    test("shows message when there are no leaders", () => {

        render(<LeadersTable leaders={[]} />);

        expect(
            screen.getByText("Geen leiding gevonden")
        ).toBeInTheDocument();

    });

    test("shows message when leaders is null", () => {

        render(<LeadersTable leaders={null} />);

        expect(
            screen.getByText("Geen leiding gevonden")
        ).toBeInTheDocument();

    });

    test("renders title", () => {

        render(<LeadersTable leaders={leaders} />);

        expect(
            screen.getByText("Leiding")
        ).toBeInTheDocument();

    });

    test("renders table headers", () => {

        render(<LeadersTable leaders={leaders} />);

        expect(screen.getByText("Naam")).toBeInTheDocument();
        expect(screen.getByText("Rol")).toBeInTheDocument();
        expect(screen.getByText("Geboortedatum")).toBeInTheDocument();
        expect(screen.getByText("Leeftijd")).toBeInTheDocument();

    });

    test("renders all leaders", () => {

        render(<LeadersTable leaders={leaders} />);

        expect(
            screen.getByText("Jan Jansen")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Piet Peters")
        ).toBeInTheDocument();

    });

    test("renders all roles", () => {

        render(<LeadersTable leaders={leaders} />);

        expect(
            screen.getByText("TEAMLEIDER")
        ).toBeInTheDocument();

        expect(
            screen.getByText("LEIDER")
        ).toBeInTheDocument();

    });

    test("renders ages", () => {

        render(<LeadersTable leaders={leaders} />);

        expect(
            screen.getByText("35")
        ).toBeInTheDocument();

        expect(
            screen.getByText("30")
        ).toBeInTheDocument();

    });

    test("formats birth dates", () => {

        render(<LeadersTable leaders={leaders} />);

        const formattedDate = new Date("1990-05-15").toLocaleDateString();

        expect(
            screen.getByText(formattedDate)
        ).toBeInTheDocument();

    });

    test("renders correct number of rows", () => {

        render(<LeadersTable leaders={leaders} />);

        const rows = screen.getAllByRole("row");

        // 1 header + 2 leaders
        expect(rows).toHaveLength(3);

    });

});