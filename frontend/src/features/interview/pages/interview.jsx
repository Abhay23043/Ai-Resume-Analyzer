import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview'


const Interview = () => {

  const {
    report,
    loading,
    getReportById,
    getResumePdfFile
  } = useInterview()

  const navigate = useNavigate()

  const { interviewid } = useParams()


  const [section, setSection] = useState('behavioral')
  const [technicalIndex, setTechnicalIndex] = useState(0)
  const [behavioralIndex, setBehavioralIndex] = useState(null)
  const [exportOpen, setExportOpen] = useState(false)


  // Fetch report using interview ID from URL
  useEffect(() => {

    if (!interviewid) {
      return
    }

    if (!report || report._id !== interviewid) {
      getReportById(interviewid)
    }

  }, [interviewid])


  // Loading / report not available
  if (loading || !report) {

    return (
      <main className="loadingScreen">

        <h1>
          Loading your AI generated Resume...
        </h1>

        <p>
          Please wait while we prepare your interview plan.
        </p>

      </main>
    )
  }


  // Questions according to selected section
  const questions =
    section === 'technical'
      ? report.technicalQuestions
      : report.behaviouralQuestions


  const activeIndex =
    section === 'technical'
      ? technicalIndex
      : behavioralIndex


  // Change section
  const selectSection = (nextSection) => {

    setSection(nextSection)

    setBehavioralIndex(null)

    setExportOpen(false)

    document
      .getElementById('report-content')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
  }


  // Download report as JSON
  const downloadJson = () => {

    const file = new Blob(
      [
        JSON.stringify(report, null, 2)
      ],
      {
        type: 'application/json'
      }
    )

    const url = URL.createObjectURL(file)

    const link = document.createElement('a')

    link.href = url
    link.download = 'interview-report.json'

    link.click()

    URL.revokeObjectURL(url)

    setExportOpen(false)
  }


  // Move between technical questions
  const moveQuestion = (direction) => {

    setTechnicalIndex((current) => {

      const totalQuestions =
        report.technicalQuestions.length

      if (totalQuestions === 0) {
        return 0
      }

      return (
        (current + direction + totalQuestions) %
        totalQuestions
      )

    })
  }


  return (

    <div className="interview-report">


      {/* ================= TOP BAR ================= */}

      <header className="report-topbar">

        <button
          className="back-button"
          type="button"
          onClick={() => navigate(-1)}
        >
          ← <span>Back</span>
        </button>


        <a
          className="report-brand"
          href="/"
        >
          CareerMatch<span>.ai</span>
        </a>


        <div className="export-wrap">

          <button
            className="export-button"
            type="button"
            onClick={() =>
              setExportOpen((open) => !open)
            }
          >
            Export <span>⌄</span>
          </button>


          {exportOpen && (

            <div className="export-menu">

              <button
                type="button"
                onClick={downloadJson}
              >
                Download JSON
              </button>


              <button
                type="button"
                onClick={() => window.print()}
              >
                Print / Save PDF
              </button>

            </div>

          )}

        </div>

      </header>


      {/* ================= REPORT LAYOUT ================= */}

      <div className="report-layout">


        {/* ================= LEFT SIDEBAR ================= */}

        <aside
          className="report-sidebar"
          aria-label="Report sections"
        >

          <p className="sidebar-label">
            SECTIONS
          </p>

          <div className='sidebar-with-btn'>
            <nav>


              {/* Technical */}

              <button
                className={
                  section === 'technical'
                    ? 'selected'
                    : ''
                }
                type="button"
                onClick={() =>
                  selectSection('technical')
                }
              >

                <span>
                  ⌘
                </span>

                Technical Questions

                <b>
                  {report.technicalQuestions.length}
                </b>

              </button>


              {/* Behavioral */}

              <button
                className={
                  section === 'behavioral'
                    ? 'selected'
                    : ''
                }
                type="button"
                onClick={() =>
                  selectSection('behavioral')
                }
              >

                <span>
                  □
                </span>

                Behavioral Questions

                <b>
                  {report.behaviouralQuestions.length}
                </b>

              </button>


              {/* Preparation */}

              <button
                className={
                  section === 'roadmap'
                    ? 'selected'
                    : ''
                }
                type="button"
                onClick={() =>
                  selectSection('roadmap')
                }
              >

                <span>
                  ➤
                </span>

                Road Map

                <b>
                  {report.preparationPlan.length} days
                </b>

              </button>

            </nav>
            <div className='btn-note'>
              <p className="sidebar-note">NOTE: <small>Download Resume according to the Job Description </small>
              </p>
              <button
              onClick={()=>{getResumePdfFile(interviewid)}} className='generate-btn' type='button'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 2L21 7V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918C3 2.44405 3.44495 2 3.9934 2H16ZM13 12V8H11V12H8L12 16L16 12H13Z"></path></svg>
                Generate Resume</button>
            </div>
          </div>


        </aside>


        {/* ================= MAIN CONTENT ================= */}

        <main
          className="report-main"
          id="report-content"
        >


          {/* ================= QUESTIONS ================= */}

          {section !== 'roadmap' && (

            <section className="question-view">


              {/* Section Header */}

              <div className="section-header">

                <div>

                  <p className="eyebrow">
                    {report.title}
                  </p>


                  <h1>

                    {
                      section === 'technical'
                        ? 'Technical Questions'
                        : 'Behavioral Questions'
                    }

                    <span>
                      {questions.length} questions
                    </span>

                  </h1>

                </div>


                {/* Technical navigation */}

                {section === 'technical' && (

                  <div className="question-controls">

                    <button
                      type="button"
                      onClick={() =>
                        moveQuestion(-1)
                      }
                      aria-label="Previous question"
                    >
                      ←
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        moveQuestion(1)
                      }
                      aria-label="Next question"
                    >
                      →
                    </button>

                  </div>

                )}

              </div>


              {/* Question List */}

              <div className="question-list">

                {questions.map(
                  (
                    {
                      question,
                      intention,
                      answer
                    },
                    index
                  ) => (

                    <article
                      className={
                        `question-item ${activeIndex === index
                          ? 'active'
                          : ''
                        }`
                      }
                      key={`${question}-${index}`}
                    >


                      {/* Question */}

                      <button
                        className="question-trigger"
                        type="button"
                        onClick={() => {

                          if (
                            section === 'technical'
                          ) {

                            setTechnicalIndex(index)

                          } else {

                            setBehavioralIndex(
                              activeIndex === index
                                ? null
                                : index
                            )

                          }

                        }}
                      >

                        <span>
                          Q{index + 1}
                        </span>


                        <strong>
                          {question}
                        </strong>


                        <b>
                          {
                            activeIndex === index
                              ? '⌃'
                              : '⌄'
                          }
                        </b>

                      </button>


                      {/* Answer */}

                      {activeIndex === index && (

                        <div className="answer">


                          {/* Intention */}

                          <div className="question-intention">

                            <p className="answer-label">
                              INTERVIEWER INTENTION
                            </p>

                            <p>
                              {intention}
                            </p>

                          </div>


                          {/* Suggested Answer */}

                          <div className="suggested-answer">

                            <p className="answer-label">
                              SUGGESTED ANSWER
                            </p>

                            <p>
                              {answer}
                            </p>

                          </div>

                        </div>

                      )}

                    </article>

                  )
                )}

              </div>

            </section>

          )}


          {/* ================= PREPARATION ROADMAP ================= */}

          {section === 'roadmap' && (

            <section className="roadmap-view">


              <div className="section-header">

                <div>

                  <p className="eyebrow">
                    PREPARATION PLAN
                  </p>


                  <h1>

                    Your {report.preparationPlan.length}-day roadmap

                    <span>
                      {report.preparationPlan.length} days
                    </span>

                  </h1>

                </div>

              </div>


              <div className="roadmap-grid">

                {report.preparationPlan.map(
                  (
                    {
                      day,
                      focus,
                      tasks
                    },
                    index
                  ) => (

                    <article
                      key={`${day}-${index}`}
                    >

                      <span>
                        Day {day}
                      </span>


                      <h2>
                        {focus}
                      </h2>


                      <ul>

                        {tasks.map(
                          (task, taskIndex) => (

                            <li
                              key={taskIndex}
                            >
                              {task}
                            </li>

                          )
                        )}

                      </ul>

                    </article>

                  )
                )}

              </div>

            </section>

          )}

        </main>


        {/* ================= RIGHT SIDEBAR ================= */}

        <aside
          className="insights-sidebar"
          aria-label="Report insights"
        >


          {/* Match Score */}

          <section className="match-score">

            <p>
              MATCH SCORE
            </p>


            <div>

              <strong>
                {report.matchScore}
              </strong>

              <span>
                %
              </span>

            </div>


            <b>
              Strong match for this role
            </b>

          </section>


          {/* Skill Gaps */}

          <section className="skills">

            <p className="sidebar-label">
              SKILL GAPS
            </p>


            {report.skillGaps.map(
              (
                {
                  skill,
                  severity
                },
                index
              ) => (

                <div
                  className={`skill-item chip-${index}`}
                  key={skill}
                >

                  <span className="skill-chip">
                    {skill}
                  </span>


                  <small>
                    {severity}
                  </small>

                </div>

              )
            )}

          </section>

        </aside>

      </div>

    </div>
  )
}


export default Interview