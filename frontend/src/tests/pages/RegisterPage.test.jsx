import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegisterPage from "../../pages/RegisterPage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

// Helper: fill in a complete valid form (waits for scouting groups to load first)
async function fillValidForm() {
    // Wait for the scouting group dropdown option to appear before interacting
    await screen.findByText("Scouting Eindhoven (Eindhoven)");

    fireEvent.change(screen.getByRole("textbox", { name: /Voornaam/i }),    { target: { value: "Nick" } });
    fireEvent.change(screen.getByRole("textbox", { name: /Achternaam/i }),  { target: { value: "Jansen" } });
    fireEvent.change(screen.getByLabelText(/Geboortedatum/i),               { target: { value: "2000-01-01" } });
    fireEvent.change(screen.getByRole("textbox", { name: /Straat/i }),      { target: { value: "Dorpsstraat" } });
    fireEvent.change(screen.getByRole("textbox", { name: /Huisnummer/i }),  { target: { value: "1" } });
    fireEvent.change(screen.getByRole("textbox", { name: /Postcode/i }),    { target: { value: "1234AB" } });
    fireEvent.change(screen.getByRole("textbox", { name: /Stad/i }),        { target: { value: "Eindhoven" } });
    fireEvent.change(screen.getByRole("textbox", { name: /Land/i }),        { target: { value: "Nederland" } });
    fireEvent.change(screen.getByRole("textbox", { name: /Email/i }),       { target: { value: "nick@test.nl" } });
    fireEvent.change(screen.getByLabelText(/^Wachtwoord/i),                 { target: { value: "Password123!" } });
    fireEvent.change(screen.getByLabelText(/Herhaal wachtwoord/i),          { target: { value: "Password123!" } });
    fireEvent.change(screen.getByRole("combobox"),                          { target: { value: "1" } });
}

describe("RegisterPage", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        global.fetch = jest.fn((url) => {
            if (url.toString().includes("scouting-groups")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => [
                        {
                            id: 1,
                            name: "Scouting Eindhoven",
                            city: "Eindhoven"
                        }
                    ]
                });
            }

            return Promise.resolve({
                ok: true,
                text: async () => ""
            });
        });

        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test("renders page title", async () => {

        render(<RegisterPage />);

        expect(
            screen.getByRole("heading", { name: "Registreren" })
        ).toBeInTheDocument();

    });

    test("loads scouting groups", async () => {

        render(<RegisterPage />);

        expect(
            await screen.findByText("Scouting Eindhoven (Eindhoven)")
        ).toBeInTheDocument();

    });

    test("updates first name", () => {

        render(<RegisterPage />);

        const input = screen.getByRole("textbox", { name: /Voornaam/i });

        fireEvent.change(input, {
            target: {
                value: "Nick"
            }
        });

        expect(input.value).toBe("Nick");

    });

    test("updates last name", () => {

        render(<RegisterPage />);

        const input = screen.getByRole("textbox", { name: /Achternaam/i });

        fireEvent.change(input, {
            target: {
                value: "Jansen"
            }
        });

        expect(input.value).toBe("Jansen");

    });

    test("shows validation errors when submitting empty form", async () => {

        render(<RegisterPage />);

        fireEvent.click(
            screen.getByRole("button", { name: /Registreren/i })
        );

        expect(
            await screen.findByText("Voornaam is verplicht")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Achternaam is verplicht")
        ).toBeInTheDocument();

    });

    test("shows invalid email error", async () => {

        render(<RegisterPage />);

        fireEvent.change(
            screen.getByRole("textbox", { name: /Email/i }),
            {
                target: {
                    value: "test"
                }
            }
        );

        fireEvent.click(
            screen.getByRole("button", { name: /Registreren/i })
        );

        expect(
            await screen.findByText(/Ongeldig emailformaat/i)
        ).toBeInTheDocument();

    });

    test("shows password mismatch", async () => {

        render(<RegisterPage />);

        fireEvent.change(
            screen.getByLabelText(/^Wachtwoord/i),
            {
                target: {
                    value: "Password123!"
                }
            }
        );

        fireEvent.change(
            screen.getByLabelText(/Herhaal wachtwoord/i),
            {
                target: {
                    value: "Password123"
                }
            }
        );

        fireEvent.click(
            screen.getByRole("button", { name: /Registreren/i })
        );

        expect(
            await screen.findByText("Wachtwoorden komen niet overeen")
        ).toBeInTheDocument();

    });

    test("successful registration", async () => {

        render(<RegisterPage />);

        await fillValidForm();

        fireEvent.click(
            screen.getByRole("button", { name: /Registreren/i })
        );

        await waitFor(() => {

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining("/auth/register"),
                expect.objectContaining({
                    method: "POST"
                })
            );

        });

    });

    test("shows api error", async () => {

        fetch.mockImplementation((url) => {

            if (url.toString().includes("scouting-groups")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => [
                        { id: 1, name: "Scouting Eindhoven", city: "Eindhoven" }
                    ]
                });
            }

            return Promise.resolve({
                ok: false,
                text: async () => "Registratie mislukt"
            });

        });

        render(<RegisterPage />);

        await fillValidForm();

        fireEvent.click(
            screen.getByRole("button", { name: /Registreren/i })
        );

        expect(
            await screen.findByText("Registratie mislukt")
        ).toBeInTheDocument();

    });

    test("navigates back to login", () => {

        render(<RegisterPage />);

        fireEvent.click(
            screen.getByText("Terug naar inloggen")
        );

        expect(mockNavigate).toHaveBeenCalledWith("/");

    });

    test("redirects after successful registration", async () => {

        render(<RegisterPage />);

        await fillValidForm();

        fireEvent.click(
            screen.getByRole("button", { name: /Registreren/i })
        );

        // Wait for the register fetch to complete and success state to set
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining("/auth/register"),
                expect.objectContaining({ method: "POST" })
            );
        });

        jest.runAllTimers();

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });

    });

});