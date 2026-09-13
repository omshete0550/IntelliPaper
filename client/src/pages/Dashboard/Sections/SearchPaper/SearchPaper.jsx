import { useMemo, useState } from "react";
import { FaArrowRight, FaBookmark, FaCheck, FaExternalLinkAlt, FaSearch, FaSlidersH } from "react-icons/fa";
import "./SearchPaper.css";

const papers = [
  { id: "health-ai", title: "Foundation models for clinical reasoning", authors: "Singhal, K. · Azizi, S. · Tu, T.", venue: "Nature", year: "2025", citations: 284, abstract: "A review of how multimodal foundation models can support careful, evidence-led clinical decisions.", topics: ["Artificial intelligence", "Healthcare"], link: "https://arxiv.org" },
  { id: "efficient-llm", title: "Efficient language models at the edge", authors: "Kim, J. · Zhao, L. · Raman, P.", venue: "ACM Computing Surveys", year: "2024", citations: 157, abstract: "Methods for reducing inference cost while preserving the quality of language models on constrained devices.", topics: ["Machine learning", "Systems"], link: "https://dl.acm.org" },
  { id: "trustworthy-ai", title: "Measuring trust in human-AI collaboration", authors: "Gonzalez, M. · Patel, R. · Chen, Y.", venue: "CHI", year: "2024", citations: 91, abstract: "A practical framework for studying calibrated trust when people work alongside intelligent systems.", topics: ["AI ethics", "HCI"], link: "https://dl.acm.org" },
  { id: "climate-ml", title: "Machine learning for climate adaptation", authors: "Nair, A. · Brown, S. · Okafor, C.", venue: "Science", year: "2023", citations: 426, abstract: "A map of high-value applications of machine learning for climate-risk modelling and adaptation planning.", topics: ["Climate", "Machine learning"], link: "https://www.science.org" },
  { id: "privacy-preserving", title: "Privacy-preserving federated analytics", authors: "Iyer, R. · Williams, E. · Shah, A.", venue: "IEEE Security & Privacy", year: "2024", citations: 73, abstract: "Design principles for training and analysing distributed data without centralising sensitive records.", topics: ["Privacy", "Systems"], link: "https://ieeexplore.ieee.org" },
  { id: "robotics-learning", title: "Learning robust policies for assistive robotics", authors: "Park, H. · Silva, D. · Mehta, N.", venue: "ICRA", year: "2025", citations: 48, abstract: "Robust policy learning techniques for robots that operate safely around people in changing environments.", topics: ["Robotics", "Machine learning"], link: "https://ieeexplore.ieee.org" },
];

const SearchPaper = ({ savedPapers, setSavedPapers }) => {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All topics");
  const [year, setYear] = useState("Any year");
  const [hasSearched, setHasSearched] = useState(false);

  const results = useMemo(() => papers.filter((paper) => {
    const searchable = `${paper.title} ${paper.authors} ${paper.abstract} ${paper.topics.join(" ")}`.toLowerCase();
    return searchable.includes(query.toLowerCase()) && (topic === "All topics" || paper.topics.includes(topic)) && (year === "Any year" || paper.year === year);
  }), [query, topic, year]);

  const toggleSaved = (paper) => {
    const saved = savedPapers.some((savedPaper) => savedPaper.id === paper.id);
    setSavedPapers(saved ? savedPapers.filter((savedPaper) => savedPaper.id !== paper.id) : [...savedPapers, { ...paper, savedAt: new Date().toISOString(), status: "Unread", notes: "" }]);
  };

  return (
    <section className="discover-page">
      <header className="page-heading"><div><p className="eyebrow">LITERATURE DISCOVERY</p><h1>Discover papers</h1><p>Explore research that fits your topic, then save the papers worth returning to.</p></div><span className="result-count">{savedPapers.length} saved</span></header>
      <div className="discover-search-panel">
        <div className="discover-search"><FaSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && setHasSearched(true)} placeholder="Search by topic, title, or author" /><button onClick={() => setHasSearched(true)}>Search</button></div>
        <div className="discover-filters"><span><FaSlidersH /> Refine</span><select value={topic} onChange={(event) => setTopic(event.target.value)}><option>All topics</option><option>Machine learning</option><option>Artificial intelligence</option><option>Healthcare</option><option>AI ethics</option><option>Climate</option><option>Robotics</option><option>Privacy</option></select><select value={year} onChange={(event) => setYear(event.target.value)}><option>Any year</option><option>2025</option><option>2024</option><option>2023</option></select></div>
      </div>
      <div className="discover-results-heading"><div><h2>{hasSearched ? "Search results" : "Recommended for you"}</h2><p>{results.length} paper{results.length !== 1 ? "s" : ""} matched your filters</p></div><button className="sort-button">Most relevant <FaArrowRight /></button></div>
      <div className="paper-results-grid">
        {results.map((paper) => { const isSaved = savedPapers.some((savedPaper) => savedPaper.id === paper.id); return <article className="research-paper-card" key={paper.id}><div className="paper-card-top"><span>{paper.venue}</span><span>{paper.year}</span></div><h3>{paper.title}</h3><p className="paper-authors">{paper.authors}</p><p className="paper-abstract">{paper.abstract}</p><div className="paper-tags">{paper.topics.map((item) => <span key={item}>{item}</span>)}</div><div className="paper-meta"><span>{paper.citations} citations</span><a href={paper.link} target="_blank" rel="noreferrer">Source <FaExternalLinkAlt /></a></div><button className={`save-paper-button ${isSaved ? "saved" : ""}`} onClick={() => toggleSaved(paper)}>{isSaved ? <><FaCheck /> Saved to library</> : <><FaBookmark /> Save paper</>}</button></article>; })}
      </div>
      {results.length === 0 && <div className="no-search-results"><FaSearch /><h2>No papers found</h2><p>Try another topic, author, or publication year.</p></div>}
    </section>
  );
};

export default SearchPaper;
