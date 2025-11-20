export const TOPIC_TAGS = {
  // People & Society
  "People & Society": [
    "Education",
    "Culture",
    "Tradition",
    "Language & Communication",
    "Family & Relationships",
    "Sociology & Communities",
    "Religion & Beliefs",
  ],

  // Government & Law
  "Government & Law": [
    "Politics & Government",
    "Laws & Regulations",
    "Crime & Justice",
    "Human Rights",
    "Immigration",
  ],

  // Science & Technology
  "Science & Technology": [
    "Technology & Innovation",
    "Artificial Intelligence",
    "Space & Astronomy",
    "Biology & Genetics",
    "Environment (General)",
    "Energy (Renewable / Fossil)",
    "Climate Change",
    "Medicine & Health",
    "Science & Research",
  ],

  // Business & Economics
  "Business & Economics": [
    "Business & Management",
    "Finance & Banking",
    "Economics & Markets",
    "Workplace & Employment",
    "Entrepreneurship",
    "Marketing & Advertising",
  ],

  // Global Issues
  "Global Issues": [
    "Globalization",
    "Poverty & Inequality",
    "Population & Urbanization",
    "War & Peace",
    "Sustainability",
    "International Relations",
  ],

  // Arts & Media
  "Arts & Media": [
    "Art & Creativity",
    "Literature",
    "Film & Cinema",
    "Music",
    "Media & Communication",
    "Journalism",
  ],

  // Lifestyle & Daily Life
  "Lifestyle & Daily Life": [
    "Food & Nutrition",
    "Travel & Tourism",
    "Sports & Fitness",
    "Housing & Living Standards",
    "Fashion & Beauty",
  ],

  // Nature & Geography
  "Nature & Geography": [
    "Animals & Wildlife",
    "Plants & Agriculture",
    "Water & Marine Life",
    "Mountains & Landforms",
    "Weather & Natural Disasters",
  ],

  // Technology-Specific Subtopics
  "Technology-Specific": [
    "Internet & Social Media",
    "Robotics",
    "Telecommunications",
    "Cybersecurity",
    "Data & Privacy",
  ],

  // Advanced Academic Concepts
  "Advanced Academic": [
    "Abstract Concepts",
    "Psychology & Behavior",
    "Philosophy & Ethics",
    "Logic & Critical Thinking",
    "Rhetoric & Argument",
    "Literature & Contextual Words",
    "Advanced Verbs (Formal)",
    "Advanced Adjectives",
  ],

  // Practice-Supportive Tags
  "Practice Support": [
    "Academic Word List (AWL)",
    "Collocations",
    "Idioms & Phrasal Verbs",
    "Formal / Informal",
    "Technical / Scientific Terms",
    "High-Frequency IELTS",
    "High-Frequency GRE",
  ],
} as const;

// Flatten all tags for easy search/filter
export const ALL_TOPIC_TAGS = Object.values(TOPIC_TAGS).flat();

// Get category for a tag
export function getCategoryForTag(tag: string): string | undefined {
  for (const [category, tags] of Object.entries(TOPIC_TAGS)) {
    if (tags.includes(tag as never)) {
      return category;
    }
  }
  return undefined;
}
