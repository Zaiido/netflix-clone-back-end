import Express from "express";
import cors from 'cors'
import listEndpoints from "express-list-endpoints";
import mediaRouter from "./api/medias/index.js";
import { badRequestHandler, generalErrorHandler, notfoundHandler } from "./errorHandlers.js";
import filesRouter from "./api/files/index.js";



const server = Express()
const port = process.env.PORT

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]
server.use(cors({
    origin: (currentOrigin, corsNext) => {
        if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
            corsNext(null, true)
        } else {
            corsNext(createHttpError(400, `Origin ${currentOrigin} is not in the whitelist!`))
        }
    }
}))

server.use(Express.json())

server.use("/medias", mediaRouter)
server.use("/medias", filesRouter)

server.use(badRequestHandler)
server.use(notfoundHandler)
server.use(generalErrorHandler)

server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
})