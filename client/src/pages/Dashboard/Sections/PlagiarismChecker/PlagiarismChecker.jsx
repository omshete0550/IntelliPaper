import React, { useState } from "react";
import "./PlagiarismChecker.css";

const PlagiarismChecker = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [plagiarismResult, setPlagiarismResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const getColorClass = (percentage) => {
    if (percentage < 30) return "low-risk";
    if (percentage < 60) return "medium-risk";
    return "high-risk";
  };

  const checkPlagiarism = () => {
    setLoading(true);
    setTimeout(() => {
      setPlagiarismResult({
        percentage: 48,
        sources: [
          { source: "arxiv.org/1234", match: 25 },
          { source: "researchgate.net/5678", match: 50 },
          { source: "wikipedia.org/AI", match: 75 },
        ],
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="plagiarism_checker_container">
      <h2>Plagiarism Checker</h2>

      <textarea
        className="text-input"
        placeholder="Paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <label className="file-upload">
        <span className="upload-icon">📂</span>
        <span className="upload-label">
          {file ? file.name : "Click to upload file"}
        </span>
        <input
          type="file"
          accept=".txt, .pdf, .docx"
          onChange={handleFileUpload}
        />
      </label>

      <button
        className="check-btn"
        onClick={checkPlagiarism}
        disabled={loading}
      >
        {loading ? "Checking..." : "Check Plagiarism"}
      </button>

      {plagiarismResult && (
        <div className="results_section">
          <h2>Plagiarism Report</h2>

          <div className="progress-container">
            <div
              className={`progress-bar ${getColorClass(
                plagiarismResult.percentage
              )}`}
              style={{ width: `${plagiarismResult.percentage}%` }}
            >
              {plagiarismResult.percentage}%
            </div>
          </div>

          <h3>Matched Sources</h3>
          <div className="source-cards">
            {plagiarismResult.sources.map((source, index) => (
              <div className="source-card" key={index}>
                <div className="source-info">
                  <a
                    href={`https://${source.source}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.source}
                  </a>
                  <span className="match-percentage">
                    {source.match}% match
                  </span>
                </div>
                <div className="match-bar">
                  <div
                    className={`match-fill ${getColorClass(source.match)}`}
                    style={{ width: `${source.match}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <button className="download_btn">Download Report</button>
        </div>
      )}
    </div>
  );
};

export default PlagiarismChecker;
