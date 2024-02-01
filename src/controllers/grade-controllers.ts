import {Request,Response} from "express"
import OpenAI from "openai"

const openai = new OpenAI({apiKey: process.env.GPT_KEY});

export const grade = async(
        req: Request,
        res: Response,
    ) => {
    try {
        const {resume, description} = req.body
        const completion = await openai.chat.completions.create({
          messages: [
                  {
                      role: "system",
                      content: process.env.ROLE_PROMPT,
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
