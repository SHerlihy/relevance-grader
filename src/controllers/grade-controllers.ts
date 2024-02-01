import {Request,Response} from "express"
import OpenAI from "openai"

const openai = new OpenAI({apiKey: process.env.GPT_KEY});

const ROLE_PROMPT = "When I give you my resume and a job description, I want you to tell me how relevent my resume is on a scale of 0 to 100 with 0 bing irrelevant and 100 being relevant."

export const grade = async(
        req: Request,
        res: Response,
    ) => {
    try {
        const grading = createGrade(res, req.body.resume, req.body.description)
        return res.status(201).json({
            message: "OK",
            grading
        })
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            message: "ERROR",
            cause: err.message
        })
    }
}

const createGrade = async(
    res: Response,
    resume: string,
    description: string
) => {
    try {
        const completion = await openai.chat.completions.create({
          messages: [
                  {
                      role: "system",
                      content: ROLE_PROMPT,
                  },
                  {
                      role: "user",
                      content: resume,
                  },
                  {
                      role: "user",
                      content: description,
                  },
          ],
          model: "gpt-3.5-turbo",
        });
        
        console.log(completion.choices[0].message.content);

        return res.status(201).json({
          message: "OK",
          score: completion.choices[0].message.content,
        })
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            message: "ERROR",
            cause: err.message
        })
    }
}
