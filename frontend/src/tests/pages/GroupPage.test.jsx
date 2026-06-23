import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GroupPage from "../../pages/GroupPage";
import { useAuthFetch } from "../../hooks/useAuthFetch";

jest.mock("../../hooks/useAuthFetch");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useParams: () => ({ id: "1" }),
    useNavigate: () => mockNavigate
}));

jest.mock("../../components/GroupPage/GroupInfoCard", () => ({ group }) => (
    <div data-testid="group-info-card">
        {group.groupName}
    </div>
));

jest.mock("../../components/GroupPage/PersonCard", () => ({ person, onClick }) => (
    <div
        data-testid="person-card"
        onClick={onClick}
    >
        {person.fullName}
    </div>
));

describe("GroupPage", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderPage = (group, loading = false, error = null) => {

        useAuthFetch.mockReturnValue({
            data: group,
            loading,
            error
        });

        return render(<GroupPage />);
    };

    test("shows loading", () => {

        renderPage(null, true);

        expect(
            screen.getByText("Laden...")
        ).toBeInTheDocument();

    });

    test("shows error", () => {

        renderPage(null, false, "Server fout");

        expect(
            screen.getByText("Fout bij ophalen groep: Server fout")
        ).toBeInTheDocument();

    });

    test("shows group not found", () => {

        renderPage(null);

        expect(
            screen.getByText("Groep niet gevonden")
        ).toBeInTheDocument();

    });

    test("renders group title", () => {

        renderPage({
            groupName: "Welpen Eindhoven",
            userRole: "LID"
        });

        expect(
            screen.getByRole("heading", {
                level: 1,
            name:"Welpen Eindhoven"
    })
        ).toBeInTheDocument();

    });

    test("renders group info card", () => {

        renderPage({
            groupName: "Welpen",
            userRole: "LID"
        });

        expect(
            screen.getByTestId("group-info-card")
        ).toBeInTheDocument();

    });

    test("renders leaders", () => {

        renderPage({
            groupName: "Welpen",
            userRole: "LID",
            leaders: [
                {
                    id: 1,
                    fullName: "Jan"
                },
                {
                    id: 2,
                    fullName: "Piet"
                }
            ]
        });

        expect(screen.getByText("Jan")).toBeInTheDocument();
        expect(screen.getByText("Piet")).toBeInTheDocument();

    });

    test("shows message when no leaders exist", () => {

        renderPage({
            groupName: "Welpen",
            userRole: "LID",
            leaders: []
        });

        expect(
            screen.getByText("Geen leiding gevonden")
        ).toBeInTheDocument();

    });

    test("leader can see members", () => {

        renderPage({
            groupName: "Welpen",
            userRole: "LEIDER",
            leaders: [],
            members: [
                {
                    id: 3,
                    fullName: "Lisa"
                }
            ]
        });

        expect(
            screen.getByText("Lisa")
        ).toBeInTheDocument();

    });

    test("normal member cannot see members section", () => {

        renderPage({
            groupName: "Welpen",
            userRole: "LID",
            leaders: [],
            members: [
                {
                    id: 1,
                    fullName: "Lisa"
                }
            ]
        });

        expect(
            screen.queryByText("Leden")
        ).not.toBeInTheDocument();

    });

    test("shows message when no members exist", () => {

        renderPage({
            groupName: "Welpen",
            userRole: "LEIDER",
            leaders: [],
            members: []
        });

        expect(
            screen.getByText("Geen leden gevonden")
        ).toBeInTheDocument();

    });

    test("teamleader sees action buttons", () => {

        renderPage({
            groupName: "Welpen",
            userRole: "TEAMLEIDER",
            leaders: [],
            members: []
        });

        expect(
            screen.getByText("Groepsgegevens aanpassen")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Leden beheren")
        ).toBeInTheDocument();

    });

    test("leader does not see action buttons", () => {

        renderPage({
            groupName: "Welpen",
            userRole: "LEIDER",
            leaders: [],
            members: []
        });

        expect(
            screen.queryByText("Groepsgegevens aanpassen")
        ).not.toBeInTheDocument();

    });

    test("edit button navigates correctly", () => {

        renderPage({
            groupName: "Welpen",
            userRole: "TEAMLEIDER",
            leaders: [],
            members: []
        });

        fireEvent.click(
            screen.getByText("Groepsgegevens aanpassen")
        );

        expect(mockNavigate).toHaveBeenCalledWith("/groups/1/edit");

    });

    test("manage members button navigates correctly", () => {

        renderPage({
            groupName: "Welpen",
            userRole: "TEAMLEIDER",
            leaders: [],
            members: []
        });

        fireEvent.click(
            screen.getByText("Leden beheren")
        );

        expect(mockNavigate).toHaveBeenCalledWith("/groups/1/members");

    });

    test("clicking person card opens user page for teamleader", () => {

        renderPage({
            groupName: "Welpen",
            userRole: "TEAMLEIDER",
            leaders: [
                {
                    id: 8,
                    fullName: "Jan"
                }
            ],
            members: []
        });

        fireEvent.click(
            screen.getByText("Jan")
        );

        expect(mockNavigate).toHaveBeenCalledWith("/users/8");

    });

});