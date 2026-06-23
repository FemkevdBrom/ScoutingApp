import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../../components/Header/Header";
import { AuthContext } from "../../context/AuthContext";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

describe("Header", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderHeader = (user = null) => {

        return render(
            <AuthContext.Provider value={{ user }}>
                <Header />
            </AuthContext.Provider>
        );

    };

    test("renders application title", () => {

        renderHeader();

        expect(
            screen.getByText("Scouting App")
        ).toBeInTheDocument();

    });

    test("does not show welcome button when user is not logged in", () => {

        renderHeader();

        expect(
            screen.queryByRole("button")
        ).not.toBeInTheDocument();

    });

    test("shows welcome button when user is logged in", () => {

        renderHeader({
            firstName: "Nick"
        });

        expect(
            screen.getByRole("button", {
                name: "Welkom, Nick"
            })
        ).toBeInTheDocument();

    });

    test("shows correct user name", () => {

        renderHeader({
            firstName: "Femke"
        });

        expect(
            screen.getByText("Welkom, Femke")
        ).toBeInTheDocument();

    });

    test("clicking title navigates to home", () => {

        renderHeader({
            firstName: "Nick"
        });

        fireEvent.click(
            screen.getByText("Scouting App")
        );

        expect(mockNavigate).toHaveBeenCalledWith("/home");

    });

    test("clicking welcome button navigates to profile", () => {

        renderHeader({
            firstName: "Nick"
        });

        fireEvent.click(
            screen.getByText("Welkom, Nick")
        );

        expect(mockNavigate).toHaveBeenCalledWith("/profile");

    });

    test("title is always visible", () => {

        renderHeader({
            firstName: "Nick"
        });

        expect(
            screen.getByText("Scouting App")
        ).toBeInTheDocument();

    });

});