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


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="user-preference-form" element={<UserPreferencesForm />} />
          <Route path="search-paper" element={<SearchPaper />} />
          <Route path="plagiarism-checker" element={<PlagiarismChecker />} />
          <Route path="publishing-guide" element={<PublishingGuide />} />
          <Route path="conferences" element={<ConferencePage />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
