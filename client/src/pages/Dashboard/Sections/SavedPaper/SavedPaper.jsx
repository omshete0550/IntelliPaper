import { useMemo, useState } from "react";
import { FaBookOpen, FaCheck, FaEllipsisH, FaExternalLinkAlt, FaSearch, FaTrashAlt } from "react-icons/fa";
import "./SavedPaper.css";

const statuses = ["All", "Unread", "Reading", "Finished"];

const SavedPaper = ({ savedPapers, setSavedPapers }) => {
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const visiblePapers = useMemo(() => savedPapers.filter((paper) => (status === "All" || paper.status === status) && `${paper.title} ${paper.authors}`.toLowerCase().includes(query.toLowerCase())), [savedPapers, status, query]);
  const updateStatus = (id, nextStatus) => setSavedPapers(savedPapers.map((paper) => paper.id === id ? { ...paper, status: nextStatus } : paper));
  const removePaper = (id) => setSavedPapers(savedPapers.filter((paper) => paper.id !== id));

  return (
    <section className="library-page">
      <header className="page-heading"><div><p className="eyebrow">YOUR READING LIBRARY</p><h1>Saved papers</h1><p>Keep a deliberate list of literature, track what you are reading, and return to it when you need it.</p></div><div className="library-stat"><strong>{savedPapers.length}</strong><span>papers saved</span></div></header>
      <div className="library-toolbar"><div className="library-search"><FaSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your library" /></div><select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="library-tabs">{statuses.map((item) => <button key={item} className={status === item ? "active" : ""} onClick={() => setStatus(item)}>{item}{item === "All" ? ` (${savedPapers.length})` : ""}</button>)}</div>
      {visiblePapers.length > 0 ? <div className="library-list">{visiblePapers.map((paper) => <article className="library-paper" key={paper.id}><div className="library-paper-icon"><FaBookOpen /></div><div className="library-paper-content"><div className="library-paper-heading"><div><h2>{paper.title}</h2><p>{paper.authors} · {paper.venue}, {paper.year}</p></div><span className={`reading-status ${paper.status.toLowerCase()}`}>{paper.status}</span></div><p className="library-paper-abstract">{paper.abstract}</p><div className="library-paper-footer"><div className="paper-tags">{paper.topics.map((topic) => <span key={topic}>{topic}</span>)}</div><div className="library-actions"><a href={paper.link} target="_blank" rel="noreferrer">Open source <FaExternalLinkAlt /></a><label>Reading status <select value={paper.status} onChange={(event) => updateStatus(paper.id, event.target.value)}>{statuses.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><button onClick={() => removePaper(paper.id)} aria-label={`Remove ${paper.title}`}><FaTrashAlt /></button></div></div></div></article>)}</div> : <div className="library-empty"><span><FaBookOpen /></span><h2>{savedPapers.length ? "No matching papers" : "Start building your reading library"}</h2><p>{savedPapers.length ? "Try a different search term or reading status." : "Save useful papers from Discover papers, then organize your reading here."}</p>{!savedPapers.length && <a href="/dashboard/search-paper">Discover papers</a>}</div>}
    </section>
  );
};

export default SavedPaper;
