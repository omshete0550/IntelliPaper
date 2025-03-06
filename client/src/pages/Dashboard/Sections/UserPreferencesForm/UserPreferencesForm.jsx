import { useState } from "react";
import "./UserPreferencesForm.css";

const UserPreferencesForm = ({ onSave }) => {
  const [interests, setInterests] = useState([]);
  const [affiliation, setAffiliation] = useState("");
  const [degree, setDegree] = useState("");
  const [researchStage, setResearchStage] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [collaboration, setCollaboration] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userPreferences = {
      interests,
      affiliation,
      degree,
      researchStage,
      linkedin,
      collaboration,
    };
    onSave(userPreferences);
  };

  return (
    <div className="user_pref_form_container">
      <h2>Preference Inforamtion</h2>
      <form className="user_pref_form" onSubmit={handleSubmit}>
        <label>Research Interests:</label>
        <input
          type="text"
          onChange={(e) => setInterests(e.target.value.split(","))}
          placeholder="AI, Data Science, Physics"
        />

        <label>Affiliation:</label>
        <input
          type="text"
          onChange={(e) => setAffiliation(e.target.value)}
          placeholder="University/Company"
        />

        <label>Highest Degree:</label>
        <input
          type="text"
          onChange={(e) => setDegree(e.target.value)}
          placeholder="PhD, Masters, Bachelors"
        />

        <label>Current Research Stage:</label>
        <select onChange={(e) => setResearchStage(e.target.value)}>
          <option value="Idea">Idea Stage</option>
          <option value="Writing">Writing</option>
          <option value="Reviewing">Reviewing</option>
          <option value="Publishing">Publishing</option>
        </select>

        <label>LinkedIn / Google Scholar Profile:</label>
        <input
          type="url"
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="https://www.linkedin.com/in/username"
        />

        <label>
          <input
            type="checkbox"
            onChange={(e) => setCollaboration(e.target.checked)}
          />
          Open for Collaboration
        </label>

        <button type="submit">Save Preferences</button>
      </form>
    </div>
  );
};

export default UserPreferencesForm;
