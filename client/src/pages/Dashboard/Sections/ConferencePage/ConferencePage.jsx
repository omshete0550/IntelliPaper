import { useEffect, useMemo, useState } from "react";
import { api, authConfig } from "../../../../lib/api";
import "./Conference.css";

const allConferences = [
  { id: "vldb-2026", name: "Proc. of the VLDB Volume 19 (for VLDB 2026)", date: "8/30/2026", location: "Boston, USA", link: "https://vldb.org/2026/" },
  { id: "icpr-2026", name: "28th International Conference on Pattern Recognition", date: "8/17/2026", location: "Lyon, France", link: "https://icpr2026.org/" },
  { id: "icemcsi-2026", name: "International Conference on Emerging Trends in Mobile Computing", date: "6/17/2026", location: "Bengaluru, India", link: "https://newhorizonindia.edu/icemcsi26/" },
  { id: "sigmod-2026", name: "SIGMOD International Conference on Management of Data (2026)", date: "5/31/2026", location: "Bengaluru, India", link: "https://2026.sigmod.org/" },
  { id: "icdais-2026", name: "International Conference on Data Analytics and Intelligent Systems", date: "4/14/2026", location: "Khenchela, Algeria", link: "https://www.icdais.org" },
  { id: "wcst-2026", name: "World Conference on Computational Science and Technology", date: "3/26/2026", location: "Punjab, India", link: "https://www.cuchd.in/conference/WcCST-26/" },
];

const ConferencePage = ({ token }) => {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all");
  const [myConferences, setMyConferences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/conferences", authConfig(token)).then((response) => setMyConferences(response.data.conferences.map((conference) => ({ ...conference, id: conference.conferenceId, recordId: conference.id, date: conference.startDate })))).catch(() => setError("Unable to load your saved conferences.")).finally(() => setIsLoading(false));
  }, [token]);

  const addConference = async (conference) => {
    setActionId(conference.id); setError("");
    try { const response = await api.post("/conferences", { conferenceId: conference.id, name: conference.name, startDate: conference.date, location: conference.location, link: conference.link }, authConfig(token)); setMyConferences((current) => [{ ...response.data.conference, id: response.data.conference.conferenceId, recordId: response.data.conference.id, date: response.data.conference.startDate }, ...current]); }
    catch (requestError) { setError(requestError.response?.data?.error || "Unable to save this conference."); }
    finally { setActionId(""); }
  };
  const removeConference = async (conference) => {
    setActionId(conference.id); setError("");
    try { await api.delete(`/conferences/${conference.recordId}`, authConfig(token)); setMyConferences((current) => current.filter((item) => item.recordId !== conference.recordId)); }
    catch (requestError) { setError(requestError.response?.data?.error || "Unable to remove this conference."); }
    finally { setActionId(""); }
  };
  const conferences = useMemo(() => (view === "all" ? allConferences : myConferences).filter((conference) => `${conference.name} ${conference.location}`.toLowerCase().includes(search.toLowerCase())), [view, myConferences, search]);

  return <section className="conference-container"><header className="conference-page-heading"><div><p className="eyebrow">ACADEMIC EVENTS</p><h1>Conferences</h1><p>Save events you want to follow and return to them from any device.</p></div></header><div className="conference-header"><div className="btn-cont"><button type="button" className={view === "all" ? "active" : ""} onClick={() => setView("all")}>All Conferences</button><button type="button" className={view === "my" ? "active" : ""} onClick={() => setView("my")}>My Conferences ({myConferences.length})</button></div><input type="search" className="search-box" placeholder="Filter conferences…" value={search} onChange={(event) => setSearch(event.target.value)} /></div>{error && <p className="conference-status conference-error" role="alert">{error}</p>}<table className="conference-table"><thead><tr><th>Name</th><th>Start date</th><th>Location</th><th>Website</th><th>Action</th></tr></thead><tbody>{conferences.length ? conferences.map((conference) => { const isSaved = myConferences.some((item) => item.id === conference.id); const isWorking = actionId === conference.id; return <tr key={conference.recordId || conference.id}><td>{conference.name}</td><td>{conference.date}</td><td>{conference.location || "—"}</td><td>{conference.link ? <a href={conference.link} target="_blank" rel="noopener noreferrer">Visit site</a> : "—"}</td><td>{view === "all" ? <button type="button" disabled={isSaved || isWorking} onClick={() => addConference(conference)} className="add-btn">{isWorking ? "Saving…" : isSaved ? "Saved" : "Save"}</button> : <button type="button" disabled={isWorking} onClick={() => removeConference(conference)} className="remove-conference-btn">{isWorking ? "Removing…" : "Remove"}</button>}</td></tr>; }) : <tr><td colSpan="5" className="no-data">{view === "my" ? "No saved conferences yet. Save an event from All Conferences to find it here." : "No conferences found."}</td></tr>}</tbody></table>{isLoading && <p className="conference-status" role="status">Loading your saved conferences…</p>}</section>;
};

export default ConferencePage;
