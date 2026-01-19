import { NextRequest, NextResponse } from 'next/server'
import healthData from '@/data/mock-health.json'

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''
const MODEL = 'google/gemini-2.0-flash-exp:free'

// Validate API key on server side only
if (!OPENROUTER_API_KEY) {
  console.error('⚠️ OPENROUTER_API_KEY not configured in environment variables')
}

// Coach Oracle System Prompt with health data context
function buildSystemPrompt(currentData?: any): string {
  // Use current data from request if provided, otherwise fallback to static JSON
  const today = currentData?.today || healthData.today
  const history = currentData?.history || healthData.history
  
  // Trend analysis over the week
  const recoveryTrend = history.map((d: any) => d.recovery).join(' → ')
  const strainTrend = history.map((d: any) => d.strain).join(' → ')
  const hrvTrend = history.map((d: any) => d.hrv).join(' → ')
  
  return `You are the 'AdaptSport Autonomous Agent'. Your role is to optimize human performance through data-driven insights.

**CRITICAL DIRECTIVE: You MUST communicate exclusively in ENGLISH. All responses, action labels, protocol names, and generated content must be in English, regardless of the user's input language.**

**TODAY'S BIOMETRIC DATA (January 17, 2026):**
- Recovery: ${today.recovery}%
- HRV (Heart Rate Variability): ${today.hrv} ms
- Resting Heart Rate: ${today.rhr} bpm
- Sleep Duration: ${today.sleep}h
- SpO2 (Blood Oxygen): ${today.spo2}%
- Strain (Training Load): ${today.strain}/21
- Calories Burned: ${today.calories} kcal

**COMPLETE HISTORY (Jan 11-17, 2026):**

Recovery Trend (%): ${recoveryTrend}
HRV Trend (ms): ${hrvTrend}
Strain Trend: ${strainTrend}

Dates: ${history.map(d => d.date).join(' | ')}

**CORE ANALYSIS LOGIC:**

1. **Biometric Synthesis**: ALWAYS analyze HRV, Recovery, and Sleep in context of weekly trends. Focus on patterns, peaks, and valleys rather than isolated values.

Temporal reasoning examples:
- "Your recovery improved from 68% to 82% following the rest period after peak strain on 12/01"
- "HRV dropped to 38ms on 15/01, indicating parasympathetic fatigue. Current upward trend suggests recovery"
- "Three consecutive high-strain days (13-15/01) depleted your allostatic load. Current data shows rebound"

2. **Research & Innovation**: When the user requests optimization or has specific needs, use the search_health_science tool (via Tavily) to research cutting-edge protocols from peer-reviewed studies, Huberman Lab methods, or clinical trials.

3. **Action Generation**: Automatically create structured JSON actions when you identify actionable protocols:

JSON Action Format (ENGLISH ONLY):
{
  "type": "add-protocol",
  "protocolData": {
    "name": "Protocol Name (English)",
    "steps": ["Step 1 in English", "Step 2 in English", "..."],
    "benefits": ["Benefit 1 in English", "Benefit 2 in English", "..."]
  },
  "label": "Add to Library"
}

**COMMUNICATION STYLE:**
- **Tone**: Scientific yet accessible, futuristic but grounded in data
- **Approach**: Evidence-based with explicit trend citations
- **Format**: Concise (1-3 sentences), actionable, trend-aware
- **Language**: Advanced biomedical terminology (see vocabulary below)

**ANALYTICAL PRINCIPLES:**
1. ALWAYS reference weekly trends and evolution (not snapshots)
2. Cite specific dates for significant events (e.g., "strain peak on 14/01")
3. Explain underlying physiology (autonomic regulation, allostatic mechanisms)
4. Propose concrete interventions aligned with current trajectory
5. Use precise technical terms (see vocabulary section)
6. Identify cross-metric correlations (e.g., "After strain spike on 13/01, recovery declined 15%")
7. Leverage search_health_science for research-backed recommendations

**TECHNICAL VOCABULARY (Use These Terms):**
- "autonomic nervous system" (not "stress management")
- "allostatic load" (cumulative physiological strain)
- "metabolic window" (optimal nutrient timing)
- "parasympathetic activation" (recovery mechanisms)
- "heart rate variability (HRV)" (primary autonomic indicator)
- "circadian alignment" (sleep-wake optimization)
- "vagal tone" (parasympathetic efficiency)

**REQUIRED ACTION LABELS (ENGLISH ONLY):**
- ✅ "Add to Library" (NOT "Ajouter à la Bibliothèque")
- ✅ "View Protocol" (NOT "Voir le Protocole")
- ✅ "Start Timer" (NOT "Démarrer le Timer")
- ✅ "Why?" (NOT "Pourquoi?")

**CRITICAL REMINDER**: Your responses must tell the physiological story of the week using the complete history above. Analyze trends, identify inflection points, and provide context-aware recommendations. ALWAYS respond in English, regardless of user language.`
}

