import React from "react";
import "./DashboardHome.css";

const DashboardHome = () => {
  // Sample Data
  const recommendations = [
    {
      title: "AI in Healthcare",
      summary: "Exploring how AI is revolutionizing the medical field.",
      link: "https://arxiv.org/abs/2301.12345",
      badge: "Featured",
    },
    {
      title: "Quantum Computing Breakthrough",
      summary: "New research in quantum entanglement and computation speed.",
      link: "https://arxiv.org/abs/2302.67890",
      badge: "New",
    },
    {
      title: "Neural Networks in NLP",
      summary:
        "The evolution of deep learning models for language understanding.",
      link: "https://arxiv.org/abs/2303.13579",
      badge: "Popular",
    },
  ];

  const trendingTopics = [
    "AI Ethics",
    "Climate Change Impact",
    "Blockchain Security",
    "Autonomous Vehicles",
    "Genomics & Bioinformatics",
  ];

  const researchers = [
    { name: "Dr. John Doe", affiliation: "MIT AI Lab", badge: "Expert" },
    {
      name: "Prof. Jane Smith",
      affiliation: "Stanford NLP Group",
      badge: "Top Researcher",
    },
    {
      name: "Dr. Robert Brown",
      affiliation: "Harvard Quantum Research",
      badge: "Pioneer",
    },
  ];

  // Function to truncate title after two words
  const truncateTitle = (title) => {
    const words = title.split(" ");
    return words.length > 2 ? words.slice(0, 2).join(" ") + "..." : title;
  };

  return (
    <div className="dashboard_home_container">
      <section className="feed-section">
        <h2>Recommended Papers</h2>
        <div className="card-container">
          {recommendations.map((paper, index) => (
            <div key={index} className="card">
              <span className="badge">{paper.badge}</span>
              <h2 className="title">{truncateTitle(paper.title)}</h2>
              <p className="description">{paper.summary}</p>
              <div className="stats">
                <div className="stat">
                  <div className="stat-value">100%</div>
                  <div className="stat-label">Research Quality</div>
                </div>
                <div className="stat">
                  <div className="stat-value">Trending</div>
                  <div className="stat-label">Category</div>
                </div>
                <div className="stat">
                  <div className="stat-value">Cited</div>
                  <div className="stat-label">Impact</div>
                </div>
              </div>
              <a
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="read-more"
              >
                Read More
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Research Topics */}
      <section className="feed-section">
        <h2>Trending Topics</h2>
        <div className="card-container">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="card">
              <span className="badge">Hot</span>
              <h2 className="title">{truncateTitle(topic)}</h2>
              <p className="description">
                This topic is currently trending among researchers.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested Researchers */}
      <section className="feed-section">
        <h2>Suggested Researchers</h2>
        <div className="card-container">
          {researchers.map((researcher, index) => (
            <div key={index} className="card">
              <span className="badge">{researcher.badge}</span>
              <h2 className="title">{researcher.name}</h2>
              <p className="description">{researcher.affiliation}</p>
              <button className="follow-btn">Follow</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
