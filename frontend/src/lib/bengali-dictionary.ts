/**
 * Bengali Dictionary Service
 * Based on: https://github.com/Nafisa41/Dictionary--English-to-Bangla-
 *
 * This service provides Bengali translations for English words
 * using a local JSON database file.
 */

export interface BengaliTranslation {
  word: string;
  meaning: string;
  partOfSpeech?: string;
  examples?: string[];
}

// This will be populated from a JSON file
let bengaliDictionary: Record<string, BengaliTranslation> | null = null;

/**
 * Load Bengali dictionary from JSON file
 */
export async function loadBengaliDictionary(): Promise<void> {
  if (bengaliDictionary) return;

  try {
    // TODO: Add the downloaded JSON file to public/data/bengali-dictionary.json
    const response = await fetch("/data/bengali-dictionary.json");
    if (response.ok) {
      bengaliDictionary = await response.json();
    }
  } catch (error) {
    console.warn("Bengali dictionary not loaded:", error);
    bengaliDictionary = {};
  }
}

/**
 * Search for Bengali meaning of an English word
 */
export async function searchBengaliMeaning(
  englishWord: string
): Promise<BengaliTranslation | null> {
  await loadBengaliDictionary();

  if (!bengaliDictionary) {
    return null;
  }

  const normalizedWord = englishWord.toLowerCase().trim();

  // Try exact match first
  if (bengaliDictionary[normalizedWord]) {
    return bengaliDictionary[normalizedWord];
  }

  // Try case-insensitive search
  const keys = Object.keys(bengaliDictionary);
  const matchedKey = keys.find((key) => key.toLowerCase() === normalizedWord);

  if (matchedKey) {
    return bengaliDictionary[matchedKey];
  }

  return null;
}

/**
 * Get Bengali meanings for multiple words
 */
export async function searchBengaliMeanings(
  englishWords: string[]
): Promise<Record<string, BengaliTranslation | null>> {
  await loadBengaliDictionary();

  const results: Record<string, BengaliTranslation | null> = {};

  for (const word of englishWords) {
    results[word] = await searchBengaliMeaning(word);
  }

  return results;
}

/**
 * Check if Bengali dictionary is available
 */
export function isBengaliDictionaryAvailable(): boolean {
  return (
    bengaliDictionary !== null && Object.keys(bengaliDictionary).length > 0
  );
}
