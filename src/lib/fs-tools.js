import fs from 'fs-extra'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'


const { readJSON, writeJSON } = fs


const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const mediasJSONPath = join(dataFolderPath, "medias.json")


export const getMedias = () => readJSON(mediasJSONPath)
export const writeMedias = (mediasArray) => writeJSON(mediasJSONPath, mediasArray)

export const addMediaToJSON = async (medias, mediasToAdd) => {
    try {
        for (const media of mediasToAdd) {
            const index = medias.findIndex(existingMedia => existingMedia.title === media.title)
            if (index === -1) {
                medias.push(media)
                await writeMedias(medias)
            }
        }
    } catch (error) {
        createHttpError(400, { message: error })
    }
}