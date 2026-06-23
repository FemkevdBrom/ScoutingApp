import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import { useAuthMutation } from "../../hooks/useAuthMutation";

describe("useAuthMutation", () => {

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

    test("starts with loading false", () => {

        const { result } = renderHook(
            () => useAuthMutation(),
            {
                wrapper: wrapper({
                    token: "jwt-token"
                })
            }
        );

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();

    });

    test("throws error when no token is available", async () => {

        const { result } = renderHook(
            () => useAuthMutation(),
            {
                wrapper: wrapper(null)
            }
        );

        await expect(
            result.current.mutate("/api/test")
        ).rejects.toThrow("Geen token beschikbaar");

    });

    test("sends authorization header", async () => {

        fetch.mockResolvedValue({
            ok: true,
            text: async () => ""
        });

        const { result } = renderHook(
            () => useAuthMutation(),
            {
                wrapper: wrapper({
                    token: "jwt-token"
                })
            }
        );

        await act(async () => {
            await result.current.mutate("/api/test");
        });

        expect(fetch).toHaveBeenCalledWith(
            "/api/test",
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
            text: async () => ""
        });

        const { result } = renderHook(
            () => useAuthMutation(),
            {
                wrapper: wrapper({
                    token: "jwt-token"
                })
            }
        );

        await act(async () => {

            await result.current.mutate("/api/test", {
                headers: {
                    Test: "123"
                }
            });

        });

        expect(fetch).toHaveBeenCalledWith(
            "/api/test",
            expect.objectContaining({
                headers: expect.objectContaining({
                    Test: "123"
                })
            })
        );

    });

    test("returns parsed json", async () => {

        fetch.mockResolvedValue({
            ok: true,
            text: async () => JSON.stringify({
                id: 1,
                name: "Welpen"
            })
        });

        const { result } = renderHook(
            () => useAuthMutation(),
            {
                wrapper: wrapper({
                    token: "jwt-token"
                })
            }
        );

        let response;

        await act(async () => {
            response = await result.current.mutate("/api/test");
        });

        expect(response).toEqual({
            id: 1,
            name: "Welpen"
        });

    });

    test("returns plain text response", async () => {

        fetch.mockResolvedValue({
            ok: true,
            text: async () => "Succes"
        });

        const { result } = renderHook(
            () => useAuthMutation(),
            {
                wrapper: wrapper({
                    token: "jwt-token"
                })
            }
        );

        let response;

        await act(async () => {
            response = await result.current.mutate("/api/test");
        });

        expect(response).toBe("Succes");

    });

    test("returns null for empty response", async () => {

        fetch.mockResolvedValue({
            ok: true,
            text: async () => ""
        });

        const { result } = renderHook(
            () => useAuthMutation(),
            {
                wrapper: wrapper({
                    token: "jwt-token"
                })
            }
        );

        let response;

        await act(async () => {
            response = await result.current.mutate("/api/test");
        });

        expect(response).toBeNull();

    });

    test("sets error when request fails", async () => {

        fetch.mockResolvedValue({
            ok: false,
            text: async () => "Server fout"
        });

        const { result } = renderHook(
            () => useAuthMutation(),
            {
                wrapper: wrapper({
                    token: "jwt-token"
                })
            }
        );

        await act(async () => {
            await result.current.mutate("/api/test").catch(() => {});
        });

        await waitFor(() => {

            expect(result.current.error).toBe("Server fout");

        });

    });

    test("loading becomes false after request", async () => {

        fetch.mockResolvedValue({
            ok: true,
            text: async () => ""
        });

        const { result } = renderHook(
            () => useAuthMutation(),
            {
                wrapper: wrapper({
                    token: "jwt-token"
                })
            }
        );

        await act(async () => {
            await result.current.mutate("/api/test");
        });

        expect(result.current.loading).toBe(false);

    });

});