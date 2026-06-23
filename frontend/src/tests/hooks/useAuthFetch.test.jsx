import { renderHook, waitFor } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import { useAuthFetch } from "../../hooks/useAuthFetch";

describe("useAuthFetch", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    const wrapper = (user) => ({ children }) => (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );

    test("returns loading false when url is null", async () => {

        const { result } = renderHook(
            () => useAuthFetch(null),
            {
                wrapper: wrapper({
                    token: "jwt-token"
                })
            }
        );

        await waitFor(() => {

            expect(result.current.loading).toBe(false);

        });

        expect(result.current.data).toBeNull();
        expect(result.current.error).toBeNull();

    });

    test("returns loading false when user has no token", async () => {

        const { result } = renderHook(
            () => useAuthFetch("/api/test"),
            {
                wrapper: wrapper(null)
            }
        );

        await waitFor(() => {

            expect(result.current.loading).toBe(false);

        });

    });

    test("fetches data successfully", async () => {

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                id: 1,
                name: "Welpen"
            })
        });

        const { result } = renderHook(
            () => useAuthFetch("/api/groups"),
            {
                wrapper: wrapper({
                    token: "jwt-token"
                })
            }
        );

        await waitFor(() => {

            expect(result.current.loading).toBe(false);

        });

        expect(result.current.data).toEqual({
            id: 1,
            name: "Welpen"
        });

        expect(result.current.error).toBeNull();

    });

    test("sends authorization header", async () => {

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({})
        });

        renderHook(
            () => useAuthFetch("/api/groups"),
            {
                wrapper: wrapper({
                    token: "jwt-token"
                })
            }
        );

        await waitFor(() => {

            expect(fetch).toHaveBeenCalled();

        });

        expect(fetch).toHaveBeenCalledWith(
            "/api/groups",
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer jwt-token",
                    "Content-Type": "application/json"
                })
            })
        );

    });

    test("merges custom headers", async () => {

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({})
        });

        renderHook(
            () =>
                useAuthFetch("/api/groups", {
                    headers: {
                        Test: "123"
                    }
                }),
            {
                wrapper: wrapper({
                    token: "jwt-token"
                })
            }
        );

        await waitFor(() => {

            expect(fetch).toHaveBeenCalled();

        });

        expect(fetch).toHaveBeenCalledWith(
            "/api/groups",
            expect.objectContaining({
                headers: expect.objectContaining({
                    Test: "123"
                })
            })
        );

    });

    test("returns error when response is not ok", async () => {

        fetch.mockResolvedValue({
            ok: false,
            status: 500
        });

        const { result } = renderHook(
            () => useAuthFetch("/api/groups"),
            {
                wrapper: wrapper({
                    token: "jwt-token"
                })
            }
        );

        await waitFor(() => {

            expect(result.current.loading).toBe(false);

        });

        expect(result.current.error).toContain("500");

    });

    test("returns fetch error", async () => {

        fetch.mockRejectedValue(
            new Error("Server offline")
        );

        const { result } = renderHook(
            () => useAuthFetch("/api/groups"),
            {
                wrapper: wrapper({
                    token: "jwt-token"
                })
            }
        );

        await waitFor(() => {

            expect(result.current.loading).toBe(false);

        });

        expect(result.current.error).toBe("Server offline");

    });

    test("starts in loading state", () => {

        fetch.mockImplementation(
            () => new Promise(() => {})
        );

        const { result } = renderHook(
            () => useAuthFetch("/api/groups"),
            {
                wrapper: wrapper({
                    token: "jwt-token"
                })
            }
        );

        expect(result.current.loading).toBe(true);

    });

});