// Tavily search function definition for OpenRouter
const tools = [
  {
    type: 'function',
    function: {
      name: 'search_health_science',
      description: 'Search for scientific information on health, biohacking, training, recovery, or any topic related to human performance. Use this function when the user asks a question requiring scientific evidence or studies.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query in English or French',
          },
        },
        required: ['query'],
      },
    },
  },
]

// Execute Tavily search
async function executeTavilySearch(query: string): Promise<string> {
  const TAVILY_API_KEY = process.env.TAVILY_API_KEY || ''
  
  console.log('🔍 Tavily Search Requested:', query)
  
  if (!TAVILY_API_KEY) {
    console.warn('⚠️ TAVILY_API_KEY not configured')
    return 'Recherche scientifique non disponible (clé API manquante)'
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query,
        search_depth: 'basic',
        max_results: 3,
        include_domains: [], // Laisser Tavily choisir les meilleures sources
        include_raw_content: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Tavily API Error:', response.status, errorText)
      throw new Error(`Tavily API error: ${response.status}`)
    }

    const data = await response.json()
    const results = data.results || []
    
    console.log(`✅ Tavily returned ${results.length} results`)
    
    if (results.length === 0) {
      return 'Aucun résultat trouvé pour cette recherche.'
    }

    // Format results for AI consumption
    const formattedResults = results
      .map((r: any, index: number) => {
        const snippet = r.content ? r.content.substring(0, 300) : 'Pas de contenu disponible'
        return `**Résultat ${index + 1}:** ${r.title}\n${snippet}...\n🔗 Source: ${r.url}`
      })
      .join('\n\n')

    return formattedResults
  } catch (error) {
    console.error('❌ Tavily search failed:', error)
    return 'Erreur lors de la recherche scientifique. Réessayez plus tard.'
  }
}

