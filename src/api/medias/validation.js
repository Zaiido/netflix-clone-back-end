import { checkSchema, validationResult } from "express-validator";

const mediaSchema = {
    title: {
        in: ["body"],
        isString: {
            errorMessage: "Title is a mandatory field and needs to be a string!",
        }
    },
    year: {
        in: ["body"],
        isString: {
            errorMessage: "Year is a mandatory field and needs to be a string!",
        }
    },
    type: {
        in: ["body"],
        isString: {
            errorMessage: "Type is a mandatory field and needs to be a string!",
        }
    },
    poster: {
        in: ["body"],
        isString: {
            errorMessage: "Poster is a mandatory field and needs to be a string URL!",
        }
    }
}


export const checkMediaSchema = checkSchema(mediaSchema)

export const callBadRequest = (request, response, next) => {
    const errors = validationResult(request)

    console.log(errors.array())

    if (errors.isEmpty()) {
        next()
    } else {
        next(createHttpError(400, "Errors during post validation", { errorsList: errors.array() }))
    }
}

