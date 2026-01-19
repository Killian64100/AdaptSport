/**
 * Tavily API Integration Service
 * Queries scientific research papers and protocols
 * Provides evidence-based recommendations for bio-hacking strategies
 */

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number; // relevance score 0-1
  publishedDate?: string;
  source: string;
}

export interface TavilyResearchContext {
  query: string;
  results: TavilySearchResult[];
  summary: string;
  keyFindings: string[];
  methodology?: string;
  limitations?: string[];
}

export interface ResearchAgent {
  topic: string;
  status: 'idle' | 'searching' | 'summarizing' | 'complete';
  context: TavilyResearchContext | null;
  lastUpdated: Date | null;
}

/**
 * Initialize Tavily API with environment variable
 */
const getTavilyApiKey = (): string => {
  const key = process.env.NEXT_PUBLIC_TAVILY_API_KEY || process.env.TAVILY_API_KEY;
  if (!key) {
    throw new Error(
      'TAVILY_API_KEY not configured. Set environment variable for science research integration.'
    );
  }
  return key;
};

/**
 * Search for scientific research on a topic
 */
export async function searchScientificResearch(
  query: string,
  maxResults: number = 5
): Promise<TavilyResearchContext> {
  try {
    const apiKey = getTavilyApiKey();

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${query} scientific research protocol study`,
        include_answer: true,
        max_results: maxResults,
        topic: 'research',
        include_raw_content: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.statusText}`);
    }

    const data = await response.json();

    const results: TavilySearchResult[] = data.results.map((result: any) => ({
      title: result.title,
      url: result.url,
      content: result.content,
      score: result.score || 0.5,
      publishedDate: result.published_date,
      source: new URL(result.url).hostname,
    }));

    const summary = data.answer || 'Research compilation in progress...';

    // Extract key findings from results
    const keyFindings = results
      .filter((r) => r.score > 0.6)
      .slice(0, 3)
      .map((r) => `${r.title} (${r.source})`);

    return {
      query,
      results,
      summary,
      keyFindings,
      methodology: 'Tavily API cross-document analysis',
    };
  } catch (error) {
    console.error('Tavily search failed:', error);
    throw error;
  }
}

/**
 * Get HRV and VFC specific research
 */
export async function searchVFCResearch(): Promise<TavilyResearchContext> {
  return searchScientificResearch(
    'Heart Rate Variability HRV VFC recovery metrics athletes',
    5
  );
}

/**
 * Get protocol-specific research
 */
export async function searchProtocolResearch(
  protocolName: string
): Promise<TavilyResearchContext> {
  return searchScientificResearch(
    `${protocolName} scientific efficacy studies human performance`,
    5
  );
}

/**
 * Get sleep and recovery research
 */
export async function searchRecoveryResearch(): Promise<TavilyResearchContext> {
  return searchScientificResearch(
    'sleep recovery deep sleep REM HRV optimization athletes',
    5
  );
}

/**
 * Get stress management and neuroplasticity research
 */
export async function searchStressManagementResearch(): Promise<TavilyResearchContext> {
  return searchScientificResearch(
    'stress management neuroplasticity vagal tone HRV breathing',
    5
  );
}

/**
 * Summarize research findings
 */
export function summarizeResearchContext(context: TavilyResearchContext): string {
  let summary = `# Research on ${context.query}\n\n`;

  if (context.summary) {
    summary += `## Overview\n${context.summary}\n\n`;
  }

  if (context.keyFindings.length > 0) {
    summary += `## Key Findings\n`;
    context.keyFindings.forEach((finding) => {
      summary += `- ${finding}\n`;
    });
    summary += '\n';
  }

  summary += `## Sources\n`;
  context.results.forEach((result) => {
    summary += `- **${result.title}**\n  Source: ${result.source}\n  Relevance: ${Math.round(result.score * 100)}%\n`;
  });

  return summary;
}

/**
 * Validate Tavily API configuration
 */
export async function validateTavilyConfig(): Promise<boolean> {
  try {
    const apiKey = getTavilyApiKey();
    // Try a simple query to validate
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: 'HRV heart rate variability',
        max_results: 1,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
