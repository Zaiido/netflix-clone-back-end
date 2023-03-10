import fs from 'fs-extra'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'


const { readJSON, writeJSON } = fs


const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const mediasJSONPath = join(dataFolderPath, "medias.json")


export const getMedias = () => readJSON(mediasJSONPath)
export const writeMedias = (mediasArray) => writeJSON(mediasJSONPath, mediasArray)