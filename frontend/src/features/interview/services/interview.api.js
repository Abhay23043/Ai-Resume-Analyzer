import axios from 'axios'

// *api layer*

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

/*
 * @description service to generate interview report
 */

export const generateInterviewReport = async ({
    jobDescription,
    selfDescription,
    resumeFile
}) => {
    const formData = new FormData()

    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post(
        "/api/interview",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    )

    return response.data
}

/*
 * @description service to get interview report by interviewId
 */

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(
        `/api/interview/report/${interviewId}`
    )

    return response.data
}

/*
 * @description service to get all interview reports
 */

export const getAllInterviewReports = async () => {
    const response = await api.get(
        `/api/interview/`
    )

    return response.data
}

/*
 * @description service to get resume PDF by interviewReportId
 */

export const getResumePdf = async (interviewReportId) => {
    const response = await api.post(
        `/api/interview/resume/pdf/${interviewReportId}`,
        {},
        {
            responseType: "blob"
        }
    )

    return response
}