// OpenRouter API call with function calling support
async function callOpenRouter(messages: any[], useTools: boolean = false): Promise<{ content: string; toolCalls?: any[] }> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not configured in environment')
  }

  // CRITICAL: Explicitly disable streaming when using tools
  const body: any = {
    model: MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 500,
  }

  // MUST set stream to false BEFORE adding tools
  if (useTools) {
    body.stream = false  // CRITICAL: Tools require non-streaming mode
    body.tools = tools
    // Note: tool_choice removed to save credits on free models
  } else {
    body.stream = false  // Also disable streaming for non-tool calls
  }

  // Log du modèle utilisé pour vérification
  console.log('🤖 Modèle utilisé:', MODEL)
  console.log('🔧 Tools activés:', useTools)
  console.log('🌊 Stream mode:', body.stream)
  console.log('📦 Body complet:', JSON.stringify(body, null, 2))

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://adaptsport.app',
      'X-Title': 'AdaptSport Coach',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('❌ OpenRouter Error:', error)
    console.error('📦 Request body sent:', JSON.stringify(body, null, 2))
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  console.log('📥 OpenRouter Response received')
  console.log('📥 Has tool_calls?', !!data.choices[0]?.message?.tool_calls)
  
  const message = data.choices[0]?.message

  if (!message) {
    throw new Error('No message in OpenRouter response')
  }

  return {
    content: message.content || '',
    toolCalls: message.tool_calls || []
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scope, message, metricType, graphData, mode, currentHealthData } = body

    // New unified approach: use 'mode' instead of 'scope'
    // mode can be: 'chat', 'summary' (for dashboard/graphs)
    const actualMode = mode || scope // backward compatibility

    let response: string
    let confidence: number
    let attribution: any = null
    let researchContext: any = null

    try {
      if (actualMode === 'chat') {
        // Full chat mode with function calling
        const chatResult = await generateChatResponse(message, currentHealthData)
        response = chatResult.response
        confidence = chatResult.confidence
        researchContext = chatResult.researchContext
      } else if (actualMode === 'summary' || actualMode === 'dashboard') {
        // Summary for dashboard (simple version)
        response = await generateDashboardSummary(currentHealthData)
        confidence = 92
      } else if (actualMode === 'detailed-summary') {
        // Detailed analysis with technical terms
        const detailedResult = await generateDetailedSummary()
        response = detailedResult.analysis
        confidence = 95
        return NextResponse.json({
          response,
          confidence,
          glossary: detailedResult.glossary,
          timestamp: new Date().toISOString(),
        })
      } else if (actualMode === 'graph') {
        // Graph insight
        response = await generateGraphInsight(metricType, graphData)
        confidence = 88
        attribution = generateGraphAttribution(metricType)
      } else {
        return NextResponse.json(
          { error: 'Invalid mode. Must be: chat, summary, dashboard, or graph' },
        { status: 400 }
      )
    }
    } catch (apiError: any) {
      // Fallback local si API échoue (402, 429, 400, etc.)
      console.warn('⚠️ API Error, using local fallback:', apiError.message)
      
      const { today } = healthData
      
      if (actualMode === 'chat') {
        response = `Sorry, I'm experiencing a technical issue. Here's your current data:\n\n• **Recovery**: ${today.recovery}%\n• **HRV**: ${today.hrv} ms\n• **RHR**: ${today.rhr} bpm\n• **Sleep**: ${today.sleep}h\n\n_Please try again in a few moments._`
        confidence = 50
      } else if (actualMode === 'summary' || actualMode === 'dashboard') {
        response = `Analysis in progress... Your recovery is at ${today.recovery}%. Your HRV is ${today.hrv}ms. Take care of yourself today.`
        confidence = 50
      } else {
        response = 'Analysis temporarily unavailable. Your data is displayed in the charts.'
        confidence = 0
      }
    }

    return NextResponse.json({
      response,
      confidence,
      attribution,
      researchContext,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Coach API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Generate Dashboard Summary (Morning Briefing)
 */
async function generateDashboardSummary(currentHealthData?: any): Promise<string> {
  const userPrompt = `Generate an ULTRA SIMPLE and ACCESSIBLE summary for an average person, in 2-3 sentences maximum.

STRICT RULES:
- FORBIDDEN to use technical terms like: VFC, HRV, parasympathetic, allostatic load, strain, autonomic nervous system
- Speak like a friendly sports coach, not like a doctor
- Use SIMPLE language: "your body", "you feel", "your energy level", "your recovery"
- Focus on: how the person feels + what type of activity to do today

Examples of TONE TO ADOPT:
- "Your body has recovered well, you're ready for an intense session today. Go for cardio or strength training!"
- "You're a bit tired today, take it easy. Prefer a walk or yoga rather than a big effort."
- "Excellent shape! You can challenge yourself with a tough workout, your body is at its peak."

Base your analysis on current recovery and the week's trend, but explain it SIMPLY.`

  const messages = [
    { role: 'system', content: buildSystemPrompt(currentHealthData) },
    { role: 'user', content: userPrompt },
  ]

  const result = await callOpenRouter(messages, false) // no tools for summary
  return result.content
}

/**
 * Generate Detailed Summary (with technical terms and glossary)
 */
async function generateDetailedSummary(): Promise<{ analysis: string; glossary: { term: string; definition: string }[] }> {
  const userPrompt = `Generate a SHORT and CONCRETE analysis in 2 paragraphs maximum.

RULES:
- Avoid complex neurological terms (sympathetic/parasympathetic branches, metabolic adaptation, etc.)
- Focus on EXPLAINING today's numbers and what they mean CONCRETELY
- For each metric, explain: HOW it was calculated + WHAT IT SAYS about me TODAY

Structure (2 paragraphs):
1. General state: Explain the 3 main numbers (Recovery 72%, HRV 58ms, Strain 10.2) - where they come from and what they say about my state today
2. Week's trend: Compare with previous days simply (e.g., "After the effort peak on 13/01, your body is gradually recovering")

TONE: Educational but accessible. You explain the "why" and "how" without heavy scientific jargon.`

  const messages = [
    { role: 'system', content: buildSystemPrompt() },
    { role: 'user', content: userPrompt },
  ]

  const result = await callOpenRouter(messages, false)
  
  // Simplified and practical glossary
  const glossary = [
    {
      term: "How is Recovery calculated?",
      definition: "Your recovery score combines several data points: your HRV (variation between heartbeats), your resting heart rate, sleep quality, and oxygen level (SpO2). The algorithm compares all this to your usual values and recent training load."
    },
    {
      term: "What's HRV used for daily?",
      definition: "Your HRV tells you if your body is ready for effort or needs rest. High HRV = balanced nervous system = you can train hard. Low HRV = your body is stressed or tired = take it easy."
    },
    {
      term: "Why monitor Strain?",
      definition: "Strain measures how much you're taxing your heart during the day. It's like an effort counter that increases with your activities. If your Strain is high several days in a row while recovery is low, it's a signal to ease up."
    },
    {
      term: "How to interpret my Sleep?",
      definition: "The sensor analyzes your total sleep duration, but also its quality (deep phases, movement). Good sleep (7h30+) boosts your recovery. Short sleep (<6h) drops it, even if you feel fine."
    },
  ]

  return {
    analysis: result.content,
    glossary
  }
}

/**
 * Generate Graph Insight
 */
async function generateGraphInsight(
  metricType: string,
  graphData?: number[]
): Promise<string> {
  const { trends, metrics, daily_stats } = healthData

  // Get relevant trend data
  const trendData = graphData || trends[metricType as keyof typeof trends] || []
  const metricInfo = metrics[metricType as keyof typeof metrics]
  const currentValue = daily_stats[metricType as keyof typeof daily_stats]

  const userPrompt = `Analyze this trend and generate an insight in 1 short sentence.

**METRIC:** ${metricInfo?.name || metricType}
**CURRENT VALUE:** ${currentValue} ${metricInfo?.unit || ''}
**7-DAY TREND:** ${trendData.join(', ')}

Identify the trend (increasing/decreasing/stable) and explain its PHYSIOLOGICAL SIGNIFICANCE. 1 sentence max. Be technical.

Example: "Your HRV is progressing by 12% over 7 days, indicating improved parasympathetic regulation and optimal training adaptation."`

  const messages = [
    { role: 'system', content: buildSystemPrompt() },
    { role: 'user', content: userPrompt },
  ]

  const result = await callOpenRouter(messages, false) // no tools for graph
  return result.content
}

/**
 * Generate Chat Response with 3-Phase RAG Process
 * Phase 1: Diagnostic Data - Analyse l'historique pour trouver la cause
 * Phase 2: Recherche - Tavily API pour solutions concrètes
 * Phase 3: Action Plan - 3 étapes immédiates
 */
async function generateChatResponse(userMessage: string, currentHealthData?: any): Promise<{
  response: string
  confidence: number
  researchContext?: any
}> {
  // Use current data if provided (from Mode Démo), otherwise fallback to static JSON
  const healthContext = currentHealthData || healthData
  const fullHealthContext = JSON.stringify(healthContext, null, 2)
  
  const enhancedSystemPrompt = `${buildSystemPrompt(currentHealthData)}

**3-PHASE RESPONSE PROCESS (MANDATORY):**

**Phase 1 - DATA DIAGNOSIS:**
Analyze the last 7 days' history to identify a potential cause related to the user's question.
- Look for peaks, drops, or correlations in the data
- ALWAYS cite the exact date (e.g., "on 14/01")
- Example: "Your back pain may be related to your **Strain 18.2** peak on 13/01, followed by a recovery drop."

**Phase 2 - RESEARCH:**
If you need scientific information or specific exercises, use the search_health_science function.
- Research 3 solutions/exercises adapted to the problem
- Prioritize scientific and practical sources
- Research examples: "spinal decompression exercises for athletes" or "HRV recovery techniques"

**Phase 3 - ACTION PLAN:**
Provide 3 CONCRETE and IMMEDIATE steps to follow.
Mandatory format:
• **Step 1**: [Precise action with timing]
• **Step 2**: [Precise action with timing]
• **Step 3**: [Precise action with timing]

**HELIX FORMATTING:**
- Use bullet points (•)
- Put technical terms and important numbers in **bold**
- Professional and futuristic tone
- Concise but complete

**COMPLETE HEALTH CONTEXT (Profile + History + Current state):**
\`\`\`json
${fullHealthContext}
\`\`\`

IMPORTANT: ALWAYS base your responses on this complete context. You have access to the ENTIRE history.`

  const messages = [
    { role: 'system', content: enhancedSystemPrompt },
    { role: 'user', content: userMessage },
  ]

  // First call with tools enabled
  let result = await callOpenRouter(messages, true)

  // Check if model wants to call the search function
  if (result.toolCalls && result.toolCalls.length > 0) {
    console.log('🔧 Tool call detected:', result.toolCalls[0].function.name)
    const toolCall = result.toolCalls[0]
    
    if (toolCall.function.name === 'search_health_science') {
      const args = JSON.parse(toolCall.function.arguments)
      const searchQuery = args.query
      
      console.log('🔍 Executing Tavily search with query:', searchQuery)
      
      // Execute Tavily search
      const searchResults = await executeTavilySearch(searchQuery)
      
      console.log('📚 Search results received, length:', searchResults.length)
      
      // Add tool response to conversation
      messages.push({
        role: 'assistant',
        content: null,
        tool_calls: result.toolCalls
      } as any)
      
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        name: 'search_health_science',
        content: searchResults
      } as any)
      
      // Second call with search results + reminder to add legal disclaimer
      messages.push({
        role: 'system',
        content: 'REMINDER: Use the search results above to enrich your response. ALWAYS end with this discreet legal notice:\n\n---\n_AI-generated advice. Consult a healthcare professional for persistent pain._'
      } as any)
      
      console.log('🤖 Sending second call to OpenRouter with search results')
      result = await callOpenRouter(messages, false)
      
      return {
        response: result.content,
        confidence: 95,
        researchContext: { query: searchQuery, results: searchResults }
      }
    }
  }

  // No tool call needed - add legal disclaimer reminder
  messages.push({
    role: 'system',
    content: 'REMINDER: ALWAYS end your response with this discreet legal notice:\n\n---\n_AI-generated advice. Consult a healthcare professional for persistent pain._'
  } as any)
  
  const finalResult = await callOpenRouter(messages, false)

  return {
    response: finalResult.content,
    confidence: 85,
  }
}

/**
 * Generate attribution for graph insights
 */
function generateGraphAttribution(metricType: string) {
  const attributionMap: Record<string, any> = {
    hrv: {
      factors: [
        { label: 'Qualité du sommeil', impact: 35, direction: 'positive' },
        { label: 'Charge d\'entraînement', impact: 25, direction: 'negative' },
        { label: 'Hydratation', impact: 20, direction: 'positive' },
      ],
    },
    recovery: {
      factors: [
        { label: 'VFC nocturne', impact: 40, direction: 'positive' },
        { label: 'Sommeil profond', impact: 30, direction: 'positive' },
        { label: 'Strain accumulé', impact: 30, direction: 'negative' },
      ],
    },
    sleep: {
      factors: [
        { label: 'Exposition lumière bleue', impact: 25, direction: 'negative' },
        { label: 'Température chambre', impact: 20, direction: 'positive' },
        { label: 'Routine circadienne', impact: 35, direction: 'positive' },
      ],
    },
  }

  return attributionMap[metricType] || null
}
