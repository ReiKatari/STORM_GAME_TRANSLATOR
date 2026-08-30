/**
 * 🛡️ Line Break & Placeholder Guard (v1.16.0 Enhancement)
 * 
 * Protects formatting, newlines, and variable tokens during AI translation.
 * Features:
 * - autoFixLineBreaks: Re-splits translated text proportionally to match source line counts
 * - autoFixPlaceholders: Preserves {0}, %s, $1, <tag>, \n, \r\n, and game-engine tokens
 */

export interface LineBreakGuardResult {
  text: string;
  modified: boolean;
  sourceLines: number;
  targetLines: number;
}

/**
 * Normalizes and protects game placeholders before sending to AI
 */
export function protectPlaceholders(text: string): { protectedText: string; tokens: Map<string, string> } {
  const tokens = new Map<string, string>();
  let counter = 0;

  // Match common game variables: {name}, %s, %d, $1, \n, <color=#fff>, [b], \u0000, etc.
  const pattern = /(\{[a-zA-Z0-9_]+\}|%[0-9]*[sdifx]|%[a-zA-Z0-9_]+%|\$[0-9]+|<[^>]+>|\[\/?[a-zA-Z0-9_]+\])/g;

  const protectedText = text.replace(pattern, (match) => {
    const placeholder = `__VAR_${counter++}__`;
    tokens.set(placeholder, match);
    return placeholder;
  });

  return { protectedText, tokens };
}

/**
 * Restores placeholders after AI translation
 */
export function restorePlaceholders(translatedText: string, tokens: Map<string, string>): string {
  let result = translatedText;
  tokens.forEach((originalValue, placeholder) => {
    result = result.replaceAll(placeholder, originalValue);
  });
  return result;
}

/**
 * Proportional newline reconstruction (v1.16.0 algorithm)
 * Matches the source line breaks if AI flattened multiple lines into one
 */
export function autoFixLineBreaks(source: string, translated: string): LineBreakGuardResult {
  const isCRLF = source.includes('\r\n');
  const newline = isCRLF ? '\r\n' : '\n';

  const sourceLines = source.split(/\r?\n/);
  const targetLines = translated.split(/\r?\n/);

  if (sourceLines.length <= 1 || sourceLines.length === targetLines.length) {
    return {
      text: translated,
      modified: false,
      sourceLines: sourceLines.length,
      targetLines: targetLines.length,
    };
  }

  // If translated text flattened lines, distribute words proportionally
  const words = translated.split(/\s+/);
  if (words.length < sourceLines.length) {
    return {
      text: translated,
      modified: false,
      sourceLines: sourceLines.length,
      targetLines: targetLines.length,
    };
  }

  const resultLines: string[] = [];
  let wordIdx = 0;
  const totalSourceChars = source.length || 1;

  for (let i = 0; i < sourceLines.length; i++) {
    if (i === sourceLines.length - 1) {
      // Last line gets remaining words
      resultLines.push(words.slice(wordIdx).join(' '));
      break;
    }

    const targetFraction = sourceLines[i].length / totalSourceChars;
    const targetWordCount = Math.max(1, Math.round(words.length * targetFraction));
    const chunk = words.slice(wordIdx, wordIdx + targetWordCount).join(' ');
    resultLines.push(chunk);
    wordIdx += targetWordCount;
  }

  const reconstructed = resultLines.join(newline);
  return {
    text: reconstructed,
    modified: true,
    sourceLines: sourceLines.length,
    targetLines: resultLines.length,
  };
}
