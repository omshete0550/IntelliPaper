import { Link } from "react-router-dom";
import { FaBookOpen, FaCheckCircle, FaFlask, FaGraduationCap, FaPenNib, FaUserFriends } from "react-icons/fa";
import "./Profile.css";

const Profile = ({ preferences, savedPapers }) => {
  const interests = preferences.interests?.filter(Boolean) ?? [];
  return (
    <section className="profile-page">
      <div className="profile-hero-card"><div className="profile-avatar">{preferences.name?.split(" ").map((name) => name[0]).join("").slice(0, 2).toUpperCase() || "IP"}</div><div className="profile-intro"><p className="eyebrow">RESEARCHER PROFILE</p><h1>{preferences.name || "Researcher"}</h1><p>{preferences.degree || "Researcher"}{preferences.affiliation ? ` · ${preferences.affiliation}` : ""}</p><div className="profile-interest-tags">{interests.length ? interests.map((interest) => <span key={interest}>{interest}</span>) : <span>Add your research interests</span>}</div></div><Link className="edit-profile" to="/dashboard/user-preference-form">Edit preferences</Link></div>
      <div className="profile-stats"><div><span className="stat-icon"><FaBookOpen /></span><strong>{savedPapers.length}</strong><small>Saved papers</small></div><div><span className="stat-icon"><FaPenNib /></span><strong>{preferences.researchStage || "Idea"}</strong><small>Current stage</small></div><div><span className="stat-icon"><FaUserFriends /></span><strong>{preferences.collaboration ? "Open" : "Private"}</strong><small>Collaboration</small></div></div>
      <div className="profile-content-grid"><article className="profile-panel"><h2>Research snapshot</h2><p className="profile-panel-intro">This is your local research profile. As your library grows, it will become the home for your topics, reading progress, and publishing journey.</p><div className="snapshot-list"><div><FaFlask /><span><small>Research interests</small><strong>{interests.length ? interests.join(", ") : "Not added yet"}</strong></span></div><div><FaGraduationCap /><span><small>Field of study</small><strong>{preferences.degree || "Not added yet"}</strong></span></div><div><FaCheckCircle /><span><small>Profile link</small><strong>{preferences.linkedin ? "Added" : "Not added yet"}</strong></span></div></div></article><article className="profile-panel profile-next"><h2>Next in your workspace</h2><p>Complete the pieces that make research easier to return to.</p><Link to="/dashboard/search-paper"><FaBookOpen /> Find relevant papers</Link><Link to="/dashboard/publishing-guide"><FaPenNib /> Explore the publishing guide</Link><Link to="/dashboard/conferences"><FaUserFriends /> Browse conferences</Link></article></div>
    </section>
  );
};

export default Profile;
