import { InferenceClient } from '@huggingface/inference';
import { parseJsonResponse } from '../utils';

const MODEL = process.env.AI_MODEL;
if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error('HUGGINGFACE_API_KEY environment variable is required');
}

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

/**
 * Generate article using AI
 */
export async function generateArticleContent(): Promise<string> {
  const prompt = `
  Generate a creative and engaging blog article about technology, programming, or software development. The article should be well-structured, informative, and between 500-1000 words. Include an introduction, main content with examples, and a conclusion. 
  Return the response in JSON format with the following keys: title: title, content: article.
  Do not include title in the content.
  `;
  try {
    const response = await client.chatCompletion({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: prompt,
          response_format: { type: 'json_object' },
        },
      ],
      timeout: 60000,
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error(
        'Failed to generate article content: no choices in response'
      );
    }

    const content = response.choices[0].message?.content;
    if (!content || content === null) {
      throw new Error(
        'Failed to generate article content: empty content in response'
      );
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      throw new Error(
        'Failed to generate article content: content is empty after trimming'
      );
    }

    if (trimmedContent.length < 20) {
      throw new Error(
        `Generated content is too short (${trimmedContent.length} characters). Expected at least 20 characters.`
      );
    }

    return trimmedContent;
  } catch (error: any) {
    console.error('Error generating article content:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate article content: ${error.message}`);
    }
    throw new Error(
      'Failed to generate article content: unknown error occurred'
    );
  }
}

/**
 * Generate a complete article
 */
export async function generateArticle(): Promise<{
  title: string;
  content: string;
}> {
  const response = await generateArticleContent();
  const { title, content } = parseJsonResponse(response);

  return { title, content };
}
