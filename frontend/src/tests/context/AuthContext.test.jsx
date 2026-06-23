import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import React, { useContext } from "react";
import { AuthProvider, AuthContext } from "../../context/AuthContext";

const TestComponent = () => {
    const { user, login, logout, loading } = useContext(AuthContext);

    return (
        <>
            <div data-testid="loading">{loading.toString()}</div>
            <div data-testid="user">
                {user ? user.firstName : "Geen gebruiker"}
            </div>

            <button onClick={() => login("jwt-token")}>
                Login
            </button>

            <button onClick={logout}>
                Logout
            </button>
        </>
    );
};

describe("AuthContext", () => {

    beforeEach(() => {

        jest.clearAllMocks();

        Storage.prototype.getItem = jest.fn();
        Storage.prototype.setItem = jest.fn();
        Storage.prototype.removeItem = jest.fn();

        global.fetch = jest.fn();

    });

    test("starts with loading", () => {

        localStorage.getItem.mockReturnValue(null);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(
            screen.getByTestId("loading")
        ).toHaveTextContent("false");

    });

    test("shows no user when token is missing", () => {

        localStorage.getItem.mockReturnValue(null);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(
            screen.getByTestId("user")
        ).toHaveTextContent("Geen gebruiker");

    });

    test("loads user from stored token", async () => {

        localStorage.getItem.mockReturnValue("jwt-token");

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                firstName: "Nick"
            })
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {

            expect(
                screen.getByTestId("user")
            ).toHaveTextContent("Nick");

        });

    });

    test("stores token on login", async () => {

        localStorage.getItem.mockReturnValue(null);

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                firstName: "Nick"
            })
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        screen.getByText("Login").click();

        await waitFor(() => {

            expect(localStorage.setItem).toHaveBeenCalledWith(
                "token",
                "jwt-token"
            );

        });

    });

    test("fetches user after login", async () => {

        localStorage.getItem.mockReturnValue(null);

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                firstName: "Nick"
            })
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        screen.getByText("Login").click();

        await waitFor(() => {

            expect(
                screen.getByTestId("user")
            ).toHaveTextContent("Nick");

        });

    });

    test("removes token on logout", async () => {

        localStorage.getItem.mockReturnValue("jwt-token");

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                firstName: "Nick"
            })
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() =>
            expect(
                screen.getByTestId("user")
            ).toHaveTextContent("Nick")
        );

        screen.getByText("Logout").click();

        expect(localStorage.removeItem).toHaveBeenCalledWith("token");

    });

    test("logout clears user", async () => {

        localStorage.getItem.mockReturnValue("jwt-token");

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                firstName: "Nick"
            })
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() =>
            expect(
                screen.getByTestId("user")
            ).toHaveTextContent("Nick")
        );

        await act(async () => {
            screen.getByText("Logout").click();
        });

        expect(
            screen.getByTestId("user")
        ).toHaveTextContent("Geen gebruiker");

    });

    test("removes invalid token when fetch fails", async () => {

        localStorage.getItem.mockReturnValue("jwt-token");

        fetch.mockResolvedValue({
            ok: false
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {

            expect(localStorage.removeItem).toHaveBeenCalledWith(
                "token"
            );

        });

    });

    test("adds token to fetched user", async () => {

        localStorage.getItem.mockReturnValue("jwt-token");

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                firstName: "Nick"
            })
        });

        let context;

        function Reader() {
            context = useContext(AuthContext);
            return null;
        }

        render(
            <AuthProvider>
                <Reader />
            </AuthProvider>
        );

        await waitFor(() => {

            expect(context.user.token).toBe("jwt-token");

        });

    });

});