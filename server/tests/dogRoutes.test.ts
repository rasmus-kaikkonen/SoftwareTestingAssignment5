import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { app } from '../index'
import { Request, Response } from 'express'
import * as dogController from '../controllers/dogController'

vi.mock('../controllers/dogController')

describe('Dog routes', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.resetAllMocks()
    })

    test('GET /api/dogs/random returns random image', async () => {
        vi.mocked(dogController.getDogImage).mockImplementation(
            async (req: Request, res: Response) => {
                res.status(200).json({
                    success: true,
                    data: {
                        imageUrl: "https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg",
                        status: "success"
                    }
                })
            }
        )

        const res = await request(app)
        .get('/api/dogs/random')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data.imageUrl).toBe("https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg")
    })

    test('GET /api/dogs/random return 500 for an internal server error', async () => {
        vi.mocked(dogController.getDogImage).mockImplementation(
            async (req: Request, res: Response) => {
                res.status(500).json({
                    error: {
                        message: 'Network error'
                    }
                })
            }
        )

        const res = await request(app)
        .get('/api/dogs/random')

        expect(res.status).toBe(500)
        expect(res.body.error).toBeDefined()
    })
})