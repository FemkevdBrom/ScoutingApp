import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PersonCard from "../../components/GroupPage/PersonCard";

describe("PersonCard", () => {

    const mockClick = jest.fn();

    const person = {
        fullName: "Jan Jansen",
        role: "TEAMLEIDER",
        age: 32
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders full name", () => {

        render(
            <PersonCard
                person={person}
            />
        );

        expect(
            screen.getByText("Jan Jansen")
        ).toBeInTheDocument();

    });

    test("renders role", () => {

        render(
            <PersonCard
                person={person}
            />
        );

        expect(
            screen.getByText("TEAMLEIDER · 32 jaar")
        ).toBeInTheDocument();

    });

    test("renders role without age", () => {

        render(
            <PersonCard
                person={{
                    fullName: "Jan Jansen",
                    role: "LEIDER"
                }}
            />
        );

        expect(
            screen.getByText("LEIDER")
        ).toBeInTheDocument();

    });

    test("does not render role when role is missing", () => {

        render(
            <PersonCard
                person={{
                    fullName: "Jan Jansen"
                }}
            />
        );

        expect(
            screen.queryByText(/jaar/)
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText("LEIDER")
        ).not.toBeInTheDocument();

    });

    test("shows arrow when clickable", () => {

        render(
            <PersonCard
                person={person}
                isClickable={true}
            />
        );

        expect(
            screen.getByText("→")
        ).toBeInTheDocument();

    });

    test("does not show arrow when not clickable", () => {

        render(
            <PersonCard
                person={person}
                isClickable={false}
            />
        );

        expect(
            screen.queryByText("→")
        ).not.toBeInTheDocument();

    });

    test("calls onClick when clickable", () => {

        render(
            <PersonCard
                person={person}
                isClickable={true}
                onClick={mockClick}
            />
        );

        fireEvent.click(
            screen.getByText("Jan Jansen")
        );

        expect(mockClick).toHaveBeenCalledTimes(1);

    });

    test("does not call onClick when not clickable", () => {

        render(
            <PersonCard
                person={person}
                isClickable={false}
                onClick={mockClick}
            />
        );

        fireEvent.click(
            screen.getByText("Jan Jansen")
        );

        expect(mockClick).not.toHaveBeenCalled();

    });

    test("adds clickable class when clickable", () => {

        render(
            <PersonCard
                person={person}
                isClickable={true}
            />
        );

        const card = screen.getByText("Jan Jansen").closest(".person-card");

        expect(card).toHaveClass("clickable");

    });

    test("does not add clickable class when not clickable", () => {

        render(
            <PersonCard
                person={person}
                isClickable={false}
            />
        );

        const card = screen.getByText("Jan Jansen").closest(".person-card");

        expect(card).not.toHaveClass("clickable");

    });

});