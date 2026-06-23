import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserDetailPage from "../../pages/UserDetailPage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useParams: () => ({ id: "1" }),
    useNavigate: () => mockNavigate,
}));

const mockMutate = jest.fn();

// Definieer mock data BUITEN de mock functie zodat het altijd hetzelfde object is
const mockProfile = {
    firstName: "Nick",
    infix: "de",
    lastName: "Vries",
    email: "nick@test.nl",
    birthDate: "2000-01-15",
    street: "Dorpsstraat",
    houseNumber: "10",
    postalCode: "1234AB",
    city: "Eindhoven",
    country: "Nederland",
};

const mockParents = [
    { firstName: "Jan", infix: "", lastName: "Jansen", email: "jan@test.nl" }
];

jest.mock("../../hooks/useAuthFetch", () => ({
    useAuthFetch: (url) => {
        if (url.includes("/parents")) {
            return { data: mockParents, loading: false, error: null };
        }
        return { data: mockProfile, loading: false, error: null };
    },
}));

jest.mock("../../hooks/useAuthMutation", () => ({
    useAuthMutation: () => ({ mutate: mockMutate }),
}));

describe("UserDetailPage", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders user full name in title", () => {

        render(<UserDetailPage />);

        expect(screen.getByText(/Nick de Vries/i)).toBeInTheDocument();

    });


    test("formats birth date in Dutch format", () => {

        render(<UserDetailPage />);

        expect(screen.getByText(/15-01-2000/i)).toBeInTheDocument();

    });

    test("renders parent info", () => {

        render(<UserDetailPage />);

        expect(screen.getByText(/Jan Jansen/i)).toBeInTheDocument();
        expect(screen.getByText(/jan@test\.nl/i)).toBeInTheDocument();

    });

    test("navigates back when back button is clicked", () => {

        render(<UserDetailPage />);

        fireEvent.click(screen.getByText(/← Terug/i));

        expect(mockNavigate).toHaveBeenCalledWith(-1);

    });

    test("switches to edit mode when edit button is clicked", () => {

        render(<UserDetailPage />);

        fireEvent.click(screen.getByText("Gegevens bewerken"));

        expect(screen.getByText("Gegevens bewerken", { selector: "h2" })).toBeInTheDocument();
        expect(screen.getByText("Opslaan")).toBeInTheDocument();
        expect(screen.getByText("Annuleren")).toBeInTheDocument();

    });

    test("pre-fills edit form with current profile data", () => {

        render(<UserDetailPage />);

        fireEvent.click(screen.getByText("Gegevens bewerken"));

        expect(screen.getByDisplayValue("Nick")).toBeInTheDocument();
        expect(screen.getByDisplayValue("de")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Vries")).toBeInTheDocument();
        expect(screen.getByDisplayValue("nick@test.nl")).toBeInTheDocument();

    });

    test("cancels edit mode when cancel button is clicked", () => {

        render(<UserDetailPage />);

        fireEvent.click(screen.getByText("Gegevens bewerken"));
        fireEvent.click(screen.getByText("Annuleren"));

        expect(screen.getByText("Gegevens bewerken", { selector: "button" })).toBeInTheDocument();
        expect(screen.queryByText("Opslaan")).not.toBeInTheDocument();

    });

    test("calls mutate with updated data on save", async () => {

        mockMutate.mockResolvedValue({});

        render(<UserDetailPage />);

        fireEvent.click(screen.getByText("Gegevens bewerken"));

        const firstNameInput = screen.getByDisplayValue("Nick");
        fireEvent.change(firstNameInput, { target: { value: "Nikki" } });

        fireEvent.click(screen.getByText("Opslaan"));

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith(
                expect.stringContaining("/api/users/1"),
                expect.objectContaining({ method: "PUT" })
            );
        });

    });

    test("exits edit mode after successful save", async () => {

        mockMutate.mockResolvedValue({});

        render(<UserDetailPage />);

        fireEvent.click(screen.getByText("Gegevens bewerken"));
        fireEvent.click(screen.getByText("Opslaan"));

        await waitFor(() => {
            expect(screen.queryByText("Opslaan")).not.toBeInTheDocument();
        });

    });

    test("shows alert when save fails", async () => {

        mockMutate.mockRejectedValue(new Error("Server error"));
        jest.spyOn(window, "alert").mockImplementation(() => {});

        render(<UserDetailPage />);

        fireEvent.click(screen.getByText("Gegevens bewerken"));
        fireEvent.click(screen.getByText("Opslaan"));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Opslaan mislukt");
        });

    });

});