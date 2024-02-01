import {Router} from "express"
import {grade} from "../controllers/grade-controllers.js"
import {gradeValidator, validate} from "../utils/validators.js"

const appRouter = Router()
appRouter.post("/grade", validate(gradeValidator), grade)

export default appRouter
