import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { GroqError } from 'groq-sdk/index.js';

dotenv.config();

const groq = new Groq({apiKey : process.env.GROQ_API_KEY });

export const chatController = async(req , res) => {
    try{
      const {question} = req.body;

      if(!question){
        return req.status(400).send({
            success : false,
            message : 'Question is required'
        })
      }

      const response = await groq.chat.completions.create({
        model : "llama-3.3-70b-versatile",
        messages : [
            {
                role : "system",
                content : "You are a blood bank assistant for BloodCare Portal. Answer questions about blood donation, blood compatibility, blood groups, donation eligibility, and blood bank operations. Keep answers short and clear. If the question is not related to blood banking, politely say you can only help with blood-related questions."
            },
            {role : "user", content : question}
        ],
        max_tokens : 300,
      });

      const answer = response.choices[0]?.message?.content || "Sorry, I couldn't generate a response"

      return res.status(200).send({
        success : true,
        answer
      })
    } catch(e){
        console.log(e);
        return res.status(500).send({
            success : false,
            message : 'AI Service Error'
        })
    }
}