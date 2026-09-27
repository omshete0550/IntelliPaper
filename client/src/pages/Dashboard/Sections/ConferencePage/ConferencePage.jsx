import { useCallback, useEffect, useMemo, useState } from "react";
import { api, authConfig } from "../../../../lib/api";
import "./Conference.css";

const pageSize = 10;

const ConferencePage = ({ token }) => {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all");
  const [events, setEvents] = useState([]);
  const [myConferences, setMyConferences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    try {
      const [eventResponse, bookmarkResponse] = await Promise.all([
        api.get("/conferences/events", authConfig(token)),
        api.get("/conferences", authConfig(token)),
      ]);
      setEvents(eventResponse.data.conferences);
      setMyConferences(bookmarkResponse.data.conferences);
    } catch {
      setError("Unable to load the conference catalog.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, view]);

  const syncLiveEvents = async () => {
    setIsSyncing(true);
    setError("");
    try {
      const response = await api.post("/conferences/sync", {}, authConfig(token));
      setEvents(response.data.conferences);
      setSyncMessage(response.data.sync?.openReview?.message || "Conference sources refreshed.");
      setPage(1);
    } catch {
      setError("Unable to refresh live conference events.");
    } finally {
      setIsSyncing(false);
    }
  };

  const addConference = async (event) => {
    setActionId(event.id);
    try {
      const response = await api.post("/conferences", {
        eventId: event.id,
        conferenceId: event.externalId,
        name: event.name,
        startDate: event.startDate || "To be announced",
        location: event.location,
        link: event.websiteUrl,
      }, authConfig(token));
      setMyConferences((current) => [response.data.conference, ...current]);
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Unable to save this conference.");
    } finally {
      setActionId("");
    }
  };

  const removeConference = async (conference) => {
    setActionId(conference.id);
    try {
      await api.delete(`/conferences/${conference.id}`, authConfig(token));
      setMyConferences((current) => current.filter((item) => item.id !== conference.id));
    } catch {
      setError("Unable to remove this conference.");
    } finally {
      setActionId("");
    }
  };

  const conferences = useMemo(() => (view === "all" ? events : myConferences)
    .filter((conference) => `${conference.name} ${conference.location} ${(conference.topics || []).join(" ")}`.toLowerCase().includes(search.toLowerCase())), [view, events, myConferences, search]);
  const totalPages = Math.max(1, Math.ceil(conferences.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const paginatedConferences = conferences.slice(pageStart, pageStart + pageSize);
  const firstVisible = conferences.length ? pageStart + 1 : 0;
  const lastVisible = Math.min(pageStart + pageSize, conferences.length);

  return <section className="conference-container">
    <header className="conference-page-heading">
      <div>
        <p className="eyebrow">ACADEMIC EVENTS</p>
        <h1>Conferences</h1>
        <p>Live OpenReview venues and verified catalog events, ranked using your research interests. Confirm deadlines and event details on the source page before submitting.</p>
      </div>
    </header>

    <div className="conference-header">
      <div className="btn-cont">
        <button type="button" className={view === "all" ? "active" : ""} onClick={() => setView("all")}>Recommended events</button>
        <button type="button" className={view === "my" ? "active" : ""} onClick={() => setView("my")}>My Conferences ({myConferences.length})</button>
        <button type="button" className="sync-conferences-btn" disabled={isSyncing} onClick={syncLiveEvents}>{isSyncing ? "Refreshing..." : "Refresh live events"}</button>
      </div>
      <input type="search" className="search-box" placeholder="Filter conferences..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Filter conferences" />
    </div>

    {error && <p className="conference-status conference-error" role="alert">{error}</p>}
    {syncMessage && <p className="conference-status conference-success" role="status">{syncMessage}</p>}

    <table className="conference-table">
      <thead><tr><th>Conference</th><th>Deadline</th><th>Event date</th><th>Location</th><th>Action</th></tr></thead>
      <tbody>{paginatedConferences.length ? paginatedConferences.map((conference) => {
        const saved = myConferences.find((item) => item.eventId === conference.id || item.conferenceId === conference.externalId);
        const working = actionId === (saved?.id || conference.id);
        return <tr key={conference.id}>
          <td><strong>{conference.acronym || conference.name}</strong><small>{(conference.topics || []).join(" / ")}</small><small className="conference-source">{conference.sourceUrl ? <a href={conference.sourceUrl} target="_blank" rel="noreferrer">{conference.provider || "View source"}</a> : conference.provider}</small></td>
          <td>{conference.submissionDeadline || "To be announced"}</td>
          <td>{conference.startDate || "To be announced"}</td>
          <td>{conference.location || "To be announced"}</td>
          <td>{view === "all"
            ? <button type="button" disabled={Boolean(saved) || working} onClick={() => addConference(conference)} className="add-btn">{working ? "Saving..." : saved ? "Saved" : "Save"}</button>
            : <button type="button" disabled={working} onClick={() => removeConference(conference)} className="remove-conference-btn">{working ? "Removing..." : "Remove"}</button>}
          </td>
        </tr>;
      }) : <tr><td colSpan="5" className="no-data">{view === "my" ? "No saved conferences yet." : "No conference events match your search."}</td></tr>}</tbody>
    </table>

    {conferences.length > 0 && <nav className="conference-pagination" aria-label="Conference pagination">
      <p>Showing {firstVisible}–{lastVisible} of {conferences.length} conferences</p>
      <div>
        <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1}>Previous</button>
        <span aria-current="page">Page {currentPage} of {totalPages}</span>
        <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={currentPage === totalPages}>Next</button>
      </div>
    </nav>}

    {isLoading && <p className="conference-status" role="status">Loading conference events...</p>}
  </section>;
};

export default ConferencePage;
