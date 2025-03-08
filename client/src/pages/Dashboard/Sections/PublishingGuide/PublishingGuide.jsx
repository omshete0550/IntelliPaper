import React, { useState } from "react";
import "./PublishingGuide.css";

const steps = [
  {
    title: "1. Choose a Research Topic",
    content:
      "Select a relevant and impactful topic based on recent trends and research gaps.",
  },
  {
    title: "2. Conduct a Literature Review",
    content:
      "Study previous research papers to identify gaps and build a strong foundation.",
  },
  {
    title: "3. Write Your Research Paper",
    content:
      "Follow the standard structure: Abstract, Introduction, Methodology, Results, and Conclusion.",
  },
  {
    title: "4. Select a Journal",
    content:
      "Choose a journal that aligns with your field. Check impact factors and submission guidelines.",
  },
  {
    title: "5. Format Your Paper",
    content:
      "Use proper formatting as per journal guidelines (APA, IEEE, etc.).",
  },
  {
    title: "6. Submit and Peer Review",
    content:
      "Submit your paper to the journal and respond to peer review feedback constructively.",
  },
  {
    title: "7. Publication & Promotion",
    content:
      "Once accepted, promote your research via conferences, social media, and academic networks.",
  },
];

const PublishingGuide = () => {
  const [expandedStep, setExpandedStep] = useState(null);

  const toggleStep = (index) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <div className="publishing-guide-container">
      <h2>📜 Research Paper Publishing Guide</h2>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((expandedStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-card">
            <div className="step-header" onClick={() => toggleStep(index)}>
              <h3>{step.title}</h3>
              <span>{expandedStep === index ? "▲" : "▼"}</span>
            </div>
            {expandedStep === index && (
              <p className="step-content">{step.content}</p>
            )}
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button className="download-btn">📥 Download Templates</button>
        <button className="journals-btn">🔍 Explore Journals</button>
      </div>
    </div>
  );
};

export default PublishingGuide;
