import dotenv from 'dotenv'
import { GoogleGenAI } from "@google/genai"
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"
import puppeteer from "puppeteer"

dotenv.config()

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behaviouralQuestions: z.array(z.object({
        question: z.string().describe("The behavioural question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioural questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    jobTitle: z.string().describe("The title of the job for which the interview report is generated"),
})

function normalizeJsonText(text) {
    if (!text) return null

    const cleaned = String(text)
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim()

    return cleaned
}

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
    const prompt = `Generate an interview report for a candidate.

CANDIDATE RESUME:
${resume}

CANDIDATE SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

Analyze the candidate against the job description.
strict line :- Generate a json object that strictly adheres to the following schema, and generate only the fields mentioned in the schema. Do not add any extra fields or remove any fields from the schema. The schema is as follows:
and only generate the json object do not add any extra text or explanation outside the json object. The schema is as follows:

Return:
- matchScore from 0 to 100
- "technicalQuestions"
question
intention
answer
- "behaviouralQuestions"
question
intention
answer
- "skillGaps"
skill (string)
severity(string)(enum: low, medium, high)
- "preparationPlan"
day (number)
focus (string)
tasks (array of strings)
- jobTitle (string) optional if user gives it in the job description, otherwise you can extract it from the job description.

Make the questions relevant to the candidate's actual resume and the given job description.
Do not invent experience that is not present in the resume.
`
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseFormat: {
                    text: {
                        mimeType: "application/json",
                        schema: zodToJsonSchema(interviewReportSchema)
                    }
                }
            }
        })
        console.log("AI RESPONSE:", response);
        console.log("AI TEXT:", response?.text);
        const jsonText = normalizeJsonText(response?.text)
        if (!jsonText) {
            throw new Error('AI returned empty response for interview report.')
        }
        const result = JSON.parse(jsonText)
        return result
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function generateHtmlToPdf(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
    const pdfBuffer = await page.pdf({ format: 'A4' })
    await browser.close()
    return pdfBuffer
}

async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML resume content that can be converted to a PDF.")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseFormat: {
                text: {
                    mimeType: "application/json",
                    schema: zodToJsonSchema(resumePdfSchema)
                }
            }
        }
    })

    const jsonText = normalizeJsonText(response?.text)
    if (!jsonText) {
        throw new Error('AI returned empty response for resume HTML.')
    }

    const jsonContent = JSON.parse(jsonText)
    return generateHtmlToPdf(jsonContent.html)
}

export default { generateInterviewReport, generateResumePdf }