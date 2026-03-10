/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, test, vi} from 'vitest'
import { getDogImage } from '../controllers/dogController'
import * as dogService from '../services/dogService'

vi.mock('../services/dogService')

const createMockResponse = () => {
    const res : any = {}
    res.status = vi.fn().mockReturnThis()
    res.json = vi.fn()
    return res;
}

describe('DogController.getDogImage', () => {
    test('Return image with valid request', async () => {
        const req: any = {};
        const res = createMockResponse()
        const payload = {
            imageUrl: "https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg",
            status: "success"
        }
        vi.mocked(dogService.getRandomDogImage).mockResolvedValue(payload)

        await getDogImage(req, res)

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {
                imageUrl: "https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg",
                status: "success"
            }
        })
    })
})