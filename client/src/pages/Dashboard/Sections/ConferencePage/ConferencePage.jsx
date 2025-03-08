import React, { useState } from "react";
import "./Conference.css";

const conferences = [
  {
    id: 1,
    name: "AI & Machine Learning Conference 2025",
    date: "June 15, 2025",
    location: "San Francisco, USA",
    description: "A global summit on AI advancements and future trends.",
    link: "https://aiconference2025.com",
  },
  {
    id: 2,
    name: "Blockchain Expo 2025",
    date: "July 10, 2025",
    location: "London, UK",
    description: "Exploring the impact of blockchain technology worldwide.",
    link: "https://blockchainexpo.com",
  },
  {
    id: 3,
    name: "Cybersecurity Summit",
    date: "August 20, 2025",
    location: "Berlin, Germany",
    description: "The latest in cybersecurity innovations and strategies.",
    link: "https://cybersec2025.com",
  },
];

const ConferencePage = () => {
  const [search, setSearch] = useState("");

  const filteredConferences = conferences.filter((conf) =>
    conf.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="conference-container">
      <h2>Upcoming Conferences</h2>

      <input
        type="text"
        className="search-box"
        placeholder="Search conferences..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="conference-list">
        {filteredConferences.map((conf) => (
          <div key={conf.id} className="conference-card">
            <h3>{conf.name}</h3>
            <p>
              <strong>Date:</strong> {conf.date}
            </p>
            <p>
              <strong>Location:</strong> {conf.location}
            </p>
            <p>{conf.description}</p>
            <a
              href={conf.link}
              target="_blank"
              rel="noopener noreferrer"
              className="register-btn"
            >
              Register
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConferencePage;
