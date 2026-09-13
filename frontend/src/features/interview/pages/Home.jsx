import React, { useState, useRef } from 'react'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview'
import { Link, useNavigate } from 'react-router'

const Home = () => {

    const { loading, generateReport, reports } = useInterview()

    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeFile, setResumeFile] = useState(null)

    const resumeInputRef = useRef(null)

    const navigate = useNavigate()


    const handleResumeChange = (e) => {

        const file = e.target.files?.[0]

        if (!file) {
            return
        }

        // File type validation
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]

        if (!allowedTypes.includes(file.type)) {
            alert("Please upload a PDF or DOCX file")
            e.target.value = ""
            return
        }

        // 10 MB validation
        if (file.size > 10 * 1024 * 1024) {
            alert("Resume size must be less than 10MB")
            e.target.value = ""
            return
        }

        setResumeFile(file)
    }


    const removeResume = () => {

        setResumeFile(null)

        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }


    const handlePaste = async () => {

        try {

            const text = await navigator.clipboard.readText()

            setJobDescription(text)

        } catch (err) {

            console.error("Clipboard error:", err)

            alert("Unable to access clipboard. Please paste manually.")

        }
    }


    const handleGenerateReport = async () => {

        try {

            // Job description validation
            if (!jobDescription.trim()) {
                alert("Please enter a job description")
                return
            }


            // Resume validation
            if (!resumeFile) {
                alert("Please upload your resume")
                return
            }


            const data = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile
            })


            if (!data || !data._id) {

                console.error("Invalid report data:", data)

                alert("Interview report was not generated. Please try again.")

                return
            }


            navigate(`/interview/${data._id}`)

        } catch (err) {

            console.error(
                "Generate report failed:",
                err.response?.data || err.message
            )

            alert(
                err.response?.data?.message ||
                "Failed to generate interview report"
            )
        }
    }


    if (loading) {

        return (

            <main className="loadingScreen">

                <h1>
                    Generating your interview plan...
                </h1>

                <p>
                    AI is analyzing your resume and job description.
                </p>

            </main>

        )
    }


    return (

        <div className="home-shell">


            {/* TOP BAR */}

            <header className="topbar">

                <a
                    className="brand"
                    href="/"
                    aria-label="CareerMatch home"
                >

                    <span className="brand-mark">
                        ✦
                    </span>

                    <span>
                        CareerMatch
                        <span className="brand-accent">
                            .ai
                        </span>
                    </span>

                    <span className="version-pill">
                        AI 2.5
                        <br />
                        <small>NEURAL</small>
                    </span>

                </a>


                <nav
                    className="topnav"
                    aria-label="Primary navigation"
                >

                    <a
                        className="active"
                        href="#workspace"
                    >
                        Workspace
                    </a>

                    <Link to="/history">
                        History
                    </Link>

                </nav>

            </header>


            {/* MAIN */}

            <main
                className="home"
                id="workspace"
            >


                {/* PAGE HEADING */}

                <div className="page-heading">

                    <div>

                        <h1>
                            AI Job Fit &amp; Resume Analysis

                            <span className="heading-version">
                                v3.4
                                <br />
                                <small>Production</small>
                            </span>

                        </h1>


                        <p>
                            Compare targeted requirements against your candidate
                            background for tailored match scoring.
                        </p>

                    </div>

                </div>


                <div className="interview-input-group">


                    {/* JOB DESCRIPTION */}

                    <section
                        className="panel job-panel"
                        aria-labelledby="job-title"
                    >

                        <div className="panel-heading">

                            <span className="section-icon blue">
                                ▤
                            </span>


                            <div>

                                <h2 id="job-title">

                                    Job Description

                                    <span className="required-tag">
                                        Mandatory
                                    </span>

                                </h2>


                                <p>
                                    Target role description and core prerequisites
                                </p>

                            </div>


                            <div className="panel-actions">

                                <button
                                    type="button"
                                    onClick={handlePaste}
                                >
                                    ⌘ Paste
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setJobDescription("")
                                    }
                                >
                                    Clear
                                </button>

                            </div>

                        </div>


                        <textarea
                            value={jobDescription}
                            onChange={(e) =>
                                setJobDescription(e.target.value)
                            }
                            name="jobDescription"
                            id="jobDescription"
                            placeholder="Paste or enter job description here... (e.g., responsibilities, requirements, key qualifications, required tech stack, or role expectations)"
                        />


                        <div className="field-status">

                            <span>
                                <i />
                                {jobDescription.trim()
                                    ? "Ready for analysis"
                                    : "Waiting for job description"}
                            </span>


                            <b>
                                •
                            </b>


                            <span>
                                Optimal length: 200–1200 words
                            </span>


                            <span className="character-count">
                                {jobDescription.length} characters
                            </span>

                        </div>

                    </section>


                    {/* RIGHT COLUMN */}

                    <div className="side-column">


                        {/* RESUME */}

                        <section
                            className="panel resume-panel"
                            aria-labelledby="resume-title"
                        >

                            <div className="panel-heading">

                                <span className="section-icon pink">
                                    ♙
                                </span>


                                <div>

                                    <h2 id="resume-title">

                                        Resume

                                        <span className="format-tag">
                                           only PDF up to
                                            <br />
                                            10MB
                                        </span>

                                    </h2>


                                    <p>
                                        Use resume and self description
                                        both for best result.
                                    </p>

                                </div>

                            </div>


                            {/* UPLOAD */}

                            <label
                                className="upload-zone"
                                htmlFor="resume"
                            >

                                <span className="upload-icon">
                                    ♧
                                </span>


                                <strong>

                                    <u>
                                        Click to upload
                                    </u>

                                    {" "}

                                    <em>
                                        or drag and drop
                                    </em>

                                </strong>


                                <small>
                                    PDF or DOCX files up to 10MB
                                </small>

                            </label>


                            <input
                                ref={resumeInputRef}
                                hidden
                                type="file"
                                name="resume"
                                id="resume"
                                accept=".pdf,.docx"
                                onChange={handleResumeChange}
                            />


                            {/* SELECTED FILE */}

                            {resumeFile && (

                                <div className="uploaded-file">

                                    <span className="file-icon">
                                        ▤
                                    </span>


                                    <div>

                                        <strong>
                                            {resumeFile.name}
                                        </strong>


                                        <small>
                                            {(
                                                resumeFile.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}
                                            {" "}MB • Ready
                                        </small>

                                    </div>


                                    <button
                                        type="button"
                                        aria-label="Remove resume"
                                        onClick={removeResume}
                                    >
                                        ×
                                    </button>

                                </div>

                            )}

                        </section>


                        {/* SELF DESCRIPTION */}

                        <section
                            className="panel self-panel"
                            aria-labelledby="self-title"
                        >

                            <div className="subsection-heading">

                                <div>

                                    <h2 id="self-title">

                                        Self Description

                                        <span className="optional-tag">
                                            OPTIONAL
                                        </span>

                                    </h2>


                                    <p>
                                        Add context not fully reflected in
                                        your CV (transitions, strengths,
                                        passions).
                                    </p>

                                </div>


                                <span>
                                    Elevator pitch
                                </span>

                            </div>


                            <textarea
                                value={selfDescription}
                                onChange={(e) =>
                                    setSelfDescription(e.target.value)
                                }
                                name="selfDescription"
                                id="selfDescription"
                                placeholder="Describe yourself in a few sentences (Optional)..."
                            />


                            <div className="quick-add">

                                <span>
                                    Quick add:
                                </span>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelfDescription(
                                            `${selfDescription} Team Leadership`
                                        )
                                    }
                                >
                                    + Team
                                    <br />
                                    Leadership
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelfDescription(
                                            `${selfDescription} Startup Growth`
                                        )
                                    }
                                >
                                    + Startup
                                    <br />
                                    Growth
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelfDescription(
                                            `${selfDescription} System Design`
                                        )
                                    }
                                >
                                    + System
                                    <br />
                                    Design
                                </button>

                            </div>

                        </section>


                        {/* GENERATE */}

                        <section className="panel generate-panel">

                            <button
                                onClick={handleGenerateReport}
                                className="generate-btn"
                                type="button"
                            >

                                <span>
                                    ϟ
                                </span>

                                Generate Report

                            </button>


                            <p>
                                ♧ &nbsp;
                                AI evaluation completes in ~3 to 6 seconds
                            </p>

                        </section>

                    </div>

                </div>


                {/* FOOTER */}

                <footer className="site-footer">

                    <p>

                        <span className="status-dot" />

                        All systems operational.

                        <b>
                            •
                        </b>

                        🔒 Your resume data is encrypted and never shared.

                    </p>


                    <nav>

                        <a href="#privacy">
                            Privacy Policy
                        </a>

                        <a href="#terms">
                            Terms of Service
                        </a>

                        <a href="#help">
                            Help &amp; Documentation
                        </a>

                    </nav>

                </footer>

            </main>

        </div>
    )
}

export default Home