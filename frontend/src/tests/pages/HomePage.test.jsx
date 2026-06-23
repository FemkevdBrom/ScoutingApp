import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePage from "../../pages/HomePage";
import { AuthContext } from "../../context/AuthContext";
import { useAuthFetch } from "../../hooks/useAuthFetch";

jest.mock("../../hooks/useAuthFetch");

jest.mock("../../components/DashboardCard/DashboardCard", () => ({ title, items }) => (
    <div data-testid="dashboard-card">
        <h3>{title}</h3>

        {items?.map((item, index) => (
            <div key={index}>{item.title}</div>
        ))}
    </div>
));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate
}));

describe("HomePage", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderPage = (user, groupsData = [], loading = false, error = null) => {

        useAuthFetch.mockReturnValue({
            data: groupsData,
            loading,
            error
        });

        return render(
            <AuthContext.Provider value={{ user }}>
                <HomePage />
            </AuthContext.Provider>
        );
    };

    test("shows loading when user is null", () => {

        renderPage(null);

        expect(screen.getByText("Laden...")).toBeInTheDocument();

    });

    test("shows loading while groups are loading", () => {

        renderPage(
            {
                id: 1,
                firstName: "Nick"
            },
            [],
            true
        );

        expect(screen.getByText("Groepen worden geladen...")).toBeInTheDocument();

    });

    test("shows error when loading groups fails", () => {

        renderPage(
            {
                id: 1,
                firstName: "Nick"
            },
            [],
            false,
            "Server fout"
        );

        expect(
            screen.getByText("Fout bij ophalen groepen: Server fout")
        ).toBeInTheDocument();

    });

    test("shows welcome message", () => {

        renderPage({
            id: 1,
            firstName: "Nick"
        });

        expect(
            screen.getByText("Welcome, Nick!")
        ).toBeInTheDocument();

    });

    test("renders three dashboard cards", () => {

        renderPage({
            id: 1,
            firstName: "Nick"
        });

        expect(
            screen.getAllByTestId("dashboard-card")
        ).toHaveLength(3);

    });

    test("renders dashboard titles", () => {

        renderPage({
            id: 1,
            firstName: "Nick"
        });

        expect(
            screen.getByText("Opkomende agenda items")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Berichten")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Mijn groepen")
        ).toBeInTheDocument();

    });

    test("shows fetched groups", () => {

        renderPage(
            {
                id: 1,
                firstName: "Nick"
            },
            [
                {
                    id: 10,
                    name: "Welpen Eindhoven",
                    description: "Beschrijving",
                    colorHex: "#123456"
                },
                {
                    id: 11,
                    name: "Scouts Best",
                    description: "Beschrijving",
                    colorHex: "#654321"
                }
            ]
        );

        expect(
            screen.getByText("Welpen Eindhoven")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Scouts Best")
        ).toBeInTheDocument();

    });

    test("calls useAuthFetch with correct url", () => {

        renderPage({
            id: 15,
            firstName: "Nick"
        });

        expect(useAuthFetch).toHaveBeenCalledWith(
            expect.stringContaining("/api/groups/my?userId=15")
        );

    });

});