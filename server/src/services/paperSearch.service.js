const papers = [
  { externalId: "health-ai", title: "Foundation models for clinical reasoning", authors: ["Singhal, K.", "Azizi, S.", "Tu, T."], venue: "Nature", year: "2025", citations: 284, abstract: "A review of how multimodal foundation models can support careful, evidence-led clinical decisions.", topics: ["Artificial intelligence", "Healthcare"], link: "https://arxiv.org" },
  { externalId: "efficient-llm", title: "Efficient language models at the edge", authors: ["Kim, J.", "Zhao, L.", "Raman, P."], venue: "ACM Computing Surveys", year: "2024", citations: 157, abstract: "Methods for reducing inference cost while preserving language-model quality on constrained devices.", topics: ["Machine learning", "Systems"], link: "https://dl.acm.org" },
  { externalId: "trustworthy-ai", title: "Measuring trust in human-AI collaboration", authors: ["Gonzalez, M.", "Patel, R.", "Chen, Y."], venue: "CHI", year: "2024", citations: 91, abstract: "A practical framework for studying calibrated trust when people work alongside intelligent systems.", topics: ["AI ethics", "HCI"], link: "https://dl.acm.org" },
];

export const searchPapers = async ({ query, topic, year }) => {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedTopic = topic.trim().toLowerCase();
  return papers.filter((paper) => {
    const searchable = `${paper.title} ${paper.authors.join(" ")} ${paper.abstract} ${paper.topics.join(" ")}`.toLowerCase();
    const matchesTopic = !normalizedTopic || paper.topics.some((item) => item.toLowerCase().includes(normalizedTopic));
    return (!normalizedQuery || searchable.includes(normalizedQuery)) && matchesTopic && (!year || paper.year === year);
  });
};
