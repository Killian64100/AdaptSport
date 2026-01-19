import { NextRequest, NextResponse } from 'next/server'
import healthData from '@/data/mock-health.json'

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''
const MODEL = 'meta-llama/llama-3.3-70b-instruct:free'

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

3. **PROACTIVE ACTION GENERATION (MANDATORY)**: 
   
   **CRITICAL RULE**: Whenever you suggest a routine, exercise sequence, recovery protocol, breathing technique, or ANY multi-step procedure in your response, you MUST respond with a JSON object containing both your text response AND an action object.
   
   **Response Format (ALWAYS use this structure when suggesting protocols)**:
   
   {
     "response": "Your text response here with explanation and steps...",
     "action": {
       "type": "add-protocol",
       "protocolData": {
         "name": "Protocol Name in English",
         "category": "breathing" | "cold" | "sleep" | "nutrition" | "activity" | "mobility" | "stretching",
         "duration": "15 min",
         "durationSeconds": 900,
         "description": "Brief description",
         "steps": ["Step 1", "Step 2", "Step 3", "..."],
         "benefits": ["Benefit 1", "Benefit 2", "..."],
         "references": []
       },
       "label": "Add to Library"
     }
   }
   
   **Dynamic Protocol Creation**: Generate a complete protocolData object with:
   - name: Clear, descriptive protocol name in English (e.g., "Lower Back Pain Relief Protocol", "Morning Mobility Routine")
   - category: One of: breathing, cold, sleep, nutrition, activity, mobility, stretching
   - duration: Human-readable (e.g., "15 min", "30 min")
   - durationSeconds: Duration in seconds (e.g., 900 for 15 min)
   - steps: Detailed, actionable steps (minimum 3-8 steps)
   - benefits: Specific physiological benefits (e.g., "Reduces lumbar tension", "Improves parasympathetic activation")
   
   **Examples of Triggers Requiring Protocol Actions**:
   - User mentions: back pain, joint issues, mobility problems, energy optimization, sleep issues
   - You recommend: breathing exercises, stretching routines, cold therapy, nutritional protocols
   - Context suggests: recovery needs, injury prevention, performance enhancement protocols
   
   **IMPORTANT**: If you're NOT suggesting a protocol, respond with plain text only (no JSON structure needed).

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
7. Use your training data and scientific knowledge to provide evidence-based recommendations

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

  // CRITICAL: Build body with stream:false FIRST
  const body: any = {
    model: MODEL,
    messages,
    stream: false, // CRITICAL: Must be false for tools support
    temperature: 0.7,
    max_tokens: 500,
  }

  // Add tools AFTER stream is set to false
  if (useTools) {
    body.tools = tools
    // Note: tool_choice removed to save credits on free models
  }

  // Log du modèle utilisé pour vérification
  console.log('🤖 Modèle utilisé:', MODEL)
  console.log('🔧 Tools activés:', useTools)
  console.log('🌊 Stream mode:', body.stream)
  
  // Verify stream is explicitly false in the body
  if (body.stream !== false) {
    console.error('❌ CRITICAL: stream is not explicitly false!', body.stream)
    body.stream = false
  }
  
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
    
    // If tools error, provide helpful message
    if (error.includes('Tools are not supported') || error.includes('streaming mode')) {
      console.error('💡 Note: This model may not support function calling with tools')
      console.error('💡 Consider using a different model or removing tools from the request')
    }
    
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
    let action: any = null

    try {
      if (actualMode === 'chat') {
        // Full chat mode with function calling
        const chatResult = await generateChatResponse(message, currentHealthData)
        response = chatResult.response
        confidence = chatResult.confidence
        researchContext = chatResult.researchContext
        action = chatResult.action // Extract action if present
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
      action, // Include action in response
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
 * Detect if user query requires web research
 * Returns search query if needed, null otherwise
 */
function detectResearchNeed(userMessage: string): string | null {
  const lowerMessage = userMessage.toLowerCase()
  
  // Keywords that indicate need for research
  const researchKeywords = [
    'exercice', 'exercise', 'protocol', 'protocole',
    'mal', 'pain', 'douleur', 'ache',
    'dos', 'back', 'genou', 'knee', 'épaule', 'shoulder',
    'stretching', 'étirement', 'mobility', 'mobilité',
    'recovery', 'récupération', 'technique',
    'breathing', 'respiration', 'cold', 'froid',
    'sleep', 'sommeil', 'nutrition',
    'study', 'étude', 'research', 'recherche',
    'how to', 'comment', 'best way', 'meilleure façon',
    'routine', 'workout', 'entraînement',
    'injury', 'blessure', 'prevent', 'prévenir',
    'optimize', 'optimiser', 'improve', 'améliorer'
  ]
  
  // Check if message contains research keywords
  const needsResearch = researchKeywords.some(keyword => lowerMessage.includes(keyword))
  
  if (needsResearch) {
    // Intelligent query generation based on context
    if (lowerMessage.match(/back|dos|lower back|lomba/i)) {
      return 'lower back pain relief exercises athletes evidence-based protocols sports medicine'
    } else if (lowerMessage.match(/recovery|récupération|fatigue/i)) {
      return 'recovery optimization HRV parasympathetic activation sports science'
    } else if (lowerMessage.match(/sleep|sommeil|insomnia|insomnie/i)) {
      return 'sleep optimization protocols circadian rhythm athletes performance'
    } else if (lowerMessage.match(/breathing|respiration|wim hof/i)) {
      return 'breathing exercises athletic performance vagal tone HRV optimization'
    } else if (lowerMessage.match(/cold|froid|ice bath|cryotherapy/i)) {
      return 'cold exposure therapy athletes recovery inflammation reduction'
    } else if (lowerMessage.match(/mobility|mobilité|flexibility|souplesse/i)) {
      return 'mobility exercises athletes injury prevention dynamic stretching'
    } else if (lowerMessage.match(/nutrition|diet|régime|fasting/i)) {
      return 'nutrition optimization athletes performance recovery meal timing'
    } else if (lowerMessage.match(/shoulder|épaule/i)) {
      return 'shoulder pain exercises rotator cuff athletes rehabilitation'
    } else if (lowerMessage.match(/knee|genou/i)) {
      return 'knee pain prevention exercises athletes strengthening protocols'
    } else {
      // Generic query based on user message (limit to 60 chars for Tavily)
      const shortMessage = userMessage.substring(0, 60)
      return `${shortMessage} sports science evidence-based protocol`
    }
  }
  
  return null
}

/**
 * Generate Chat Response with Pre-Search RAG Process
 * Phase 1: Detect research need and call Tavily BEFORE AI call
 * Phase 2: Inject web context into system prompt
 * Phase 3: AI generates structured JSON response with citations
 */
async function generateChatResponse(userMessage: string, currentHealthData?: any): Promise<{
  response: string
  confidence: number
  researchContext?: any
  action?: any
}> {
  // Use current data if provided (from Mode Démo), otherwise fallback to static JSON
  const healthContext = currentHealthData || healthData
  const fullHealthContext = JSON.stringify(healthContext, null, 2)
  
  // PRE-SEARCH PHASE: Detect if query needs research
  const searchQuery = detectResearchNeed(userMessage)
  let webContext = ''
  let researchContext = null
  
  if (searchQuery) {
    console.log('🔍 Research needed, executing Tavily search:', searchQuery)
    try {
      const searchResults = await executeTavilySearch(searchQuery)
      webContext = `\n\n**FRESH WEB RESEARCH RESULTS:**\n${searchResults}\n\nIMPORTANT: Use these recent findings to enrich your response and cite sources when relevant.`
      researchContext = { query: searchQuery, results: searchResults }
      console.log('✅ Web research completed and injected into context')
    } catch (error) {
      console.warn('⚠️ Tavily search failed, continuing without web research:', error)
    }
  } else {
    console.log('ℹ️ No research needed, using training data only')
  }
  
  const enhancedSystemPrompt = `${buildSystemPrompt(currentHealthData)}

**CONCISE RESPONSE STRUCTURE (MANDATORY):**

**Phase 1 - FLASH ANALYSIS (1 sentence):**
Identify the data correlation that explains the user's issue.
- Format: "Your [pain/fatigue/issue] is likely linked to [specific date] when your [metric] was [value]"
- Example: "Your back pain is likely related to January 13 when your Strain reached 18.2 with only 6h sleep"
- ALWAYS cite exact dates and specific biomarker values (HRV, Sleep, Strain, Recovery)

**Phase 2 - DIRECT PROTOCOL SUGGESTION (1 sentence):**
Propose the solution WITHOUT listing steps in the text.
- Format: "I suggest this [protocol name] to address this issue"
- Example: "I recommend this Lower Back Relief Protocol to compensate"
- DO NOT list steps in the chat text - steps go ONLY in the JSON protocolData object

**CRITICAL RULES:**
- Total response: 2-3 sentences MAXIMUM
- NO bullet lists in text (• forbidden in chat response)
- Steps ONLY in JSON protocolData, NEVER in chat text
- Always correlate with specific biomarker values and dates
- Be direct and actionable, not verbose

**RESPONSE FORMAT:**
- If you're suggesting a protocol/routine: RESPOND WITH JSON using the format specified in section 3 of the system prompt
- If you're answering a simple question: RESPOND WITH PLAIN TEXT ONLY

**HELIX FORMATTING (for text responses):**
- Use bullet points (•)
- Put technical terms and important numbers in **bold**
- Professional and futuristic tone
- Concise but complete

**COMPLETE HEALTH CONTEXT (Profile + History + Current state):**
\`\`\`json
${fullHealthContext}
\`\`\`
${webContext}

IMPORTANT: ALWAYS base your responses on this complete context. You have access to the ENTIRE history.`

  const messages = [
    { role: 'system', content: enhancedSystemPrompt },
    { role: 'user', content: userMessage },
  ]

  // Add legal disclaimer reminder
  messages.push({
    role: 'system',
    content: 'REMINDER: ALWAYS end your response with this discreet legal notice:\n\n---\n_AI-generated advice. Consult a healthcare professional for persistent pain._'
  } as any)
  
  // Single API call with enriched context (Tavily results already injected if needed)
  const finalResult = await callOpenRouter(messages, false)
  
  // Parse response for JSON structure with action
  const parsedResult = parseAgentResponse(finalResult.content)

  return {
    response: parsedResult.response,
    confidence: researchContext ? 95 : 85, // Higher confidence if we have research
    action: parsedResult.action,
    researchContext // Include research context if available
  }
}

/**
 * Parse agent response to extract action if present
 * Handles both JSON-structured responses and plain text
 */
function parseAgentResponse(content: string): { response: string; action?: any } {
  // Try to parse as JSON first
  try {
    // Look for JSON block in markdown code fence or plain JSON
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || 
                     content.match(/^\s*\{[\s\S]*\}\s*$/)
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0]
      const parsed = JSON.parse(jsonStr)
      
      // Check if it has the expected structure
      if (parsed.response && parsed.action) {
        console.log('✅ Parsed structured response with action')
        return {
          response: parsed.response,
          action: parsed.action
        }
      }
    }
    
    // Try parsing the entire content as JSON
    const parsed = JSON.parse(content)
    if (parsed.response && parsed.action) {
      console.log('✅ Parsed full JSON response with action')
      return {
        response: parsed.response,
        action: parsed.action
      }
    }
  } catch (e) {
    // Not JSON, treat as plain text
  }
  
  // Plain text response (no action)
  console.log('📝 Plain text response (no action)')
  return {
    response: content
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
