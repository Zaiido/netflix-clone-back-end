import { checkSchema } from "express-validator";


const reviewSchema = {
    comment: {
        in: ["body"],
        isString: {
            errorMessage: "Comment is a mandatory field and needs to be a string!",
        },
        notEmpty: {
            errorMessage: "Comment field cannot be empty!",
            options: { ignore_whitespace: true },
        },
    },
    rate: {
        in: ["body"],
        isInt: {
            options: {
                min: 1,
                max: 5,
            },
            errorMessage: "Rate is a mandatory field and needs to be a number between 1 and 5!",
        },
    },
};

export const checkReviewSchema = checkSchema(reviewSchema)