import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { getRandomDogImage } from "../services/dogService";

describe("DogService.getRandomDogImage", () => {
    beforeEach(() => {
        global.fetch = vi.fn()
    })

    afterEach(() => {
        vi.clearAllMocks()
        vi.resetAllMocks()
    })

    test('Returns an rando image of a dog', async () => {
        const mockData = {
            message: "https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg",
            status: "success"
        }

        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => mockData
        } as Response)

        const result = await getRandomDogImage()

        expect(result.imageUrl).toEqual(mockData.message)
        expect(result.status).toEqual(mockData.status)
        expect(fetch).toHaveBeenCalledOnce()
    })

    test("Throws error when API call fails", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            status: 500
        } as Response)

        await expect(getRandomDogImage()).rejects.toThrow(
            'Failed to fetch dog image: Dog API returned status 500'
        )
    })
})