import { useEffect, useState } from "react";
import { FaChevronDown, FaDownload, FaExternalLinkAlt, FaFileAlt, FaFileDownload, FaSearch } from "react-icons/fa";
import { api } from "../../../../lib/api";
import "./PublishingGuide.css";

const steps = [
  { title: "Choose a research topic", content: "Start with a question that is specific enough to investigate, meaningful to your field, and supported by a clear research gap." },
  { title: "Conduct a literature review", content: "Read foundational and recent work, group it by theme, and document the gaps or disagreements you want to address." },
  { title: "Write your research paper", content: "Build a clear narrative through your abstract, introduction, methodology, results, discussion, and conclusion." },
  { title: "Select a journal", content: "Compare scope, audience, review timelines, open-access options, and author instructions before choosing a venue." },
  { title: "Format your paper", content: "Use the journal or conference template early and check citations, figures, references, and required declarations." },
  { title: "Submit and peer review", content: "Prepare a thoughtful cover letter and respond to reviewers directly, respectfully, and with evidence." },
  { title: "Publication and promotion", content: "After acceptance, share a concise research summary with relevant communities and update your academic profile." },
];

const templates = [
  {
    title: "Research paper outline",
    description: "A Markdown structure for planning a research paper before formatting for a target journal.",
    filename: "intellipaper-research-outline.md",
    type: "Markdown",
    content: ["# Research paper title", "", "**Author:** Your name  ", "**Affiliation:** Your university or organization", "", "## Abstract", "Write a concise summary of the problem, method, main result, and contribution.", "", "## Keywords", "keyword 1; keyword 2; keyword 3", "", "## 1. Introduction", "- Research context", "- Problem and gap", "- Research question", "- Contributions", "", "## 2. Literature review", "", "## 3. Methodology", "", "## 4. Results", "", "## 5. Discussion", "", "## 6. Conclusion", "", "## References"].join("\n"),
  },
  {
    title: "LaTeX starter file",
    description: "A generic LaTeX starting point. Replace the document class after you choose a conference or journal.",
    filename: "intellipaper-paper-starter.tex",
    type: "LaTeX",
    content: ["\\documentclass[11pt]{article}", "\\usepackage[margin=1in]{geometry}", "\\usepackage{hyperref}", "", "\\title{Your Research Paper Title}", "\\author{Your Name \\\\ Your University}", "\\date{\\today}", "", "\\begin{document}", "\\maketitle", "", "\\begin{abstract}", "Write a concise summary of your research question, method, results, and contribution.", "\\end{abstract}", "", "\\section{Introduction}", "", "\\section{Related Work}", "", "\\section{Methodology}", "", "\\section{Results}", "", "\\section{Conclusion}", "", "\\bibliographystyle{plain}", "\\bibliography{references}", "\\end{document}"].join("\n"),
  },
];

