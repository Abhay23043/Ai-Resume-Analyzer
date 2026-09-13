import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import '../style/history.scss'
import { useInterview } from '../hooks/useInterview'

const History = () => {
  const { loading, reports, getReports } = useInterview()
  const navigate = useNavigate()

  useEffect(() => {
    getReports().catch(() => {})
  }, [])

  if (loading && !reports.length) {
    return (
      <main className="loadingScreen">
        <h1>Loading your interview history...</h1>
        <p>Please wait while we fetch your saved reports.</p>
      </main>
    )
  }

  return (
    <div className="history-shell">
      <header className="topbar">
        <Link className="brand" to="/" aria-label="CareerMatch home">
          <span className="brand-mark">✦</span>
          <span>
            CareerMatch
            <span className="brand-accent">.ai</span>
          </span>
          <span className="version-pill">
            AI 2.5
            <br />
            <small>NEURAL</small>
          </span>
        </Link>

        <nav className="topnav" aria-label="Primary navigation">
          <Link to="/">Workspace</Link>
          <Link className="active" to="/history">History</Link>
        </nav>
      </header>

      <main className="history-page">
        <div className="page-heading">
          <div>
            <h1>
              Interview History
              <span className="heading-version">
                {reports.length}
                <br />
                <small>saved</small>
              </span>
            </h1>
            <p>Review your past interview reports and continue from where you left off.</p>
          </div>
        </div>

        <div className="history-list">
          {!reports.length ? (
            <div className="empty-state">
              <h2>No reports yet</h2>
              <p>You have not generated any interview reports yet.</p>
              <Link to="/">Generate your first report</Link>
            </div>
          ) : (
            reports.map((report) => (
              <button
                type="button"
                key={report._id || report.id}
                className="history-card"
                onClick={() => navigate(`/interview/${report._id || report.id}`)}
              >
                <div className="history-card-header">
                  <span className="history-tag">{report.title || 'Interview report'}</span>
                  <span className="history-date">
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <h3>{report.title || 'Interview report'}</h3>
                <p>
                  {report.jobDescription
                    ? report.jobDescription.slice(0, 160)
                    : 'No job description available for this report.'}
                </p>

                <div className="history-meta">
                  <span>Match {report.matchScore ?? 0}%</span>
                  <span>{report.technicalQuestions?.length ?? 0} technical</span>
                  <span>{report.behaviouralQuestions?.length ?? 0} behavioral</span>
                </div>
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default History