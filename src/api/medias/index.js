import Express from 'express'
import { addMediaToJSON, getMedias, writeMedias } from '../../lib/fs-tools.js'
import { callBadRequest, checkMediaSchema } from './validation.js'
import uniqid from 'uniqid'
import createHttpError from 'http-errors'

const mediaRouter = Express.Router()

mediaRouter.get("/", async (request, response, next) => {
    try {
        const medias = await getMedias()
        if (request.query && request.query.title) {
            const matchedMedias = medias.filter(media => media.title.toLowerCase().includes(request.query.title.toLowerCase()))
            if (matchedMedias.length < 6) {
                let responseFromOmdbApi = await fetch("http://www.omdbapi.com/?apikey=f26f50a5&s=" + request.query.title);
                if (responseFromOmdbApi.ok) {
                    const mediasFromOmdbApi = await responseFromOmdbApi.json()
                    const modifiedMedias = mediasFromOmdbApi.Search.map(media => {
                        if (media.Year.includes('–')) {
                            media.Year = media.Year.replace('–', '-');
                        }
                        return {
                            imdbID: uniqid(),
                            poster: media.Poster,
                            title: media.Title,
                            type: media.Type,
                            year: media.Year,
                        }
                    })
                    await addMediaToJSON(medias, modifiedMedias)
                    response.send(modifiedMedias)
                } else {
                    next(createHttpError(400, { message: "Something is wrong!" }))
                }
            } else {

                response.send(matchedMedias)
            }
        } else {
            response.send(medias)
        }
    } catch (error) {
        next(error)
    }
})


mediaRouter.post("/", checkMediaSchema, callBadRequest, async (request, response, next) => {
    try {
        const newMedia = { imdbID: uniqid(), ...request.body, createdAt: new Date(), updatedAt: new Date() }

        const medias = await getMedias()
        medias.push(newMedia)

        await writeMedias(medias)

        response.status(201).send({ imdbID: newMedia.imdbID })

    } catch (error) {
        next(error)
    }
})


mediaRouter.get("/:id", async (request, response, next) => {
    try {

        const medias = await getMedias()
        const media = medias.find(media => media.imdbID === request.params.id)

        if (media) {
            response.send(media)
        } else {
            next(createHttpError(404, { message: `Media with imbdID ${request.params.id} was not found!` }))
        }

    } catch (error) {
        next(error)
    }
})


mediaRouter.put("/:id", async (request, response, next) => {
    try {
        const medias = await getMedias()
        const index = medias.findIndex(media => media.imdbID === request.params.id)
        if (index !== -1) {
            const oldMedia = medias[index]
            const updatedMedia = { ...oldMedia, ...request.body, updatedAt: new Date() }
            medias[index] = updatedMedia
            await writeMedias(medias)
            response.send(updatedMedia)
        } else {
            next(createHttpError(404, `Media with imdbID ${request.params.id} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})


mediaRouter.delete("/:id", async (request, response, next) => {
    try {

        const medias = await getMedias()
        const filteredMedias = medias.filter(media => media.imdbID !== request.params.id)

        if (medias.length !== filteredMedias.length) {
            await writeMedias(filteredMedias)
            response.status(204).send()
        } else {
            next(createHttpError(404, `Media with imdbID ${request.params.id} was not found!`))
        }

    } catch (error) {
        next(error)
    }
})




export default mediaRouter