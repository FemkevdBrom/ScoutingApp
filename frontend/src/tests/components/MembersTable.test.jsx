import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MembersTable from "../../components/GroupPage/MembersTable";

describe("MembersTable", () => {

    const members = [
        {
            fullName: "Lisa Jansen",
            birthDate: "2013-04-12",
            age: 12
        },
        {
            fullName: "Tom Peters",
            birthDate: "2012-08-20",
            age: 13
        }
    ];

    test("shows message when there are no members", () => {

        render(<MembersTable members={[]} />);

        expect(
            screen.getByText("Geen leden gevonden")
        ).toBeInTheDocument();

    });

    test("shows message when members is null", () => {

        render(<MembersTable members={null} />);

        expect(
            screen.getByText("Geen leden gevonden")
        ).toBeInTheDocument();

    });

    test("renders title", () => {

        render(<MembersTable members={members} />);

        expect(
            screen.getByText("Leden")
        ).toBeInTheDocument();

    });

    test("renders table headers", () => {

        render(<MembersTable members={members} />);

        expect(screen.getByText("Naam")).toBeInTheDocument();
        expect(screen.getByText("Geboortedatum")).toBeInTheDocument();
        expect(screen.getByText("Leeftijd")).toBeInTheDocument();

    });

    test("renders all members", () => {

        render(<MembersTable members={members} />);

        expect(
            screen.getByText("Lisa Jansen")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Tom Peters")
        ).toBeInTheDocument();

    });

    test("renders ages", () => {

        render(<MembersTable members={members} />);

        expect(
            screen.getByText("12")
        ).toBeInTheDocument();

        expect(
            screen.getByText("13")
        ).toBeInTheDocument();

    });

    test("formats birth date", () => {

        render(<MembersTable members={members} />);

        const formattedDate = new Date("2013-04-12").toLocaleDateString();

        expect(
            screen.getByText(formattedDate)
        ).toBeInTheDocument();

    });

    test("renders correct number of rows", () => {

        render(<MembersTable members={members} />);

        const rows = screen.getAllByRole("row");

        // 1 header + 2 members
        expect(rows).toHaveLength(3);

    });

});