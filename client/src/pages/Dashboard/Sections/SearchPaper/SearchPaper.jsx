import React, { useState } from "react";
import "./SearchPaper.css";

const SearchPapers = () => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ category: "", date: "", author: "" });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample Data
  const samplePapers = [
    {
      title: "AI in Healthcare",
      summary: "Exploring AI's role in medicine.",
      author: "John Doe",
      date: "2023-01-12",
      link: "https://arxiv.org/abs/2301.12345",
    },
    {
      title: "Quantum Computing Breakthrough",
      summary: "New advancements in quantum physics.",
      author: "Jane Smith",
      date: "2023-02-20",
      link: "https://arxiv.org/abs/2302.67890",
    },
    {
      title: "Deep Learning in NLP",
      summary: "Evolution of transformers in text processing.",
      author: "Robert Brown",
      date: "2022-11-05",
      link: "https://arxiv.org/abs/2303.13579",
    },
  ];

  // Handle Search
  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const filteredResults = samplePapers.filter(
        (paper) =>
          paper.title.toLowerCase().includes(query.toLowerCase()) &&
          (filters.category === "" || paper.title.includes(filters.category)) &&
          (filters.date === "" || paper.date.includes(filters.date)) &&
          (filters.author === "" || paper.author.toLowerCase().includes(filters.author.toLowerCase()))
      );
      setResults(filteredResults);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="search_paper_container">
      <h1>Search Research Papers</h1>

      {/* Search Bar */}
      <div className="search_bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search research papers..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Filters */}
      <div className="filters">
        <select onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          <option value="AI">AI</option>
          <option value="Quantum">Quantum Computing</option>
        </select>

        <select onChange={(e) => setFilters({ ...filters, date: e.target.value })}>
          <option value="">All Dates</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>

        <input
          type="text"
          placeholder="Author name..."
          onChange={(e) => setFilters({ ...filters, author: e.target.value })}
        />
      </div>

      {/* Search Results */}
      {loading ? <p>Loading...</p> : null}

      <div className="results_container">
        {results.length > 0 ? (
          results.map((paper, index) => (
            <div key={index} className="paper_card">
              <h2>{paper.title}</h2>
              <p>{paper.summary}</p>
              <p><strong>Author:</strong> {paper.author}</p>
              <p><strong>Date:</strong> {paper.date}</p>
              <a href={paper.link} target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPapers;
