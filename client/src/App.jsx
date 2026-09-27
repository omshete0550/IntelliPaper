import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/AuthContext";
import { api, authConfig } from "./lib/api";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardHome from "./pages/Dashboard/Sections/DashboardHome/DashboardHome";
import UserPreferencesForm from "./pages/Dashboard/Sections/UserPreferencesForm/UserPreferencesForm";
import Profile from "./pages/Dashboard/Sections/Profile/Profile";
import SearchPaper from "./pages/Dashboard/Sections/SearchPaper/SearchPaper";
import PlagiarismChecker from "./pages/Dashboard/Sections/PlagiarismChecker/PlagiarismChecker";
import ConferencePage from "./pages/Dashboard/Sections/ConferencePage/ConferencePage";
import PublishingGuide from "./pages/Dashboard/Sections/PublishingGuide/PublishingGuide";
import SavedPaper from "./pages/Dashboard/Sections/SavedPaper/SavedPaper";

const statusToClient = { UNREAD: "Unread", READING: "Reading", FINISHED: "Finished" };
const statusToApi = { Unread: "UNREAD", Reading: "READING", Finished: "FINISHED" };
const fromApiPaper = (paper) => ({ ...paper, id: paper.externalId, recordId: paper.id, authors: paper.authors.join(", "), status: statusToClient[paper.status] || paper.status });

function App() {
  const { token, user, setUser } = useAuth();
  const [savedPapers, setSavedPapers] = useState([]);
  useEffect(() => {
    if (!token) { setSavedPapers([]); return; }
    api.get("/library", authConfig(token)).then((response) => setSavedPapers(response.data.papers.map(fromApiPaper))).catch(() => setSavedPapers([]));
  }, [token]);

  const savePaper = async (paper) => {
    const payload = { externalId: paper.id, title: paper.title, authors: paper.authors.split(",").map((author) => author.trim()).filter(Boolean), venue: paper.venue, year: paper.year, citations: paper.citations, abstract: paper.abstract, topics: paper.topics, link: paper.link };
    const response = await api.post("/library", payload, authConfig(token));
    setSavedPapers((current) => [...current, fromApiPaper(response.data.paper)]);
  };
  const removePaper = async (externalId) => {
    const paper = savedPapers.find((item) => item.id === externalId);
    if (!paper) return;
    await api.delete(`/library/${paper.recordId}`, authConfig(token));
    setSavedPapers((current) => current.filter((item) => item.id !== externalId));
  };
  const updatePaper = async (externalId, changes) => {
    const paper = savedPapers.find((item) => item.id === externalId);
    if (!paper) return;
    const payload = { ...changes, ...(changes.status ? { status: statusToApi[changes.status] } : {}) };
    const response = await api.patch(`/library/${paper.recordId}`, payload, authConfig(token));
    const updated = fromApiPaper(response.data.paper);
    setSavedPapers((current) => current.map((item) => item.id === externalId ? updated : item));
  };
  const savePreferences = async (preferences) => {
    const response = await api.put("/profile", preferences, authConfig(token));
    setUser(response.data.user);
  };

  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
      <Route index element={<DashboardHome savedPapers={savedPapers} preferences={user} />} />
      <Route path="home" element={<DashboardHome savedPapers={savedPapers} preferences={user} />} />
      <Route path="user-preference-form" element={<UserPreferencesForm initialPreferences={user} onSave={savePreferences} />} />
      <Route path="search-paper" element={<SearchPaper savedPapers={savedPapers} onSavePaper={savePaper} onRemovePaper={removePaper} />} />
      <Route path="plagiarism-checker" element={<PlagiarismChecker />} />
      <Route path="publishing-guide" element={<PublishingGuide interests={user?.interests || []} />} />
      <Route path="conferences" element={<ConferencePage token={token} />} />
      <Route path="saved-paper" element={<SavedPaper savedPapers={savedPapers} onUpdatePaper={updatePaper} onRemovePaper={removePaper} />} />
      <Route path="profile" element={<Profile preferences={user} savedPapers={savedPapers} />} />
    </Route>
  </Routes>;
}

export default App;
