import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GroupInfo from "../../components/GroupPage/GroupInfo";

describe("GroupInfo", () => {

    const info = {
        description: "Leuke scoutinggroep",
        email: "groep@test.nl",
        groupType: "LANDSCOUTS",
        groupStatus: "ACTIEF",
        groupAge: "7-11",
        scoutingGroup: "Scouting Eindhoven"
    };

    test("shows message when no information is available", () => {

        render(<GroupInfo info={null} />);

        expect(
            screen.getByText("Geen groepsinformatie")
        ).toBeInTheDocument();

    });

    test("renders title", () => {

        render(<GroupInfo info={info} />);

        expect(
            screen.getByText("Groepsinformatie")
        ).toBeInTheDocument();

    });

    test("renders description", () => {

        render(<GroupInfo info={info} />);

        expect(
            screen.getByText("Leuke scoutinggroep")
        ).toBeInTheDocument();

    });

    test("renders email", () => {

        render(<GroupInfo info={info} />);

        expect(
            screen.getByText("groep@test.nl")
        ).toBeInTheDocument();

    });

    test("formats group type", () => {

        render(<GroupInfo info={info} />);

        expect(
            screen.getByText("Landscouts")
        ).toBeInTheDocument();

    });

    test("formats group status", () => {

        render(<GroupInfo info={info} />);

        expect(
            screen.getByText("Actief")
        ).toBeInTheDocument();

    });

    test("renders age group", () => {

        render(<GroupInfo info={info} />);

        expect(
            screen.getByText("7-11")
        ).toBeInTheDocument();

    });

    test("renders scouting group", () => {

        render(<GroupInfo info={info} />);

        expect(
            screen.getByText("Scouting Eindhoven")
        ).toBeInTheDocument();

    });

    test("shows '-' when scouting group is missing", () => {

        render(
            <GroupInfo
                info={{
                    ...info,
                    scoutingGroup: null
                }}
            />
        );

        const values = screen.getAllByText("-");

        expect(values.length).toBeGreaterThan(0);

    });

});