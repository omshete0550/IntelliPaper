import React, { useState } from "react";
import "./PlagiarismChecker.css";

const PlagiarismChecker = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [plagiarismResult, setPlagiarismResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previousResults, setPreviousResults] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setPdfUrl(URL.createObjectURL(uploadedFile));
    }
  };

  const getColorClass = (percentage) => {
    if (percentage < 30) return "low-risk";
    if (percentage < 60) return "medium-risk";
    return "high-risk";
  };

  const checkPlagiarism = () => {
    setLoading(true);
    setTimeout(() => {
      const newResult = {
        id: previousResults.length + 1,
        name: file ? file.name : "Text Submission",
        percentage: Math.floor(Math.random() * 100),
        sources: [
          { source: "arxiv.org/1234", match: 25 },
          { source: "researchgate.net/5678", match: 50 },
          { source: "wikipedia.org/AI", match: 75 },
        ],
        pdfUrl,
      };
      setPlagiarismResult(newResult);
      setPreviousResults([...previousResults, newResult]);
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

          {plagiarismResult.pdfUrl && (
            <div className="pdf-viewer">
              <h3>Uploaded Document</h3>
              <iframe
                src={plagiarismResult.pdfUrl}
                className="pdf-frame"
                title="Uploaded PDF"
              ></iframe>
            </div>
          )}

          <button className="download_btn">Download Report</button>
        </div>
      )}

      {previousResults.length > 0 && (
        <div className="previous_results">
          <h2>Previous Reports</h2>
          <table className="previous-results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Document Name</th>
                <th>Plagiarism (%)</th>
              </tr>
            </thead>
            <tbody>
              {previousResults.map((result) => (
                <tr key={result.id}>
                  <td>{result.id}</td>
                  <td>{result.name}</td>
                  <td className={getColorClass(result.percentage)}>
                    {result.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlagiarismChecker;
