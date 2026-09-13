import { useState } from "react";
import { FaChevronDown, FaFileDownload, FaSearch } from "react-icons/fa";
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

const PublishingGuide = () => {
  const [expandedStep, setExpandedStep] = useState(null);
  const progress = expandedStep === null ? 0 : ((expandedStep + 1) / steps.length) * 100;
  return (
    <section className="publishing-guide-container">
      <div className="guide-heading"><div><p className="eyebrow">PUBLISHING WORKFLOW</p><h1>Research paper publishing guide</h1><p>Use this practical checklist to move from an idea to a confident submission.</p></div><span>Guide preview</span></div>
      <div className="guide-progress" aria-label={`${Math.round(progress)}% of guide explored`}><div style={{ width: `${progress}%` }} /></div>
      <div className="steps-container">{steps.map((step, index) => <article key={step.title} className={`step-card ${expandedStep === index ? "expanded" : ""}`}><button type="button" className="step-header" onClick={() => setExpandedStep(expandedStep === index ? null : index)} aria-expanded={expandedStep === index}><span className="step-number">{String(index + 1).padStart(2, "0")}</span><h2>{step.title}</h2><FaChevronDown /></button>{expandedStep === index && <p className="step-content">{step.content}</p>}</article>)}</div>
      <div className="guide-coming-soon" role="status"><FaFileDownload /><span><strong>Templates and journal discovery are coming soon.</strong><small>These actions will be connected when the backend and data sources are ready.</small></span></div>
      <div className="action-buttons"><button type="button" className="download-btn" disabled title="Templates coming soon"><FaFileDownload /> Templates coming soon</button><button type="button" className="journals-btn" disabled title="Journal discovery coming soon"><FaSearch /> Journal discovery coming soon</button></div>
    </section>
  );
};

export default PublishingGuide;
