import {
    generateInterviewReport,
    getInterviewReportById,
    getAllInterviewReports,
    getResumePdf
} from "../services/interview.api.js"

import { useContext } from "react"
import { InterviewContext } from "../interview.context.jsx"


export const useInterview = () => {

    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error(
            "useInterview must be used within an InterviewProvider"
        )
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports
    } = context


    // Generate new interview report
    const generateReport = async ({
        jobDescription,
        selfDescription,
        resumeFile
    }) => {

        setLoading(true)

        try {

            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            })

            console.log("Generate report response:", response)

            if (!response?.interviewReport) {
                throw new Error(
                    "Invalid report data received from server"
                )
            }

            setReport(response.interviewReport)

            return response.interviewReport

        } catch (err) {

            console.error(
                "Generate report failed:",
                err.response?.data || err.message
            )

            throw err

        } finally {

            setLoading(false)

        }
    }


    // Get report by ID
    const getReportById = async (interviewId) => {

        setLoading(true)

        try {

            const response =
                await getInterviewReportById(interviewId)

            console.log(
                "Interview report by ID:",
                response
            )

            if (!response?.interviewReport) {
                throw new Error(
                    "Invalid interview report data"
                )
            }

            setReport(response.interviewReport)

            return response.interviewReport

        } catch (err) {

            console.error(
                "Get report failed:",
                err.response?.data || err.message
            )

            throw err

        } finally {

            setLoading(false)

        }
    }


    // Get all reports
    const getReports = async () => {

        setLoading(true)

        try {

            const response =
                await getAllInterviewReports()

            console.log(
                "All interview reports:",
                response
            )

            if (!response?.interviewReports) {
                throw new Error(
                    "Invalid interview reports data"
                )
            }

            setReports(response.interviewReports)

            return response.interviewReports

        } catch (err) {

            console.error(
                "Get all reports failed:",
                err.response?.data || err.message
            )

            throw err

        } finally {

            setLoading(false)

        }
    }


    // Download resume PDF
    const getResumePdfFile = async (interviewReportId) => {

        setLoading(true)

        try {

            const response = await getResumePdf(interviewReportId)

            console.log(
                "Resume PDF response:",
                response
            )

            const blob = new Blob([response.data], {
                type: "application/pdf"
            })

            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")

            link.href = url
            link.download = `resume-${interviewReportId}.pdf`
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            return blob

        } catch (err) {

            console.error(
                "Get resume PDF failed:",
                err.response?.data || err.message
            )

            throw err

        } finally {

            setLoading(false)

        }
    }


    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdfFile
    }
}