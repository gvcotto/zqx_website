const SMALL_TITLE_WORDS = new Set([
  "a",
  "al",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "con",
  "de",
  "del",
  "desde",
  "dentro",
  "e",
  "el",
  "en",
  "for",
  "from",
  "hasta",
  "in",
  "inside",
  "into",
  "la",
  "las",
  "lo",
  "los",
  "nor",
  "o",
  "of",
  "on",
  "or",
  "para",
  "por",
  "que",
  "sin",
  "sobre",
  "the",
  "to",
  "u",
  "un",
  "una",
  "unas",
  "unos",
  "with",
  "y",
]);

export function titleCase(value: string) {
  let wordIndex = 0;

  return value.replace(/[\p{L}\p{N}][\p{L}\p{M}\p{N}'\u2019]*/gu, (word) => {
    const lowerWord = word.toLocaleLowerCase();
    const isAcronym = /^[A-Z0-9]{2,}$/.test(word);
    const isSmallWord = wordIndex > 0 && SMALL_TITLE_WORDS.has(lowerWord);
    wordIndex += 1;

    if (isAcronym) return word;
    if (isSmallWord) return lowerWord;

    return `${word.charAt(0).toLocaleUpperCase()}${word.slice(1).toLocaleLowerCase()}`;
  });
}
