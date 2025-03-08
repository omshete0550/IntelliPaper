import React from "react";
import "./Profile.css";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FaEnvelope, FaGlobe, FaUniversity, FaWrench } from "react-icons/fa";

const connections = [
  {
    id: 1,
    name: "Hamza Sayyed",
    role: "Backend developer",
    img: "https://www.svgrepo.com/show/382106/male-avatar-boy-face-man-user-9.svg",
  },
  {
    id: 2,
    name: "Parth Puranik",
    role: "Full stack developer",
    img: "https://www.svgrepo.com/show/382106/male-avatar-boy-face-man-user-9.svg",
  },
  {
    id: 3,
    name: "Mohib Sayed",
    role: "Frontend developer",
    img: "https://www.svgrepo.com/show/382106/male-avatar-boy-face-man-user-9.svg",
  },
];

const researchPapers = [
  {
    id: 1,
    title: "Deep Learning for NLP",
    budget: "$3,000",
    status: "Ongoing",
    completion: 70,
    logo: "https://cdn-icons-png.flaticon.com/512/1828/1828665.png",
    color: "blue",
  },
  {
    id: 2,
    title: "Quantum Computing and AI",
    budget: "$5,500",
    status: "Completed",
    completion: 100,
    logo: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
    color: "green",
  },
  {
    id: 3,
    title: "Blockchain in Cybersecurity",
    budget: "$2,800",
    status: "Rejected",
    completion: 40,
    logo: "https://cdn-icons-png.flaticon.com/512/1828/1828970.png",
    color: "red",
  },
  {
    id: 4,
    title: "AI for Drug Discovery",
    budget: "$4,200",
    status: "Ongoing",
    completion: 55,
    logo: "https://cdn-icons-png.flaticon.com/512/1828/1828757.png",
    color: "orange",
  },
];

const Profile = () => {
  return (
    <>
      <div className="profile_container">
        <div className="profile_left_container">
          <div className="profile_hero_container">
            <div className="profile_hero">
              {" "}
              <div className="profile_hero_img">
                <img
                  src="https://www.aimlay.com/wp-content/uploads/2022/05/Writing-a-research-paper.jpg"
                  alt=""
                />
              </div>
              <div className="profile_card">
                <div className="profile_details">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt=""
                  />
                  <div>
                    <h3>Om Shete</h3>
                    <span>Computer Engineering</span>
                  </div>
                </div>
                <div>
                  <i>
                    <FaInstagram />{" "}
                  </i>
                  <i>
                    <FaLinkedin />{" "}
                  </i>
                  <i>
                    <FaTwitter />{" "}
                  </i>
                </div>
              </div>
            </div>

            <div className="profile_details_container">
              <h3>About Me</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
                placeat minima a aliquid aliquam perferendis corporis neque
                deleniti, provident qui odio nihil dolore velit illum ipsum,
                perspiciatis et amet non.
              </p>
              <br />
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
                placeat minima a aliquid aliquam perferendis corporis neque
                deleniti, provident qui odio nihil dolore velit illum ipsum,
                perspiciatis et amet non.
              </p>
            </div>
          </div>

          <div className="profile_table_container">
            <div className="research-table">
              <h2>Research Papers Table</h2>
              <table>
                <thead>
                  <tr>
                    <th>PAPER TITLE</th>
                    <th>BUDGET</th>
                    <th>STATUS</th>
                    <th>COMPLETION</th>
                  </tr>
                </thead>
                <tbody>
                  {researchPapers.map((paper) => (
                    <tr key={paper.id}>
                      <td className="paper">
                        <img src={paper.logo} alt={paper.title} />
                        <span>{paper.title}</span>
                      </td>
                      <td>{paper.budget}</td>
                      <td className={`status ${paper.status.toLowerCase()}`}>
                        {paper.status}
                      </td>
                      <td>
                        <div className="progress-bar">
                          <span className="percentage">
                            {paper.completion}%
                          </span>
                          <div
                            className="progress"
                            style={{
                              width: `${paper.completion}%`,
                              backgroundColor: paper.color,
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="menu">⋮</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="profile_right_container">
          <div className="connections_list">
            <h2>Connections</h2>
            {connections.map((connection) => (
              <div className="connections_container" key={connection.id}>
                <div className="connections_details">
                  <img src={connection.img} alt={connection.name} />
                  <div>
                    <h3>{connection.name}</h3>
                    <span>{connection.role}</span>
                  </div>
                </div>

                <div className="connections_send_btn">
                  <button>SEND MESSAGE</button>
                </div>
              </div>
            ))}
          </div>

          <div className="more_details_container">
            <div className="more-details-card">
              <h2>More Details</h2>

              <div className="detail-item">
                <FaEnvelope className="icon" />
                <div>
                  <h4>Email</h4>
                  <p className="highlight">user@user.com</p>
                </div>
              </div>

              <div className="detail-item">
                <FaGlobe className="icon" />
                <div>
                  <h4>Languages</h4>
                  <p className="highlight">English, French</p>
                </div>
              </div>

              <div className="detail-item">
                <FaUniversity className="icon" />
                <div>
                  <h4>Education</h4>
                  <p className="highlight">Harvard</p>
                </div>
              </div>

              <div className="detail-item">
                <FaWrench className="icon" />
                <div>
                  <h4>Skills</h4>
                  <p className="highlight">C, C++, JavaScript, HTML</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
