import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfilePage from "../../pages/ProfilePage";
import { AuthContext } from "../../context/AuthContext";
import { useAuthFetch } from "../../hooks/useAuthFetch";

jest.mock("../../hooks/useAuthFetch");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

describe("ProfilePage", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const user = {
        id: 1,
        firstName: "Nick",
        infix: "",
        lastName: "Jansen",
        email: "nick@test.nl",
        birthDate: "2000-05-15",
        street: "Dorpsstraat",
        houseNumber: "10",
        postalCode: "1234AB",
        city: "Eindhoven",
        country: "Nederland"
    };

    const renderPage = (currentUser = user, groups = []) => {

        useAuthFetch.mockReturnValue({
            data: groups
        });

        return render(
            <AuthContext.Provider value={{ user: currentUser }}>
                <ProfilePage />
            </AuthContext.Provider>
        );

    };

    test("shows loading when user is null", () => {

        renderPage(null);

        expect(
            screen.getByText("Laden...")
        ).toBeInTheDocument();

    });

    test("renders full name", () => {

        renderPage();

        expect(
            screen.getByText("Nick Jansen")
        ).toBeInTheDocument();

    });

    test("renders email", () => {

        renderPage();

        expect(
            screen.getByText(/nick@test.nl/i)
        ).toBeInTheDocument();

    });

    test("renders formatted birth date", () => {

        renderPage();

        expect(
            screen.getByText("15-05-2000")
        ).toBeInTheDocument();

    });

    test("renders address", () => {

        renderPage();

        expect(
            screen.getByText(/Dorpsstraat/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/1234AB/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Eindhoven/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Nederland/i)
        ).toBeInTheDocument();

    });

    test("shows placeholders when data is missing", () => {

        renderPage({
            ...user,
            email: "",
            birthDate: "",
            street: "",
            postalCode: "",
            city: "",
            country: ""
        });

        expect(
            screen.getAllByText("-").length
        ).toBeGreaterThan(0);

    });

    test("does not render groups section when there are no groups", () => {

        renderPage(user, []);

        expect(
            screen.queryByText("Mijn groepen")
        ).not.toBeInTheDocument();

    });

    test("renders groups", () => {

        renderPage(user, [
            {
                id: 1,
                name: "Welpen Eindhoven",
                roleName: "LEIDER",
                colorHex: "#123456"
            },
            {
                id: 2,
                name: "Scouts Best",
                roleName: "TEAMLEIDER",
                colorHex: "#654321"
            }
        ]);

        expect(
            screen.getByText("Welpen Eindhoven")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Scouts Best")
        ).toBeInTheDocument();

    });

    test("renders role names", () => {

        renderPage(user, [
            {
                id: 1,
                name: "Welpen Eindhoven",
                roleName: "LEIDER",
                colorHex: "#123456"
            }
        ]);

        expect(
            screen.getByText("LEIDER")
        ).toBeInTheDocument();

    });

    test("navigates to group when group card is clicked", () => {

        renderPage(user, [
            {
                id: 7,
                name: "Welpen Eindhoven",
                roleName: "LEIDER",
                colorHex: "#123456"
            }
        ]);

        fireEvent.click(
            screen.getByText("Welpen Eindhoven")
        );

        expect(mockNavigate).toHaveBeenCalledWith("/groups/7");

    });

    test("calls useAuthFetch with correct user id", () => {

        renderPage();

        expect(useAuthFetch).toHaveBeenCalledWith(
            expect.stringContaining("/api/groups/my?userId=1")
        );

    });

});