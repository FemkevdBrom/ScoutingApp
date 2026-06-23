import { getUserById } from "../../services/UserService";

describe("UserService", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    test("calls correct endpoint", async () => {

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                id: 5,
                firstName: "Nick"
            })
        });

        await getUserById(5);

        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:8080/api/users/5"
        );

    });

    test("returns user when request succeeds", async () => {

        const user = {
            id: 5,
            firstName: "Nick",
            lastName: "Jansen"
        };

        fetch.mockResolvedValue({
            ok: true,
            json: async () => user
        });

        const result = await getUserById(5);

        expect(result).toEqual(user);

    });

    test("throws error when response is not ok", async () => {

        fetch.mockResolvedValue({
            ok: false
        });

        await expect(
            getUserById(5)
        ).rejects.toThrow("Failed to fetch user");

    });

    test("throws network error", async () => {

        fetch.mockRejectedValue(
            new Error("Network error")
        );

        await expect(
            getUserById(5)
        ).rejects.toThrow("Network error");

    });

    test("calls fetch exactly once", async () => {

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({})
        });

        await getUserById(1);

        expect(fetch).toHaveBeenCalledTimes(1);

    });

    test("passes the correct id in the url", async () => {

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({})
        });

        await getUserById(99);

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/99")
        );

    });

});