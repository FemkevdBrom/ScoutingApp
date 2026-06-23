import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GroupInfoCard from "../../components/GroupPage/GroupInfoCard";

describe("GroupInfoCard", () => {

    const group = {
        info: {
            groupDescription: "Leuke scoutinggroep",
            groupEmail: "groep@test.nl",
            groupType: "LANDSCOUTS",
            groupAge: "7-11",
            groupStatus: "ACTIEF"
        }
    };

    test("renders title", () => {

        render(<GroupInfoCard group={group} />);

        expect(
            screen.getByText("Groepsinformatie")
        ).toBeInTheDocument();

    });

    test("renders description", () => {

        render(<GroupInfoCard group={group} />);

        expect(
            screen.getByText("Leuke scoutinggroep")
        ).toBeInTheDocument();

    });

    test("renders email", () => {

        render(<GroupInfoCard group={group} />);

        expect(
            screen.getByText("groep@test.nl")
        ).toBeInTheDocument();

    });

    test("renders group type", () => {

        render(<GroupInfoCard group={group} />);

        expect(
            screen.getByText("LANDSCOUTS")
        ).toBeInTheDocument();

    });

    test("renders age group", () => {

        render(<GroupInfoCard group={group} />);

        expect(
            screen.getByText("7-11")
        ).toBeInTheDocument();

    });

    test("renders status", () => {

        render(<GroupInfoCard group={group} />);

        expect(
            screen.getByText("ACTIEF")
        ).toBeInTheDocument();

    });

    test("does not render description when description is '-'", () => {

        render(
            <GroupInfoCard
                group={{
                    info: {
                        ...group.info,
                        groupDescription: "-"
                    }
                }}
            />
        );

        expect(
            screen.queryByText("-")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText("Leuke scoutinggroep")
        ).not.toBeInTheDocument();

    });

    test("shows '-' when email is missing", () => {

        render(
            <GroupInfoCard
                group={{
                    info: {
                        ...group.info,
                        groupEmail: ""
                    }
                }}
            />
        );

        const values = screen.getAllByText("-");

        expect(values.length).toBeGreaterThan(0);

    });

    test("shows '-' when type is missing", () => {

        render(
            <GroupInfoCard
                group={{
                    info: {
                        ...group.info,
                        groupType: ""
                    }
                }}
            />
        );

        expect(
            screen.getAllByText("-").length
        ).toBeGreaterThan(0);

    });

    test("shows '-' when age is missing", () => {

        render(
            <GroupInfoCard
                group={{
                    info: {
                        ...group.info,
                        groupAge: ""
                    }
                }}
            />
        );

        expect(
            screen.getAllByText("-").length
        ).toBeGreaterThan(0);

    });

    test("shows '-' when status is missing", () => {

        render(
            <GroupInfoCard
                group={{
                    info: {
                        ...group.info,
                        groupStatus: ""
                    }
                }}
            />
        );

        expect(
            screen.getAllByText("-").length
        ).toBeGreaterThan(0);

    });

});