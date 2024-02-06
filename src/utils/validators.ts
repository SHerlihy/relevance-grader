import { NextFunction, Request, Response } from "express";
import { ValidationChain, body, validationResult } from "express-validator";

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const bodyTypes = {}
        for (const [key, value] of Object.entries(req.body)) {
            bodyTypes[key] = typeof value
        }

        for(let validation of validations) {
            await validation.run(req)
        }

        const errors = validationResult(req)

        if (false === errors.isEmpty()) {

            return res.status(422).json({
                errors: errors.array(),
                types: bodyTypes
            })
        }

        next()
        return
    }
}

export const gradeValidator = [
    body("resume").isString().trim().withMessage("Resume as string required"),
    body("description").isString().trim().withMessage("Description as string required"),
]
