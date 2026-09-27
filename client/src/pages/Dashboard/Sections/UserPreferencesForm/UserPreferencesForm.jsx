import { useState } from "react";
import { FaCheck, FaFlask, FaUserGraduate } from "react-icons/fa";
import "./UserPreferencesForm.css";

const UserPreferencesForm = ({ initialPreferences, onSave }) => {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [errors, setErrors] = useState({});
  const update = (field, value) => { setSaved(false); setSaveError(""); setErrors((current) => ({ ...current, [field]: undefined })); setPreferences((current) => ({ ...current, [field]: value })); };
  const handleSubmit = async (event) => { event.preventDefault(); const nextErrors = {}; if (!preferences.interests.filter(Boolean).length) nextErrors.interests = "Add at least one research interest."; if (!preferences.affiliation.trim()) nextErrors.affiliation = "Add your university or organization."; if (!preferences.degree.trim()) nextErrors.degree = "Add your field of study."; if (preferences.linkedin) { try { new URL(preferences.linkedin); } catch { nextErrors.linkedin = "Enter a complete URL, starting with https://."; } } setErrors(nextErrors); if (Object.keys(nextErrors).length) return; try { await onSave({ ...preferences, interests: preferences.interests.filter(Boolean) }); setSaved(true); } catch (error) { setSaveError(error.response?.data?.error || "Unable to save preferences. Confirm the API is running."); } };

  return (
    <section className="preferences-page">
      <header className="preferences-heading"><div><p className="eyebrow">PERSONALIZE YOUR WORKSPACE</p><h1>Set up your research preferences</h1><p>Start here: tell IntelliPaper what you are working on so your workspace can become more useful over time.</p></div><span className="preferences-icon"><FaFlask /></span></header>
      <form className="preferences-form" onSubmit={handleSubmit}>
        <div className="form-field form-field-wide"><label htmlFor="interests">Research interests</label><input id="interests" value={preferences.interests.join(", ")} onChange={(event) => update("interests", event.target.value.split(",").map((item) => item.trim()))} placeholder="AI, Data Science, Human-computer interaction" aria-invalid={Boolean(errors.interests)} aria-describedby={errors.interests ? "interests-error" : undefined} /><small>Separate interests with commas.</small>{errors.interests && <span id="interests-error" className="field-error" role="alert">{errors.interests}</span>}</div>
        <div className="form-field"><label htmlFor="affiliation">Affiliation</label><input id="affiliation" value={preferences.affiliation} onChange={(event) => update("affiliation", event.target.value)} placeholder="University or organization" aria-invalid={Boolean(errors.affiliation)} aria-describedby={errors.affiliation ? "affiliation-error" : undefined} />{errors.affiliation && <span id="affiliation-error" className="field-error" role="alert">{errors.affiliation}</span>}</div>
        <div className="form-field"><label htmlFor="degree">Field of study</label><input id="degree" value={preferences.degree} onChange={(event) => update("degree", event.target.value)} placeholder="Computer Engineering" aria-invalid={Boolean(errors.degree)} aria-describedby={errors.degree ? "degree-error" : undefined} />{errors.degree && <span id="degree-error" className="field-error" role="alert">{errors.degree}</span>}</div>
        <div className="form-field"><label htmlFor="stage">Research stage</label><select id="stage" value={preferences.researchStage} onChange={(event) => update("researchStage", event.target.value)}><option value="Idea">Exploring an idea</option><option value="Writing">Writing</option><option value="Reviewing">Reviewing</option><option value="Publishing">Preparing to publish</option></select></div>
        <div className="form-field"><label htmlFor="linkedin">LinkedIn or Google Scholar</label><input id="linkedin" type="url" value={preferences.linkedin} onChange={(event) => update("linkedin", event.target.value)} placeholder="https://..." aria-invalid={Boolean(errors.linkedin)} aria-describedby={errors.linkedin ? "linkedin-error" : undefined} />{errors.linkedin && <span id="linkedin-error" className="field-error" role="alert">{errors.linkedin}</span>}</div>
        <label className="collaboration-toggle"><input type="checkbox" checked={preferences.collaboration} onChange={(event) => update("collaboration", event.target.checked)} /><span><FaUserGraduate /></span><span><strong>Open to collaboration</strong><small>Show that you are open to connecting with other researchers.</small></span></label>
        <div className="preferences-actions"><button type="submit">Save preferences</button>{saved && <span><FaCheck /> Preferences saved</span>}{saveError && <p className="preferences-error" role="alert">{saveError}</p>}</div>
      </form>
    </section>
  );
};

export default UserPreferencesForm;
