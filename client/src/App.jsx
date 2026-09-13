import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
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


function App() {
  const [savedPapers, setSavedPapers] = useState(() => {
    const saved = localStorage.getItem("intellipaper-library");
    return saved ? JSON.parse(saved) : [];
  });
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem("intellipaper-preferences");
    return saved ? JSON.parse(saved) : {
      interests: ["Artificial intelligence", "Machine learning"],
      affiliation: "Mumbai University",
      degree: "Computer Engineering",
      researchStage: "Idea",
      linkedin: "",
      collaboration: true,
    };
  });

  useEffect(() => {
    localStorage.setItem("intellipaper-library", JSON.stringify(savedPapers));
  }, [savedPapers]);
  useEffect(() => {
    localStorage.setItem("intellipaper-preferences", JSON.stringify(preferences));
  }, [preferences]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome savedPapers={savedPapers} preferences={preferences} />} />
          <Route path="home" element={<DashboardHome savedPapers={savedPapers} preferences={preferences} />} />
          <Route path="user-preference-form" element={<UserPreferencesForm initialPreferences={preferences} onSave={setPreferences} />} />
          <Route path="search-paper" element={<SearchPaper savedPapers={savedPapers} setSavedPapers={setSavedPapers} />} />
          <Route path="plagiarism-checker" element={<PlagiarismChecker />} />
          <Route path="publishing-guide" element={<PublishingGuide />} />
          <Route path="conferences" element={<ConferencePage />} />
          <Route path="saved-paper" element={<SavedPaper savedPapers={savedPapers} setSavedPapers={setSavedPapers} />} />
          <Route path="profile" element={<Profile preferences={preferences} savedPapers={savedPapers} />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
