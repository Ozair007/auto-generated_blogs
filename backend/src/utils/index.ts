/**
 * Clean and parse JSON response from AI
 * Handles cases where AI wraps JSON in markdown code blocks
 */
export function parseJsonResponse(response: string): {
  title: string;
  content: string;
} {
  let cleanedResponse = response.trim();

  cleanedResponse = cleanedResponse.replace(/^```(?:json)?\s*/i, '');
  cleanedResponse = cleanedResponse.replace(/\s*```$/i, '');

  const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanedResponse = jsonMatch[0];
  }

  try {
    const parsed = JSON.parse(cleanedResponse) as {
      title: string;
      content: string;
    };

    if (!parsed.title || !parsed.content) {
      throw new Error(
        'JSON response missing required fields: title or content'
      );
    }

    return parsed;
  } catch (error: any) {
    console.error('Failed to parse JSON response:', cleanedResponse);
    throw new Error(
      `Failed to parse JSON response: ${error.message}. Response: ${cleanedResponse.substring(0, 200)}`
    );
  }
}
