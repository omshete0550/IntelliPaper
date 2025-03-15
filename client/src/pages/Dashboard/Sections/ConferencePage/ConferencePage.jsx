import React, { useState } from "react";
import "./Conference.css";

const allConferences = [
  {
    id: 1,
    name: "Welcome to the CMT Site Request Submission System!",
    date: "1/1/2035",
    location: "",
    link: "",
  },
  {
    id: 2,
    name: "Tackling Climate Change with Machine Learning",
    date: "5/1/2023",
    location: "Kigali, Rwanda",
    link: "https://www.climatechange.ai/events/iclr2023",
  },
  {
    id: 3,
    name: "Proc. of the VLDB Volume 19 (for VLDB 2026)",
    date: "8/30/2026",
    location: "Boston, USA",
    link: "https://vldb.org/2026/",
  },
  {
    id: 4,
    name: "28th International Conference on Pattern Recognition",
    date: "8/17/2026",
    location: "Lyon, France",
    link: "https://icpr2026.org/",
  },
  {
    id: 5,
    name: "International Conference on Advances and Applications of AI & ML-2025",
    date: "12/26/2024",
    location: "Greater Noida, India",
    link: "https://www.icaaaiml.com/index.html",
  },
  {
    id: 6,
    name: "International Conference on Emerging Trends in Mobile Computing",
    date: "6/17/2026",
    location: "Bengaluru, India",
    link: "https://newhorizonindia.edu/icemcsi26/",
  },
  {
    id: 7,
    name: "SIGMOD International Conference on Management of Data (2026)",
    date: "5/31/2026",
    location: "Bengaluru, India",
    link: "https://2026.sigmod.org/",
  },
  {
    id: 8,
    name: "2026 16th Symposium on Hazards, Prevention and Mitigation of Industrial Explosions",
    date: "4/20/2026",
    location: "Kaohsiung, Taiwan",
    link: "http://www.ishpmie2026.com",
  },
  {
    id: 9,
    name: "International Conference on Data Analytics and Intelligent Systems",
    date: "4/14/2026",
    location: "Khenchela, Algeria",
    link: "https://www.icdais.org",
  },
  {
    id: 10,
    name: "8th Pan-Pacific Nursing Conference",
    date: "3/24/2026",
    location: "Hong Kong, China",
    link: "https://8thpanpacificconf.nur.cuhk.edu.hk",
  },
  {
    id: 11,
    name: "World Conference on Computational Science and Technology",
    date: "3/26/2026",
    location: "Gharuan, Punjab, India",
    link: "https://www.cuchd.in/conference/WcCST-26/",
  },
  {
    id: 12,
    name: "International Conference on Intelligent Systems and AI Applications",
    date: "3/26/2026",
    location: "Nizwa, Oman",
    link: "https://unizwa.edu.om/ISAA2026/",
  },
  {
    id: 13,
    name: "International Conference on Extending Database Technology 2026",
    date: "3/23/2026",
    location: "Tampere, Finland",
    link: "https://edbticdt2026.github.io/",
  },
  {
    id: 14,
    name: "2026 30th International Conference on Information Technology",
    date: "2/24/2026",
    location: "Zabljak, Montenegro",
    link: "https://www.it.ac.me/en/index.php?skup=30",
  },
  {
    id: 15,
    name: "International Conference on Innovative Practices in Tech and Management (2026)",
    date: "2/19/2026",
    location: "Noida, India",
    link: "https://amity.edu/iciptm2026/",
  },
  {
    id: 16,
    name: "5th IEEE International Conference on AI in Cybersecurity",
    date: "2/18/2026",
    location: "Houston, USA",
    link: "https://icaic.gyancity.com/index.html",
  },
  {
    id: 17,
    name: "International Conference on Intelligent Computing and Automation for Sustainable Solutions",
    date: "2/12/2026",
    location: "Faridabad, India",
    link: "https://www.icass-2026.in/",
  },
  {
    id: 18,
    name: "International Conference on Emerging Applications of Information Technology",
    date: "1/30/2026",
    location: "Kolkata, India",
    link: "https://csikolkata.org/EAIT2026/",
  },
  {
    id: 19,
    name: "International Conference on Emerging trends and Innovations in ICT (ICEI)",
    date: "1/9/2026",
    location: "Pune, India",
    link: "https://icei-pict.com",
  },
  {
    id: 20,
    name: "The Third International Conference on Holodecks",
    date: "1/8/2026",
    location: "Los Angeles, USA",
    link: "https://www.holodecks.quest",
  },
  {
    id: 21,
    name: "2026 10th International Conference on Control Engineering and AI",
    date: "1/4/2026",
    location: "Buenos Aires, Argentina",
    link: "https://www.cceai.org/",
  },
];

const ConferencePage = () => {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all");
  const [myConferences, setMyConferences] = useState([]);

  const handleAddToMyConferences = (conf) => {
    if (!myConferences.some((c) => c.id === conf.id)) {
      setMyConferences([...myConferences, conf]);
    }
  };

  const filteredConferences = (
    view === "all" ? allConferences : myConferences
  ).filter((conf) => conf.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="conference-container">
      <div className="conference-header">
        <div className="btn-cont">
          <button
            className={view === "my" ? "active" : ""}
            onClick={() => setView("my")}
          >
            My Conferences ({myConferences.length})
          </button>
          <button
            className={view === "all" ? "active" : ""}
            onClick={() => setView("all")}
          >
            All Conferences
          </button>
        </div>
        <input
          type="text"
          className="search-box"
          placeholder="Type to filter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="conference-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Start Date</th>
            <th>Location</th>
            <th>External URL</th>
            {view === "all" && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {filteredConferences.length > 0 ? (
            filteredConferences.map((conf) => (
              <tr key={conf.id}>
                <td>{conf.name}</td>
                <td>{conf.date}</td>
                <td>{conf.location}</td>
                <td>
                  <a href={conf.url} target="_blank" rel="noopener noreferrer">
                    🌍 Visit
                  </a>
                </td>
                {view === "all" && (
                  <td>
                    <button
                      onClick={() => handleAddToMyConferences(conf)}
                      className="add-btn"
                    >
                      Add
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={view === "all" ? 5 : 4} className="no-data">
                No conferences found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ConferencePage;