const downloadTemplate = (template) => {
  const file = new Blob([template.content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = template.filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const PublishingGuide = ({ interests }) => {
  const [expandedStep, setExpandedStep] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showJournals, setShowJournals] = useState(false);
  const [journalQuery, setJournalQuery] = useState("");
  const [journals, setJournals] = useState([]);
  const [isSearchingJournals, setIsSearchingJournals] = useState(false);
  const [journalError, setJournalError] = useState("");
  const progress = expandedStep === null ? 0 : ((expandedStep + 1) / steps.length) * 100;

  useEffect(() => {
    if (!journalQuery && interests?.[0]) setJournalQuery(interests[0]);
  }, [interests, journalQuery]);

  const findJournals = async (event) => {
    event?.preventDefault();
    setIsSearchingJournals(true);
    setJournalError("");
    try {
      const response = await api.get("/papers/journals", { params: { q: journalQuery } });
      setJournals(response.data.journals || []);
    } catch {
      setJournalError("Journal discovery is temporarily unavailable. Please try again.");
    } finally {
      setIsSearchingJournals(false);
    }
  };

  const openJournalDiscovery = () => {
    const nextVisible = !showJournals;
    setShowJournals(nextVisible);
    if (nextVisible && !journals.length) findJournals();
  };

  return <section className="publishing-guide-container">
    <div className="guide-heading"><div><p className="eyebrow">PUBLISHING WORKFLOW</p><h1>Research paper publishing guide</h1><p>Use this practical checklist to move from an idea to a confident submission.</p></div><span>Guide preview</span></div>
    <div className="guide-progress" aria-label={`${Math.round(progress)}% of guide explored`}><div style={{ width: `${progress}%` }} /></div>
    <div className="steps-container">{steps.map((step, index) => <article key={step.title} className={`step-card ${expandedStep === index ? "expanded" : ""}`}><button type="button" className="step-header" onClick={() => setExpandedStep(expandedStep === index ? null : index)} aria-expanded={expandedStep === index}><span className="step-number">{String(index + 1).padStart(2, "0")}</span><h2>{step.title}</h2><FaChevronDown /></button>{expandedStep === index && <p className="step-content">{step.content}</p>}</article>)}</div>

    <div className="guide-tools-intro"><FaFileAlt /><span><strong>Submission tools</strong><small>Use a starter file to draft your paper and explore open-access journals before shortlisting a venue.</small></span></div>
    <div className="action-buttons"><button type="button" className="download-btn" onClick={() => setShowTemplates((visible) => !visible)}><FaFileDownload /> {showTemplates ? "Hide templates" : "Download templates"}</button><button type="button" className="journals-btn" onClick={openJournalDiscovery}><FaSearch /> {showJournals ? "Hide journal discovery" : "Explore journals"}</button></div>

    {showTemplates && <section className="guide-tool-panel" aria-label="Paper templates"><div className="tool-panel-heading"><div><p className="eyebrow">STARTER FILES</p><h2>Download a paper template</h2></div><p>These are original planning templates, not journal-specific author guidelines.</p></div><div className="template-grid">{templates.map((template) => <article className="template-card" key={template.filename}><span>{template.type}</span><h3>{template.title}</h3><p>{template.description}</p><button type="button" onClick={() => downloadTemplate(template)}><FaDownload /> Download</button></article>)}</div></section>}

    {showJournals && <section className="guide-tool-panel" aria-label="Journal discovery"><div className="tool-panel-heading"><div><p className="eyebrow">OPEN ACCESS JOURNALS</p><h2>Explore journals</h2></div><p>Results come from OpenAlex sources filtered to journals listed in DOAJ.</p></div><form className="journal-search" onSubmit={findJournals}><FaSearch /><input value={journalQuery} onChange={(event) => setJournalQuery(event.target.value)} placeholder="e.g. machine learning, healthcare" aria-label="Search open-access journals" /><button type="submit" disabled={isSearchingJournals}>{isSearchingJournals ? "Searching…" : "Search"}</button></form>{journalError && <p className="journal-error" role="alert">{journalError}</p>}{isSearchingJournals && <p className="journal-status" role="status">Searching OpenAlex sources…</p>}{!isSearchingJournals && journals.length > 0 && <div className="journal-grid">{journals.map((journal) => <article className="journal-card" key={journal.id}><div><span className="journal-oa">Open access</span><span className="journal-issn">{journal.issn}</span></div><h3>{journal.name}</h3><p>{journal.publisher}</p><dl><div><dt>Works</dt><dd>{journal.worksCount.toLocaleString()}</dd></div><div><dt>H-index</dt><dd>{journal.hIndex ?? "—"}</dd></div></dl><a href={journal.websiteUrl} target="_blank" rel="noreferrer">Visit journal <FaExternalLinkAlt /></a></article>)}</div>}{!isSearchingJournals && !journalError && journals.length === 0 && <p className="journal-status">Search for a field to find open-access journals.</p>}</section>}
  </section>;
};

export default PublishingGuide;
