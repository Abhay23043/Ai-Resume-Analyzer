import { PDFParse } from 'pdf-parse'

import * as mammothModule from 'mammoth'

import generateReportfunctions from '../services/ai.service.js'

const {
    generateInterviewReport,
    generateResumePdf
} = generateReportfunctions

import interviewReportmodel from '../models/interviewReport.model.js'


// ======================================================
// Mammoth compatibility
// ======================================================

const mammoth =
    mammothModule.default || mammothModule



// ======================================================
// Extract Resume Text
// Supports PDF and DOCX
// ======================================================

async function extractResumeText(file) {

    const mimeType = file.mimetype || ''
    const fileName = file.originalname || ''


    // ==================================================
    // PDF
    // ==================================================

    if (
        mimeType === 'application/pdf' ||
        fileName.toLowerCase().endsWith('.pdf')
    ) {

        const parser = new PDFParse({
            data: file.buffer
        })

        try {

            const pdfData = await parser.getText()

            return pdfData.text || ''

        } finally {

            // Free parser resources
            await parser.destroy()

        }
    }


    // ==================================================
    // DOCX
    // ==================================================

    if (
        mimeType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileName.toLowerCase().endsWith('.docx')
    ) {

        const result =
            await mammoth.extractRawText({
                buffer: file.buffer
            })

        return result.value || ''
    }


    // ==================================================
    // Unsupported File
    // ==================================================

    throw new Error(
        'Unsupported resume file type. Please upload PDF or DOCX.'
    )
}



// ======================================================
// Generate Interview Report
// ======================================================

/**
 * @description
 * Controller to generate an interview report
 * based on:
 *
 * 1. User self description
 * 2. Resume
 * 3. Job description
 */

async function generateInterviewReportController(req, res) {

    try {

        // ==================================================
        // Check Resume
        // ==================================================

        if (!req.file) {

            return res.status(400).json({
                message: "Resume file is required"
            })

        }


        // ==================================================
        // Extract Resume Text
        // ==================================================

        const resumeText =
            await extractResumeText(req.file)


        // ==================================================
        // Get Form Data
        // ==================================================

        const {
            selfDescription,
            jobDescription
        } = req.body


        // ==================================================
        // Generate Report Using AI
        // ==================================================

        const interviewReportBYAI =
            await generateInterviewReport({

                resume: resumeText,

                selfDescription,

                jobDescription

            })


        // ==================================================
        // Save Report In MongoDB
        // ==================================================

        const interviewReport =
            await interviewReportmodel.create({

                // Logged-in user's ID
                user: req.user.id,

                // Extracted resume text
                resume: resumeText,

                // User description
                selfDescription,

                // Job description
                jobDescription,

                // AI generated report
                ...interviewReportBYAI

            })


        // ==================================================
        // Send Response
        // ==================================================

        return res.status(201).json({

            message:
                "Interview report generated successfully",

            interviewReport

        })

    } catch (err) {

        console.error(
            "🔥 GENERATE REPORT ERROR:",
            err
        )

        return res.status(500).json({

            message:
                `Failed to generate interview report: ${err.message}`

        })

    }
}



// ======================================================
// Get Interview Report By ID
// ======================================================

/**
 * @description
 * Get a single interview report
 * using interviewId
 */

async function generateInterviewReportByIdcontroller(
    req,
    res
) {

    try {

        // ==================================================
        // Get ID From URL
        // ==================================================

        const {
            interviewId
        } = req.params


        // ==================================================
        // Find Report
        //
        // IMPORTANT:
        // We also check user ID so one user cannot
        // access another user's report.
        // ==================================================

        const interviewReport =
            await interviewReportmodel.findOne({

                _id: interviewId,

                user: req.user.id

            })


        // ==================================================
        // Report Not Found
        // ==================================================

        if (!interviewReport) {

            return res.status(404).json({

                message:
                    "Interview report not found"

            })

        }


        // ==================================================
        // Success
        // ==================================================

        return res.status(200).json({

            message:
                "Interview report fetched successfully",

            interviewReport

        })

    } catch (err) {

        console.error(
            "🔥 GET REPORT ERROR:",
            err
        )

        return res.status(500).json({

            message:
                `Failed to fetch interview report: ${err.message}`

        })

    }
}



// ======================================================
// Get All Interview Reports
// ======================================================

/**
 * @description
 * Get all interview reports
 * belonging to logged-in user
 */

async function generateAllInterviewReportsController(
    req,
    res
) {

    try {

        // ==================================================
        // Find Reports
        // ==================================================

        const interviewReports =
            await interviewReportmodel

                .find({
                    user: req.user.id
                })

                // Newest first
                .sort({
                    createdAt: -1
                })

                // Do not send large/private fields
                .select(
                    "-resume -selfDescription -__v"
                )


        // ==================================================
        // Send Response
        // ==================================================

        return res.status(200).json({

            message:
                "Interview reports fetched successfully",

            interviewReports

        })

    } catch (err) {

        console.error(
            "🔥 GET ALL REPORTS ERROR:",
            err
        )

        return res.status(500).json({

            message:
                `Failed to fetch interview reports: ${err.message}`

        })

    }
}



// ======================================================
// Generate Resume PDF
// ======================================================

/**
 * @description
 * Generate resume PDF from resume HTML content
 */

async function generateResumePdfController(
    req,
    res
) {

    try {

        // ==================================================
        // Get Interview Report ID
        // ==================================================

        const {
            interviewReportId
        } = req.params


        // ==================================================
        // Find Report
        //
        // IMPORTANT:
        // Check BOTH:
        //
        // 1. Report ID
        // 2. Logged-in user's ID
        //
        // This prevents another authenticated user from
        // accessing someone else's report.
        // ==================================================

        const interviewReport =
            await interviewReportmodel.findOne({

                _id: interviewReportId,

                user: req.user.id

            })


        // ==================================================
        // Report Not Found
        // ==================================================

        if (!interviewReport) {

            return res.status(404).json({

                message:
                    "Interview report not found"

            })

        }


        // ==================================================
        // Generate PDF Using AI Service
        // ==================================================

        const pdfBuffer =
            await generateResumePdf({

                resume:
                    interviewReport.resume,

                selfDescription:
                    interviewReport.selfDescription,

                jobDescription:
                    interviewReport.jobDescription

            })


        // ==================================================
        // Set PDF Response Headers
        // ==================================================

        res.set({

            "Content-Type":
                "application/pdf",

            "Content-Disposition":
                `attachment; filename=interview_report_${interviewReportId}.pdf`

        })


        // ==================================================
        // Send PDF Buffer
        // ==================================================

        return res.send(pdfBuffer)

    } catch (err) {

        console.error(
            "🔥 RESUME PDF ERROR:",
            err
        )

        return res.status(500).json({

            message:
                `Failed to generate resume PDF: ${err.message}`

        })

    }
}



// ======================================================
// EXPORT CONTROLLERS
// ======================================================

export default {

    generateInterviewReportController,

    generateInterviewReportByIdcontroller,

    generateAllInterviewReportsController,

    generateResumePdfController

}