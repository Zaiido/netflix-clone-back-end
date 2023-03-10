import Express from 'express'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary';
import { getMedias, writeMedias } from '../../lib/fs-tools.js'


const filesRouter = Express.Router()

const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "fs0522/mediaPosters"
        }
    })
}).single('poster')



filesRouter.post("/:id/poster", cloudinaryUploader, async (request, response, next) => {
    try {

        const medias = await getMedias()
        const index = medias.findIndex(media => media.imdbID === request.params.id)
        if (index !== -1) {
            const oldMedia = medias[index]
            const updatedMedia = { ...oldMedia, poster: request.file.path, updatedAt: new Date() }
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


export default filesRouter