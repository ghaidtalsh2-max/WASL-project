/**
 * Robust JSON extraction and parser for LLM responses
 * Handles markdown code fences (```json), leading/trailing text, and trailing commas
 */
export function safeParseJSON<T = any>(raw: string): T | null {
  if (!raw || typeof raw !== 'string') return null;

  let cleaned = raw.trim();

  // Remove markdown code fences
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }

  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }

  cleaned = cleaned.trim();

  // Try direct parse first
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Continue to advanced cleanup
  }

  // Find outermost JSON object or array
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  let startIdx = -1;
  let endIdx = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    endIdx = cleaned.lastIndexOf('}');
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    endIdx = cleaned.lastIndexOf(']');
  }

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    let candidate = cleaned.substring(startIdx, endIdx + 1);

    try {
      return JSON.parse(candidate) as T;
    } catch {
      // Fix trailing commas: ", }" -> "}" and ", ]" -> "]"
      candidate = candidate
        .replace(/,\s*([\}\]])/g, '$1')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // strip invisible control characters

      try {
        return JSON.parse(candidate) as T;
      } catch {
        return null;
      }
    }
  }

  return null;
}
