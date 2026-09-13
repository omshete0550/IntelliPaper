import { Link } from "react-router-dom";
import { FaArrowRight, FaBookOpen, FaCheckCircle, FaCompass, FaSearch } from "react-icons/fa";
import "./DashboardHome.css";

const recommended = [
  { title: "Foundation models for clinical reasoning", topic: "Artificial intelligence", note: "A strong match for your research interests." },
  { title: "Efficient language models at the edge", topic: "Machine learning", note: "Popular with researchers working on practical AI systems." },
  { title: "Measuring trust in human-AI collaboration", topic: "AI ethics", note: "A useful perspective for responsible AI research." },
];

const DashboardHome = ({ savedPapers, preferences }) => (
  <section className="overview-page">
    <header className="overview-heading"><div><p className="eyebrow">WELCOME BACK</p><h1>Good to see you, Om.</h1><p>{preferences.interests?.length ? `Your workspace is tuned for ${preferences.interests.slice(0, 2).join(" and ")}.` : "Start by adding your research interests to personalize this workspace."}</p></div><Link to="/dashboard/search-paper" className="primary-action"><FaSearch /> Discover papers</Link></header>
    <div className="overview-stats"><article><span><FaBookOpen /></span><strong>{savedPapers.length}</strong><p>Saved papers</p></article><article><span><FaCheckCircle /></span><strong>{savedPapers.filter((paper) => paper.status === "Finished").length}</strong><p>Completed reading</p></article><article><span><FaCompass /></span><strong>6</strong><p>Conferences to explore</p></article></div>
    <div className="overview-grid"><section className="overview-panel recommendations-panel"><div className="panel-heading"><div><h2>Recommended for you</h2><p>Selected from your current interests</p></div><Link to="/dashboard/search-paper">See all <FaArrowRight /></Link></div><div className="recommendation-list">{recommended.map((paper) => <article key={paper.title}><span className="recommendation-dot"></span><div><small>{paper.topic}</small><h3>{paper.title}</h3><p>{paper.note}</p></div><Link to="/dashboard/search-paper" aria-label={`Discover ${paper.title}`}><FaArrowRight /></Link></article>)}</div></section><section className="overview-panel activity-panel"><div className="panel-heading"><div><h2>Your reading queue</h2><p>Continue where you left off</p></div><Link to="/dashboard/saved-paper">Open library <FaArrowRight /></Link></div>{savedPapers.length ? <div className="queue-list">{savedPapers.slice(0, 3).map((paper) => <div key={paper.id}><span className={`queue-status ${paper.status.toLowerCase()}`}></span><span><strong>{paper.title}</strong><small>{paper.status} · {paper.venue}</small></span></div>)}</div> : <div className="queue-empty"><FaBookOpen /><p>Your saved papers will appear here.</p><Link to="/dashboard/search-paper">Find your first paper</Link></div>}</section></div>
    <section className="overview-next-step"><div><span>YOUR NEXT STEP</span><h2>{preferences.researchStage === "Publishing" ? "Prepare your work for publication" : "Build a focused reading list"}</h2><p>{preferences.researchStage === "Publishing" ? "Use the publishing guide to prepare for journal or conference submission." : "Save a few relevant papers, then use your library to keep your reading deliberate."}</p></div><Link to={preferences.researchStage === "Publishing" ? "/dashboard/publishing-guide" : "/dashboard/search-paper"}>Continue <FaArrowRight /></Link></section>
  </section>
);

export default DashboardHome;
