import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GroupEditPage from "../../pages/GroupEditPage";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import { useAuthMutation } from "../../hooks/useAuthMutation";

const mockNavigate = jest.fn();
const mockMutate = jest.fn();

jest.mock("../../hooks/useAuthFetch");
jest.mock("../../hooks/useAuthMutation");

jest.mock("react-router-dom", () => ({
    useParams: () => ({ id: "1" }),
    useNavigate: () => mockNavigate,
}));

describe("GroupEditPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useAuthFetch.mockReturnValue({
            data: {
                groupName: "Welpen",
                colorHex: "#123456",
                info: {
                    groupDescription: "Beschrijving",
                    groupEmail: "groep@test.nl",
                    groupAge: "_7_11",
                    groupType: "LANDSCOUTS",
                    groupStatus: "ACTIEF",
                    groupGender: "GEMENGD",
                },
            },
        });

        useAuthMutation.mockReturnValue({
            mutate: mockMutate,
            loading: false,
        });

        global.alert = jest.fn();
    });

    test("renders page title", () => {
        render(<GroupEditPage />);
        expect(screen.getByText("Groepsgegevens aanpassen")).toBeInTheDocument();
    });

    test("loads existing values", () => {
        render(<GroupEditPage />);
        expect(screen.getByDisplayValue("Welpen")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Beschrijving")).toBeInTheDocument();
        expect(screen.getByDisplayValue("groep@test.nl")).toBeInTheDocument();
    });

    test("updates name", () => {
        render(<GroupEditPage />);
        const input = screen.getByDisplayValue("Welpen");
        fireEvent.change(input,{target:{value:"Scouts"}});
        expect(input.value).toBe("Scouts");
    });

    test("updates description", () => {
        render(<GroupEditPage />);
        const input = screen.getByDisplayValue("Beschrijving");
        fireEvent.change(input,{target:{value:"Nieuwe omschrijving"}});
        expect(input.value).toBe("Nieuwe omschrijving");
    });

    test("updates email", () => {
        render(<GroupEditPage />);
        const input = screen.getByDisplayValue("groep@test.nl");
        fireEvent.change(input,{target:{value:"nieuw@test.nl"}});
        expect(input.value).toBe("nieuw@test.nl");
    });

    test("save calls mutate", async () => {
        mockMutate.mockResolvedValue();
        render(<GroupEditPage />);
        fireEvent.click(screen.getByText("Opslaan"));
        await waitFor(()=>expect(mockMutate).toHaveBeenCalledTimes(1));
    });

    test("save uses PUT", async () => {
        mockMutate.mockResolvedValue();
        render(<GroupEditPage />);
        fireEvent.click(screen.getByText("Opslaan"));
        await waitFor(()=>{
            expect(mockMutate.mock.calls[0][1].method).toBe("PUT");
        });
    });

    test("successful save navigates to group page", async () => {
        mockMutate.mockResolvedValue();
        render(<GroupEditPage />);
        fireEvent.click(screen.getByText("Opslaan"));
        await waitFor(()=>{
            expect(mockNavigate).toHaveBeenCalledWith("/groups/1");
        });
    });

    test("failed save shows alert", async () => {
        mockMutate.mockRejectedValue(new Error("Mislukt"));
        render(<GroupEditPage />);
        fireEvent.click(screen.getByText("Opslaan"));
        await waitFor(()=>{
            expect(global.alert).toHaveBeenCalled();
        });
    });

    test("back button navigates back", () => {
        render(<GroupEditPage />);
        fireEvent.click(screen.getByText("← Terug"));
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    test("cancel button navigates back", () => {
        render(<GroupEditPage />);
        fireEvent.click(screen.getByText("Annuleren"));
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    test("shows saving state", () => {
        useAuthMutation.mockReturnValue({
            mutate: mockMutate,
            loading: true,
        });
        render(<GroupEditPage />);
        expect(screen.getByText("Bezig met opslaan...")).toBeInTheDocument();
    });
});
