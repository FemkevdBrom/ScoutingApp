import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ManageMembersPage from "../../pages/ManageMembersPage";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import { useAuthMutation } from "../../hooks/useAuthMutation";

jest.mock("../../hooks/useAuthFetch");
jest.mock("../../hooks/useAuthMutation");

const mockNavigate = jest.fn();
const mockMutate = jest.fn();
const mockRefetch = jest.fn();

jest.mock("react-router-dom", () => ({
    useParams: () => ({ id: "1" }),
    useNavigate: () => mockNavigate,
}));

describe("ManageMembersPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.confirm = jest.fn(() => true);

        useAuthMutation.mockReturnValue({
            mutate: mockMutate,
        });

        useAuthFetch.mockReturnValue({
            loading: false,
            error: null,
            refetch: mockRefetch,
            data: {
                groupName: "Welpen",
                leaders: [
                    { id: 1, fullName: "Jan", role: "TEAMLEIDER" },
                ],
                members: [
                    { id: 2, fullName: "Lisa", role: "LID" },
                ],
            },
        });
    });

    test("renders title", () => {
        render(<ManageMembersPage />);
        expect(screen.getByText(/Leden beheren/i)).toBeInTheDocument();
    });

    test("shows loading", () => {
        useAuthFetch.mockReturnValue({ loading: true });
        render(<ManageMembersPage />);
        expect(screen.getByText("Laden...")).toBeInTheDocument();
    });

    test("shows error", () => {
        useAuthFetch.mockReturnValue({ loading:false,error:"Server fout" });
        render(<ManageMembersPage />);
        expect(screen.getByText("Fout: Server fout")).toBeInTheDocument();
    });

    test("shows not found", () => {
        useAuthFetch.mockReturnValue({ loading:false,error:null,data:null });
        render(<ManageMembersPage />);
        expect(screen.getByText("Groep niet gevonden")).toBeInTheDocument();
    });

    test("renders existing people", () => {
        render(<ManageMembersPage />);
        expect(screen.getByText(/Jan/)).toBeInTheDocument();
        expect(screen.getByText(/Lisa/)).toBeInTheDocument();
    });

    test("updates user id input", () => {
        render(<ManageMembersPage />);
        const input = screen.getByPlaceholderText("Bijv. 42");
        fireEvent.change(input,{target:{value:"42"}});
        expect(input.value).toBe("42");
    });

    test("changes role", () => {
        render(<ManageMembersPage />);
        const select = screen.getByDisplayValue("Lid");
        fireEvent.change(select,{target:{value:"LEIDER"}});
        expect(select.value).toBe("LEIDER");
    });

    test("adds member", async () => {
        mockMutate.mockResolvedValue({});
        render(<ManageMembersPage />);
        fireEvent.change(screen.getByPlaceholderText("Bijv. 42"),{target:{value:"42"}});
        fireEvent.click(screen.getByText("Toevoegen"));

        await waitFor(()=>{
            expect(mockMutate).toHaveBeenCalledWith(
                expect.stringContaining("/groups/1/members"),
                expect.objectContaining({method:"POST"})
            );
            expect(mockRefetch).toHaveBeenCalled();
        });
    });

    test("removes member", async () => {
        mockMutate.mockResolvedValue({});
        render(<ManageMembersPage />);
        fireEvent.click(screen.getAllByText("Verwijderen")[0]);

        await waitFor(()=>{
            expect(mockMutate).toHaveBeenCalledWith(
                expect.stringContaining("/groups/1/members/1"),
                expect.objectContaining({method:"DELETE"})
            );
        });
    });

    test("does not remove when confirm is cancelled", () => {
        window.confirm = jest.fn(() => false);
        render(<ManageMembersPage />);
        fireEvent.click(screen.getAllByText("Verwijderen")[0]);
        expect(mockMutate).not.toHaveBeenCalled();
    });
});
