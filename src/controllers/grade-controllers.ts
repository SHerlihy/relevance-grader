import {Request,Response} from "express"
import OpenAI from "openai"

const getGrade = async(resume:string,description:string)=>{
    //may as well, don't see re-instantiation as bottleneck
    const openai = new OpenAI({apiKey: process.env.GPT_KEY});
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
    
    return completion.choices[0].message.content
}

export const grade = async(
        req: Request,
        res: Response,
    ) => {
    try {
        const {resume, description} = req.body

        let score: string
        if (process.env.ENVIRONMENT === "development") {
            score = "22"
        } else {
            score = await getGrade(resume, description)
        }

        return res.status(201).json({
          message: "OK",
          score
        })
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            message: err.message
        })
    }
}
