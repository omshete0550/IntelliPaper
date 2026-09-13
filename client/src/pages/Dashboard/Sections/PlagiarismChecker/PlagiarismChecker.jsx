import { useState } from "react";
import { FaFileUpload, FaInfoCircle } from "react-icons/fa";
import "./PlagiarismChecker.css";

const PlagiarismChecker = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [plagiarismResult, setPlagiarismResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previousResults, setPreviousResults] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [inputError, setInputError] = useState("");

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile ?? null);
    setInputError("");
    setPdfUrl(uploadedFile?.type === "application/pdf" ? URL.createObjectURL(uploadedFile) : null);
  };
  const getColorClass = (percentage) => percentage < 30 ? "low-risk" : percentage < 60 ? "medium-risk" : "high-risk";
  const checkSimilarity = () => {
    if (!text.trim() && !file) { setInputError("Paste text or choose a file before starting a preview."); return; }
    setInputError(""); setLoading(true);
    window.setTimeout(() => {
      const newResult = { id: previousResults.length + 1, name: file ? file.name : "Text submission", percentage: Math.floor(Math.random() * 100), sources: [{ source: "arxiv.org/1234", match: 25 }, { source: "researchgate.net/5678", match: 50 }, { source: "wikipedia.org/AI", match: 75 }], pdfUrl };
      setPlagiarismResult(newResult); setPreviousResults((results) => [...results, newResult]); setLoading(false);
    }, 900);
  };

  return (
    <section className="plagiarism_checker_container">
      <header className="checker-heading"><div><p className="eyebrow">SIMILARITY CHECK</p><h1>Document similarity preview</h1><p>Preview the future checker experience before a plagiarism-detection service is connected.</p></div></header>
      <div className="demo-notice" role="note"><FaInfoCircle /><span><strong>Demo only</strong> — Scores and matched sources below are simulated and are not plagiarism results.</span></div>
      <label className="sr-only" htmlFor="similarity-text">Text to check</label><textarea id="similarity-text" className="text-input" placeholder="Paste your text here…" value={text} onChange={(event) => { setText(event.target.value); setInputError(""); }} aria-invalid={Boolean(inputError)} aria-describedby={inputError ? "similarity-error" : undefined} />
      <label className="file-upload"><FaFileUpload className="upload-icon" /><span className="upload-label">{file ? file.name : "Choose a text, PDF, or DOCX file"}</span><small>File analysis is preview-only until the checker service is connected.</small><input type="file" accept=".txt,.pdf,.docx" onChange={handleFileUpload} /></label>
      {inputError && <p id="similarity-error" className="form-error" role="alert">{inputError}</p>}
      <button type="button" className="check-btn" onClick={checkSimilarity} disabled={loading}>{loading ? "Generating preview…" : "Run similarity preview"}</button>
      {plagiarismResult && <div className="results_section"><div className="report-heading"><div><h2>Similarity preview</h2><p>Simulated report for {plagiarismResult.name}</p></div><span className="demo-badge">DEMO</span></div><div className="progress-container"><div className={`progress-bar ${getColorClass(plagiarismResult.percentage)}`} style={{ width: `${plagiarismResult.percentage}%` }}>{plagiarismResult.percentage}%</div></div><h3>Example matched sources</h3><div className="source-cards">{plagiarismResult.sources.map((source) => <div className="source-card" key={source.source}><div className="source-info"><a href={`https://${source.source}`} target="_blank" rel="noopener noreferrer">{source.source}</a><span>{source.match}% example match</span></div><div className="match-bar"><div className={`match-fill ${getColorClass(source.match)}`} style={{ width: `${source.match}%` }} /></div></div>)}</div>{plagiarismResult.pdfUrl && <div className="pdf-viewer"><h3>Uploaded PDF preview</h3><iframe src={plagiarismResult.pdfUrl} className="pdf-frame" title="Uploaded PDF preview" /></div>}<button type="button" className="download_btn" disabled title="Report download will be available with the checker service">Download report coming soon</button></div>}
      {previousResults.length > 0 && <div className="previous_results"><h2>Preview history</h2><table className="previous-results-table"><thead><tr><th>#</th><th>Document</th><th>Preview score</th></tr></thead><tbody>{previousResults.map((result) => <tr key={result.id}><td>{result.id}</td><td>{result.name}</td><td className={getColorClass(result.percentage)}>{result.percentage}%</td></tr>)}</tbody></table></div>}
    </section>
  );
};

export default PlagiarismChecker;
