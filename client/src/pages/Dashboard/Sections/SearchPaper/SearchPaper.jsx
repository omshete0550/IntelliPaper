import { useEffect, useState } from "react";
import { FaArrowRight, FaBookmark, FaCheck, FaExternalLinkAlt, FaSearch, FaSlidersH } from "react-icons/fa";
import { api } from "../../../../lib/api";
import "./SearchPaper.css";

const toClientPaper = (paper) => ({ ...paper, id: paper.externalId, authors: paper.authors.join(", "), topics: paper.topics || [] });

const SearchPaper = ({ savedPapers, onSavePaper, onRemovePaper }) => {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All topics");
  const [year, setYear] = useState("Any year");
  const [hasSearched, setHasSearched] = useState(false);
  const [papers, setPapers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, total: 0, hasMore: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [savingId, setSavingId] = useState("");
  const [actionError, setActionError] = useState("");

  const requestPapers = async (page, append = false) => {
    const response = await api.get("/papers/search", { params: { q: query, topic: topic === "All topics" ? "" : topic, year: year === "Any year" ? "" : year, page } });
    const nextPapers = response.data.papers.map(toClientPaper);
    setPapers((current) => append ? [...current, ...nextPapers] : nextPapers);
    setMeta({ page: response.data.meta.page, total: response.data.meta.total, hasMore: response.data.meta.page * response.data.meta.perPage < response.data.meta.total });
  };

  const search = async () => {
    setHasSearched(true);
    setIsLoading(true);
    setSearchError("");
    try { await requestPapers(1); } catch { setSearchError("Unable to retrieve papers. Confirm the backend is running and try again."); } finally { setIsLoading(false); }
  };

  const loadMore = async () => {
    setIsLoadingMore(true);
    setSearchError("");
    try { await requestPapers(meta.page + 1, true); } catch { setSearchError("Unable to load more papers. Please try again."); } finally { setIsLoadingMore(false); }
  };

  useEffect(() => {
    api.get("/papers/search")
      .then((response) => {
        const nextPapers = response.data.papers.map(toClientPaper);
        setPapers(nextPapers);
        setMeta({ page: response.data.meta.page, total: response.data.meta.total, hasMore: response.data.meta.page * response.data.meta.perPage < response.data.meta.total });
      })
      .catch(() => setSearchError("Unable to retrieve papers. Confirm the backend is running."))
      .finally(() => setIsLoading(false));
  }, []);

  const toggleSaved = async (paper) => {
    const saved = savedPapers.some((savedPaper) => savedPaper.id === paper.id);
    setSavingId(paper.id);
    setActionError("");
    try {
      if (saved) await onRemovePaper(paper.id);
      else await onSavePaper(paper);
    } catch (error) {
      setActionError(error.response?.data?.error || "Unable to update your library. Confirm the API is running.");
    } finally {
      setSavingId("");
    }
  };

  return <section className="discover-page">
    <header className="page-heading">
      <div><p className="eyebrow">LITERATURE DISCOVERY</p><h1>Discover papers</h1><p>Search a live academic index, then save the work worth returning to.</p></div>
      <span className="result-count">{savedPapers.length} saved</span>
    </header>

    <div className="discover-search-panel">
      <div className="discover-search"><FaSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && search()} placeholder="Search by topic, title, or author" aria-label="Search papers" /><button type="button" onClick={search}>Search</button></div>
      <div className="discover-filters"><span><FaSlidersH /> Refine</span><select value={topic} onChange={(event) => setTopic(event.target.value)}><option>All topics</option><option>Machine learning</option><option>Artificial intelligence</option><option>Healthcare</option><option>AI ethics</option><option>Climate</option><option>Robotics</option><option>Privacy</option></select><select value={year} onChange={(event) => setYear(event.target.value)}><option>Any year</option><option>2026</option><option>2025</option><option>2024</option><option>2023</option></select></div>
    </div>

    <div className="discover-results-heading"><div><h2>{hasSearched ? "Search results" : "Recommended for you"}</h2><p>{meta.total ? `Showing ${papers.length.toLocaleString()} of ${meta.total.toLocaleString()} results` : `${papers.length} papers found`}</p></div><span className="provider-label">Powered by OpenAlex</span></div>
    {(actionError || searchError) && <p className="api-action-error" role="alert">{actionError || searchError}</p>}
    {isLoading && <p className="search-loading" role="status">Searching the academic index…</p>}

    <div className="paper-results-grid">{papers.map((paper) => {
      const isSaved = savedPapers.some((savedPaper) => savedPaper.id === paper.id);
      const isSaving = savingId === paper.id;
      const visibleTopics = paper.topics.slice(0, 2);
      return <article className="research-paper-card" key={paper.id}>
        <div className="paper-card-top"><span className="paper-venue" title={paper.venue}>{paper.venue || "Publication unavailable"}</span><span className="paper-year">{paper.year || "—"}</span></div>
        <h3 title={paper.title}>{paper.title}</h3>
        <p className="paper-authors" title={paper.authors}>{paper.authors || "Authors unavailable"}</p>
        <p className="paper-abstract">{paper.abstract || "No abstract is available from the source for this work."}</p>
        <div className="paper-tags">{visibleTopics.map((item) => <span key={item}>{item}</span>)}{paper.topics.length > visibleTopics.length && <span>+{paper.topics.length - visibleTopics.length}</span>}</div>
        <div className="paper-meta"><span className="paper-citations">{paper.citations.toLocaleString()} citations</span><a href={paper.link} target="_blank" rel="noreferrer" aria-label={`Open source for ${paper.title}`}>Open source <FaExternalLinkAlt /></a></div>
        <button type="button" disabled={isSaving} className={`save-paper-button ${isSaved ? "saved" : ""}`} onClick={() => toggleSaved(paper)}>{isSaving ? "Updating…" : isSaved ? <><FaCheck /> Saved to library</> : <><FaBookmark /> Save paper</>}</button>
      </article>;
    })}</div>

    {!isLoading && papers.length === 0 && <div className="no-search-results"><FaSearch /><h2>No papers found</h2><p>Try another topic, author, or publication year.</p></div>}
    {meta.hasMore && <div className="load-more"><button type="button" onClick={loadMore} disabled={isLoadingMore}>{isLoadingMore ? "Loading more papers…" : "Load more papers"}<FaArrowRight /></button></div>}
  </section>;
};

export default SearchPaper;
