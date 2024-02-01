import { NextFunction, Request, Response } from "express";
import { ValidationChain, body, validationResult } from "express-validator";

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for(let validation of validations) {
            const result = await validation.run(req)
            if (!result.isEmpty()) {
                break
            }
        }

        const errors = validationResult(req)

        if(errors.isEmpty()) {
            next()
            return
        }

        return res.status(422).json({
            errors: errors.array()
        })
    }
}

export const gradeValidator = [
    body("resume").trim().isString().withMessage("Resume as string required"),
    body("description").trim().isString().withMessage("Description as string required"),
]
