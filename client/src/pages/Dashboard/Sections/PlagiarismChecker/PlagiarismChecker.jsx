import { useCallback, useEffect, useState } from "react";
import { FaFileUpload, FaInfoCircle } from "react-icons/fa";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useAuth } from "../../../../context/AuthContext";
import { api, authConfig } from "../../../../lib/api";
import "./PlagiarismChecker.css";

GlobalWorkerOptions.workerSrc = pdfWorker;

const getColorClass = (percentage) => percentage < 30 ? "low-risk" : percentage < 55 ? "medium-risk" : "high-risk";
const csvCell = (value) => `"${String(value ?? "").replaceAll("\"", "\"\"")}"`;

const PlagiarismChecker = () => {
  const { token } = useAuth();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [inputError, setInputError] = useState("");
  const [controls, setControls] = useState({ lexicalThreshold: 0.18, semanticThreshold: 0.7, ignoreReferences: true });

  const loadReports = useCallback(async () => {
    try { const response = await api.get("/similarity/reports", authConfig(token)); setReports(response.data.reports); } catch { setReports([]); }
  }, [token]);
  useEffect(() => { if (token) loadReports(); }, [token, loadReports]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileLoading(true); setInputError("");
    try {
      let extractedText = "";
      if (file.name.toLowerCase().endsWith(".txt")) extractedText = await file.text();
      else if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        const pdf = await getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
        const pages = [];
        for (let pageNumber = 1; pageNumber <= Math.min(pdf.numPages, 50); pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const content = await page.getTextContent();
          pages.push(content.items.map((item) => item.str).join(" "));
        }
        extractedText = pages.join("\n\n");
      } else throw new Error("Choose a .txt file or a PDF with selectable text.");
      if (extractedText.trim().length < 80) throw new Error("No usable text was found. Scanned PDFs need OCR, which is not included yet.");
      setText(extractedText.slice(0, 20_000)); setFileName(file.name);
      if (extractedText.length > 20_000) setInputError("Only the first 20,000 characters were imported.");
    } catch (error) { setInputError(error.message || "The file could not be read."); }
    finally { setFileLoading(false); event.target.value = ""; }
  };

  const checkSimilarity = async () => {
    if (text.trim().length < 80) { setInputError("Paste or import at least 80 characters to run a similarity check."); return; }
    setInputError(""); setLoading(true);
    try {
      const response = await api.post("/similarity/check", { text, ...controls }, authConfig(token));
      setReport(response.data); setReports((current) => [response.data, ...current.filter((item) => item.id !== response.data.id)].slice(0, 20));
    } catch (error) { setInputError(error.response?.data?.error || "Could not run the similarity check. Make sure the API and ML service are running."); }
    finally { setLoading(false); }
  };

  const openReport = async (id) => {
    try { const response = await api.get(`/similarity/reports/${id}`, authConfig(token)); setReport(response.data); setText(response.data.input_text); setFileName(""); setControls({ lexicalThreshold: response.data.quality_controls.lexical_threshold, semanticThreshold: response.data.quality_controls.semantic_threshold, ignoreReferences: response.data.quality_controls.ignore_references }); }
    catch { setInputError("This saved report could not be loaded."); }
  };
  const deleteReport = async (id) => {
    try { await api.delete(`/similarity/reports/${id}`, authConfig(token)); setReports((current) => current.filter((item) => item.id !== id)); if (report?.id === id) setReport(null); } catch { setInputError("This report could not be deleted."); }
  };
  const excludeMatch = async (matchId) => {
    if (!report) return;
    try { const response = await api.patch(`/similarity/reports/${report.id}/matches/${matchId}`, { excluded: true }, authConfig(token)); setReport(response.data); setReports((current) => current.map((item) => item.id === response.data.id ? response.data : item)); }
    catch { setInputError("This source could not be excluded."); }
  };
  const downloadCsv = () => {
    if (!report) return;
    const rows = [["Report ID", "Created", "Highest match signal", "Source", "Paragraph", "Match basis", "Lexical score", "Semantic score", "Source URL", "Submitted text", "Reference text"], ...report.matches.map((match) => [report.id, report.created_at, `${report.summary.highest_passage_similarity}%`, match.source_name, match.source_paragraph, match.match_basis, match.lexical_score, match.semantic_score ?? "", match.source_url, match.submitted_text, match.source_text])];
    const blob = new Blob([rows.map((row) => row.map(csvCell).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `intellipaper-similarity-${report.id}.csv`; anchor.click(); URL.revokeObjectURL(url);
  };

  return <section className="plagiarism_checker_container">
    <header className="checker-heading"><p className="eyebrow">SIMILARITY CHECK</p><h1>Paragraph similarity checker</h1><p>Compare pasted text or an imported file with local sources and licensed OpenAlex candidates.</p></header>
    <div className="demo-notice" role="note"><FaInfoCircle /><span><strong>Manual review required.</strong> This tool reports wording and semantic similarity; it does not make a plagiarism verdict.</span></div>

    <div className="quality-controls"><div><label htmlFor="lexical-threshold">Lexical threshold: {Math.round(controls.lexicalThreshold * 100)}%</label><input id="lexical-threshold" type="range" min="0.05" max="0.8" step="0.05" value={controls.lexicalThreshold} onChange={(event) => setControls((current) => ({ ...current, lexicalThreshold: Number(event.target.value) }))} /></div><div><label htmlFor="semantic-threshold">Semantic threshold: {Math.round(controls.semanticThreshold * 100)}%</label><input id="semantic-threshold" type="range" min="0.45" max="0.95" step="0.05" value={controls.semanticThreshold} onChange={(event) => setControls((current) => ({ ...current, semanticThreshold: Number(event.target.value) }))} /></div><label className="reference-toggle"><input type="checkbox" checked={controls.ignoreReferences} onChange={(event) => setControls((current) => ({ ...current, ignoreReferences: event.target.checked }))} /> Ignore a References / Bibliography section</label></div>

    <label className="sr-only" htmlFor="similarity-text">Text to check</label><textarea id="similarity-text" className="text-input" placeholder="Paste one or more paragraphs here..." value={text} onChange={(event) => { setText(event.target.value); setFileName(""); setInputError(""); }} aria-invalid={Boolean(inputError)} aria-describedby={inputError ? "similarity-error" : "similarity-help"} />
    <div className="text-meta" id="similarity-help"><span>Minimum 80 characters {fileName ? `- imported from ${fileName}` : ""}</span><span>{text.trim().length.toLocaleString()} / 20,000</span></div>
    <label className="file-import"><FaFileUpload /><span>{fileLoading ? "Extracting file text..." : "Import .txt or text-based PDF"}</span><input type="file" accept=".txt,text/plain,.pdf,application/pdf" onChange={handleFileUpload} disabled={fileLoading} /></label>
    {inputError && <p id="similarity-error" className="form-error" role="alert">{inputError}</p>}
    <button type="button" className="check-btn" onClick={checkSimilarity} disabled={loading || fileLoading || text.trim().length > 20_000}>{loading ? "Finding and checking sources..." : "Run similarity check"}</button>

    {report && <div className="results_section" aria-live="polite"><div className="report-heading"><div><h2>Similarity report</h2><p>{report.engine} - {report.summary.corpus_paragraphs} reference paragraphs checked</p></div><span className="engine-badge">{report.semantic?.enabled ? "SEMANTIC + TF-IDF" : "TF-IDF BASELINE"}</span></div><p className="report-notice">{report.notice}</p><p className="reference-status" role="status">{report.reference_sources.message}</p><p className="semantic-status" role="status">{report.semantic.message}</p><button className="csv-btn" type="button" onClick={downloadCsv}>Download CSV report</button>
      <div className="report-metrics"><div><span>Highest match signal</span><strong className={getColorClass(report.summary.highest_passage_similarity)}>{report.summary.highest_passage_similarity}%</strong></div><div><span>Passages to review</span><strong>{report.summary.matched_passages}</strong></div><div><span>Reference paragraphs</span><strong>{report.summary.local_corpus_paragraphs} local / {report.summary.openalex_corpus_paragraphs} OpenAlex</strong></div></div>
      {report.matches.length ? <><h3>Possible matching passages</h3><div className="source-cards">{report.matches.map((match) => <article className="source-card" key={match.id}><div className="source-info"><div><strong>{match.source_name}, paragraph {match.source_paragraph}</strong><small>{match.source_provider}{match.source_license ? ` - ${match.source_license}` : ""}</small></div><span className={getColorClass(match.similarity_percentage)}>{match.similarity_percentage}% {match.match_basis} match</span></div><div className="match-bar"><div className={`match-fill ${getColorClass(match.similarity_percentage)}`} style={{ width: `${match.similarity_percentage}%` }} /></div><p className="score-details">Lexical: {Math.round(match.lexical_score * 100)}%{match.semantic_score != null ? ` | Semantic: ${Math.round(match.semantic_score * 100)}%` : ""}</p><div className="passage-comparison"><div><span>Your text</span><p>{match.submitted_text}</p></div><div><span>Reference text</span><p>{match.source_text}</p></div></div><div className="match-actions">{match.source_url && <a className="source-link" href={match.source_url} target="_blank" rel="noreferrer">Open source paper</a>}<button type="button" className="exclude-btn" onClick={() => excludeMatch(match.id)}>Exclude this match</button></div></article>)}</div></> : <div className="empty-match-state"><h3>No matching passages remain</h3><p>No source crossed the selected thresholds, or all matching sources were excluded from this report.</p></div>}</div>}

    <div className="previous_results"><h2>Saved report history</h2>{reports.length ? <table className="previous-results-table"><thead><tr><th>Created</th><th>Highest signal</th><th>Matches</th><th>Actions</th></tr></thead><tbody>{reports.map((item) => <tr key={item.id}><td>{new Date(item.created_at).toLocaleString()}</td><td><span className={getColorClass(item.summary.highest_passage_similarity)}>{item.summary.highest_passage_similarity}%</span></td><td>{item.summary.matched_passages}</td><td><button type="button" className="table-action" onClick={() => openReport(item.id)}>Open</button><button type="button" className="table-action danger" onClick={() => deleteReport(item.id)}>Delete</button></td></tr>)}</tbody></table> : <p className="history-empty">Run a check to save its report here.</p>}</div>
  </section>;
};

export default PlagiarismChecker;
