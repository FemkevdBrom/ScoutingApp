import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "../../pages/LoginPage";
import { AuthContext } from "../../context/AuthContext";

const mockNavigate = jest.fn();
const mockLogin = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate
}));

describe("LoginPage", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    const renderPage = () =>
        render(
            <AuthContext.Provider value={{ login: mockLogin }}>
                <LoginPage />
            </AuthContext.Provider>
        );

    test("renders login title", () => {

        renderPage();

        expect(
            screen.getByRole("heading", {
                level: 2,
                name: "Login"
            })
        ).toBeInTheDocument();

    });

    test("renders email input", () => {

        renderPage();

        expect(
            screen.getByPlaceholderText("Email")
        ).toBeInTheDocument();

    });

    test("renders password input", () => {

        renderPage();

        expect(
            screen.getByPlaceholderText("Wachtwoord")
        ).toBeInTheDocument();

    });

    test("updates email input", () => {

        renderPage();

        const email = screen.getByPlaceholderText("Email");

        fireEvent.change(email, {
            target: {
                value: "test@test.nl"
            }
        });

        expect(email.value).toBe("test@test.nl");

    });

    test("updates password input", () => {

        renderPage();

        const password = screen.getByPlaceholderText("Wachtwoord");

        fireEvent.change(password, {
            target: {
                value: "Password123!"
            }
        });

        expect(password.value).toBe("Password123!");

    });

    test("shows loading while logging in", async () => {

        fetch.mockImplementation(
            () =>
                new Promise(resolve =>
                    setTimeout(() =>
                        resolve({
                            ok: true,
                            json: async () => ({
                                token: "abc123"
                            })
                        }), 100)
                )
        );

        renderPage();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Login"
            })
        );

        expect(
            screen.getByText("Bezig...")
        ).toBeInTheDocument();

    });

    test("successful login calls context login", async () => {

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                token: "jwt-token"
            })
        });

        renderPage();

        fireEvent.change(
            screen.getByPlaceholderText("Email"),
            {
                target: {
                    value: "test@test.nl"
                }
            }
        );

        fireEvent.change(
            screen.getByPlaceholderText("Wachtwoord"),
            {
                target: {
                    value: "Password123!"
                }
            }
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Login"
            })
        );

        await waitFor(() => {

            expect(mockLogin).toHaveBeenCalledWith("jwt-token");

        });

    });

    test("successful login navigates to home", async () => {

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                token: "jwt-token"
            })
        });

        renderPage();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Login"
            })
        );

        await waitFor(() => {

            expect(mockNavigate).toHaveBeenCalledWith("/home");

        });

    });

    test("shows error when login fails", async () => {

        fetch.mockResolvedValue({
            ok: false
        });

        renderPage();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Login"
            })
        );

        expect(
            await screen.findByText("Ongeldige email of wachtwoord")
        ).toBeInTheDocument();

    });

    test("shows fetch error", async () => {

        fetch.mockRejectedValue(
            new Error("Server offline")
        );

        renderPage();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Login"
            })
        );

        expect(
            await screen.findByText("Server offline")
        ).toBeInTheDocument();

    });

    test("register button navigates to register page", () => {

        renderPage();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Registeren"
            })
        );

        expect(mockNavigate).toHaveBeenCalledWith("/register");

    });

});