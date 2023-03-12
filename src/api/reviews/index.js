import Express from 'express'
import { getReviews, writeReviews } from '../../lib/fs-tools.js'
import { callBadRequest } from '../medias/validation.js'
import { checkReviewSchema } from './validation.js'
import uniqid from 'uniqid'
import createHttpError from 'http-errors'

const reviewsRouter = Express.Router()

reviewsRouter.post("/:mediaId/reviews", checkReviewSchema, callBadRequest, async (request, response, next) => {
    try {
        const newReview = { _id: uniqid(), ...request.body, mediaId: request.params.mediaId, createdAt: new Date(), updatedAt: new Date() }
        const reviews = await getReviews()

        reviews.push(newReview)

        await writeReviews(reviews)

        response.status(201).send({ _id: newReview._id })


    } catch (error) {
        next(error)
    }
})

reviewsRouter.get("/:mediaId/reviews", async (request, response, next) => {
    try {
        const reviews = await getReviews()
        const validMediaId = reviews.some(review => review.mediaId === request.params.mediaId)
        if (validMediaId) {
            const mediaReviews = reviews.filter(review => review.mediaId === request.params.mediaId)
            response.send(mediaReviews)
        } else {
            next(createHttpError(404, { message: `Media with id ${request.params.mediaId} does not exist or has no reviews yet!` }))
        }
    } catch (error) {
        next(error)
    }
})


reviewsRouter.get("/:mediaId/reviews/:reviewId", async (request, response, next) => {
    try {
        const reviews = await getReviews()
        const validMediaId = reviews.some(review => review.mediaId === request.params.mediaId)
        if (validMediaId) {
            const foundReview = reviews.find(review => review._id === request.params.reviewId && review.mediaId === request.params.mediaId)
            if (foundReview) {
                response.send(foundReview)
            } else {
                next(createHttpError(404, { message: `Review with id ${request.params.reviewId} does not exist!` }))
            }
        } else {
            next(createHttpError(404, { message: `Media with id ${request.params.mediaId} does not exist or has no reviews yet!` }))
        }

    } catch (error) {
        next(error)
    }
})



reviewsRouter.put("/:mediaId/reviews/:reviewId", async (request, response, next) => {
    try {
        const reviews = await getReviews()
        const validMediaId = reviews.some(review => review.mediaId === request.params.mediaId)
        if (validMediaId) {
            const index = reviews.findIndex(review => review._id === request.params.reviewId && review.mediaId === request.params.mediaId)
            if (index !== -1) {
                const oldReview = reviews[index]
                const updatedReview = { ...oldReview, ...request.body, updatedAt: new Date() }
                reviews[index] = updatedReview

                await writeReviews(reviews)

                response.send(updatedReview)
            } else {
                next(createHttpError(404, { message: `Review with id ${request.params.reviewId} does not exist!` }))

            }

        } else {
            next(createHttpError(404, { message: `Media with id ${request.params.mediaId} does not exist or has no reviews yet!` }))
        }

    } catch (error) {
        next(error)
    }
})


reviewsRouter.delete("/:mediaId/reviews/:reviewId", async (request, response, next) => {
    try {
        const reviews = await getReviews()
        const validMediaId = reviews.some(review => review.mediaId === request.params.mediaId)
        if (validMediaId) {
            const filteredReviews = reviews.filter(review => review._id !== request.params.reviewId)

            if (reviews.length !== filteredReviews.length) {
                await writeReviews(filteredReviews)
                response.status(204).send()
            } else {
                next(createHttpError(404, { message: `Review with id ${request.params.reviewId} does not exist!` }))
            }

        } else {
            next(createHttpError(404, { message: `Media with id ${request.params.mediaId} does not exist or has no reviews yet!` }))
        }

    } catch (error) {
        next(error)
    }
})


export default reviewsRouter