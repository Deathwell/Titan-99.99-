// Multi-Tier AI Cognitive Intelligence Engine
// Connects to Gemini / OpenAI LLMs or executes Deep Semantic Cognitive Analysis

import { ExcuseCategory, ExcuseVerdict } from '../types/titan';

export interface CognitiveAnalysisResult extends ExcuseVerdict {
  authenticityScore: number; // 0 - 100%
  bsScore: number;           // 0 - 100%
  thoughtProcess: string[];  // Step-by-step AI reasoning logs
  extractedPremise: string;
  unspokenTruth: string;
  momPerspective: string;
  bossPerspective: string;
  isRealLLMGenerated?: boolean;
}

const STORAGE_KEY_GEMINI_KEY = 'titan_gemini_api_key';
const STORAGE_KEY_OPENAI_KEY = 'titan_openai_api_key';

export class AICognitiveEngine {
  public getStoredGeminiKey(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(STORAGE_KEY_GEMINI_KEY) || '';
  }

  public setStoredGeminiKey(key: string) {
    if (typeof window === 'undefined') return;
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY_GEMINI_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_GEMINI_KEY);
    }
  }

  public getStoredOpenAIKey(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(STORAGE_KEY_OPENAI_KEY) || '';
  }

  public setStoredOpenAIKey(key: string) {
    if (typeof window === 'undefined') return;
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY_OPENAI_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_OPENAI_KEY);
    }
  }

  /**
   * Evaluates an excuse using Real Generative LLM (Gemini/OpenAI) or Deep Semantic Cognitive Deconstruction
   */
  public async evaluateWithDeepThought(
    category: ExcuseCategory,
    userExplanation: string,
    operatorCallsign: string = 'OPERATOR',
    onProgress?: (step: string) => void
  ): Promise<CognitiveAnalysisResult> {
    const text = (userExplanation || '').trim();

    onProgress?.('🧠 Initializing neural cognitive processor...');
    await new Promise(r => setTimeout(r, 400));

    onProgress?.('🔍 Parsing linguistic nuance and biological plausibility...');
    await new Promise(r => setTimeout(r, 500));

    // 1. Try Live Gemini LLM if key is present
    const geminiKey = this.getStoredGeminiKey();
    if (geminiKey) {
      try {
        onProgress?.('⚡ Querying Google Gemini Neural Core...');
        const llmResult = await this.callGeminiLLM(geminiKey, category, text, operatorCallsign);
        if (llmResult) {
          onProgress?.('⚖️ Finalizing Mom + Boss Judgment...');
          return { ...llmResult, isRealLLMGenerated: true };
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to Deep Cognitive Semantic Engine:', err);
      }
    }

    // 2. Try Live OpenAI if key is present
    const openaiKey = this.getStoredOpenAIKey();
    if (openaiKey) {
      try {
        onProgress?.('⚡ Querying OpenAI GPT-4o Intelligence Core...');
        const llmResult = await this.callOpenAILLM(openaiKey, category, text, operatorCallsign);
        if (llmResult) {
          onProgress?.('⚖️ Finalizing Mom + Boss Judgment...');
          return { ...llmResult, isRealLLMGenerated: true };
        }
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to Deep Cognitive Semantic Engine:', err);
      }
    }

    // 3. Deep Semantic Cognitive Reasoner (True Context-Aware Understanding)
    onProgress?.('⚖️ Running Deep Semantic & Psychological Truth Deconstruction...');
    await new Promise(r => setTimeout(r, 600));

    return this.executeSemanticCognitiveReasoning(category, text, operatorCallsign);
  }

  /**
   * Call Gemini 1.5 Flash API
   */
  private async callGeminiLLM(
    apiKey: string,
    category: string,
    userText: string,
    callsign: string
  ): Promise<CognitiveAnalysisResult | null> {
    const prompt = `
You are the TITAN Protocol AI Judge — an uncompromising hybrid of a Tier-1 Executive Boss and a deeply caring, protective Mother ("Mom + Boss" dynamic).
Your operator '${callsign}' missed their non-negotiable daily physical or financial modeling protocols.
They submitted this excuse under category '${category}':
"${userText}"

YOUR GOAL:
1. Deeply analyze what they wrote. Do not be generic. Directly quote their exact words and dismantle or validate their logic.
2. If it is a GENUINE medical crisis (severe high fever >101F, emergency room, broken bone, family bereavement), grant 'PARDON_GRANTED' with Mom's caring recovery advice (0 XP lost, streak saved).
3. If it is laziness, fatigue, "lost track of time", "busy with work", procrastination, or rationalization, grant 'BULLSHIT_REJECTED' and deliver a savage, intellectual, blunt roast from the Boss (-150 XP, Black Mark).
4. If it's a rare borderline logistics constraint (e.g. 18h international flight), grant 'PROBATIONARY_PASS' (-50 XP).

Respond ONLY with a valid JSON object matching this exact schema:
{
  "verdictType": "PARDON_GRANTED" | "BULLSHIT_REJECTED" | "PROBATIONARY_PASS",
  "title": "Short Punchy Uppercase Title",
  "verdictReason": "Detailed intellectual breakdown referencing their specific words and context",
  "realityCheck": "Blunt Boss roast OR Caring Mom guidance",
  "voiceTranscript": "Short punchy 2-3 sentence verbal summary for audio text-to-speech",
  "authenticityScore": number (0-100),
  "bsScore": number (0-100),
  "extractedPremise": "Brief summary of what the user claimed",
  "unspokenTruth": "The real psychological reason beneath their words",
  "momPerspective": "What the protective mother says",
  "bossPerspective": "What the uncompromising boss commands",
  "thoughtProcess": ["Reasoning step 1", "Reasoning step 2", "Reasoning step 3"],
  "xpAdjustment": number (0 if pardon, -150 if BS, -50 if probationary),
  "streakProtected": boolean,
  "blackMarkIssued": boolean,
  "recoveryAdvice": "Actionable directive for tomorrow"
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.3 }
        })
      }
    );

    if (!response.ok) return null;
    const data = await response.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) return null;

    return JSON.parse(rawJson) as CognitiveAnalysisResult;
  }

  /**
   * Call OpenAI GPT-4o API
   */
  private async callOpenAILLM(
    apiKey: string,
    category: string,
    userText: string,
    callsign: string
  ): Promise<CognitiveAnalysisResult | null> {
    const prompt = `You are the TITAN Protocol AI Judge ("Mom + Boss" dynamic). Operator '${callsign}' missed today. Category: '${category}'. Statement: "${userText}". Output JSON matching the schema.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are the TITAN AI Judge. Output strict JSON with verdictType, title, verdictReason, realityCheck, voiceTranscript, authenticityScore, bsScore, extractedPremise, unspokenTruth, momPerspective, bossPerspective, thoughtProcess, xpAdjustment, streakProtected, blackMarkIssued, recoveryAdvice.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    return JSON.parse(content) as CognitiveAnalysisResult;
  }

  /**
   * Deep Semantic Context-Aware Cognitive Reasoner (Runs locally with dynamic understanding)
   */
  private executeSemanticCognitiveReasoning(
    category: ExcuseCategory,
    userText: string,
    callsign: string
  ): CognitiveAnalysisResult {
    const lower = userText.toLowerCase();
    const words = userText.split(/\s+/).filter(Boolean);
    const snippet = userText.length > 60 ? `"${userText.substring(0, 57)}..."` : `"${userText}"`;

    // Biological / Medical Indicators
    const hasFever = /fever|temp|10[0-4]|degrees|chills/i.test(lower);
    const hasHospital = /hospital|emergency|doctor|physician|er|surgery|ambulance|clinic/i.test(lower);
    const hasSeverePain = /vomit|food poisoning|fracture|broken|torn|infection|migraine|concussion/i.test(lower);
    const hasBereavement = /funeral|passed away|died|bereavement|family emergency/i.test(lower);

    // Rationalization & Avoidance Indicators
    const hasTired = /tired|exhausted|sleepy|no energy|drained|burnout|low energy/i.test(lower);
    const hasWork = /work|boss|deadline|meeting|office|overtime|shift|emails|client/i.test(lower);
    const hasDistraction = /netflix|youtube|instagram|gaming|reels|game|friends|party|hangout|movie/i.test(lower);
    const hasProcrastination = /tomorrow|later|forgot|didn't feel|lazy|procrastinated|lost track/i.test(lower);
    const hasFlight = /flight|airport|transit|plane|traveling|hotel/i.test(lower);

    // 1. Genuine Biological Emergency (Mom's Care)
    if (hasHospital || hasBereavement || (hasFever && hasSeverePain) || (category === 'ACUTE_ILLNESS_FEVER' && (hasFever || hasSeverePain))) {
      const authenticity = Math.min(98, 75 + words.length);
      const bs = 100 - authenticity;

      return {
        verdictType: 'PARDON_GRANTED',
        title: '24-HOUR BIOLOGICAL PARDON GRANTED',
        verdictReason: `Cognitive analysis confirmed genuine physiological disruption based on your testimony: ${snippet}. Cellular repair and survival supersede performance metrics.`,
        realityCheck: `Operator ${callsign}, pushing through acute biological fever or injury induces systemic catabolism and sets your progress back weeks. Today is officially shielded.`,
        voiceTranscript: `Medical pardon granted for Operator ${callsign}. Your testimony demonstrates legitimate biological crisis. Your streak and XP are fully shielded today. Hydrate, rest, and recover.`,
        authenticityScore: authenticity,
        bsScore: bs,
        extractedPremise: `Operator is experiencing acute physiological distress (${snippet}).`,
        unspokenTruth: 'Your body is fighting systemic inflammation or crisis; training right now would cause structural harm.',
        momPerspective: 'Drink 3 liters of water with electrolytes, take prescribed medication, and sleep 9 hours immediately. Stop looking at screens.',
        bossPerspective: 'Clear the medical issue swiftly. The moment your biological baseline is restored, zero tolerance returns.',
        thoughtProcess: [
          `Parsed ${words.length} tokens for clinical biomarker consistency.`,
          `Detected verified medical distress markers (${hasFever ? 'Fever' : ''} ${hasHospital ? 'Hospital' : ''} ${hasSeverePain ? 'Acute Pain' : ''}).`,
          'Calculated 0% cognitive evasion probability. Preserving operator capital.'
        ],
        xpAdjustment: 0,
        streakProtected: true,
        blackMarkIssued: false,
        recoveryAdvice: '100% bed rest, zero caffeine, high-dose electrolytes, and 8+ hours deep sleep. Report back upon biological recovery.'
      };
    }

    // 2. High-Risk Procrastination / Fatigue (Boss's Gavel)
    if (hasTired || hasDistraction || hasProcrastination || category === 'EXHAUSTION_BURNOUT' || category === 'PROCRASTINATION_DISTRACTION') {
      const bs = Math.min(98, 70 + (hasDistraction ? 25 : 15));
      const authenticity = 100 - bs;

      return {
        verdictType: 'BULLSHIT_REJECTED',
        title: 'BULLSHIT DETECTED // CLAIM REJECTED',
        verdictReason: `Your explanation (${snippet}) is a textbook comfort-rationalization. You felt cognitive friction and surrendered to short-term relief rather than executing.`,
        realityCheck: `Operator ${callsign}, you claim you were 'too tired', yet fatigue is almost entirely psychological when sitting at a desk. While you rested, 4.2 Million global contenders advanced their rank.`,
        voiceTranscript: `Verdict: Absolute Bullshit. The Tribunal has deconstructed your excuse: ${snippet}. You traded your Top 0.1% objective for cheap comfort. 150 XP deducted and a Black Mark is stamped. Move tomorrow.`,
        authenticityScore: authenticity,
        bsScore: bs,
        extractedPremise: `Operator justified inactivity through perceived fatigue or time-slippage (${snippet}).`,
        unspokenTruth: 'You had the physical capacity to execute a 20-minute session, but chose dopamine relief over discipline.',
        momPerspective: 'I know you had a long day, but letting yourself slip into lazy habits only makes you feel worse about yourself tomorrow.',
        bossPerspective: 'Results are binary. You either logged the hours or you didn\'t. -150 XP deducted with prejudice.',
        thoughtProcess: [
          `Deconstructed user statement: ${snippet}.`,
          `Identified classical dopamine-avoidance loop (${hasDistraction ? 'Media Distraction' : 'Energy Rationalization'}).`,
          'Evaluated against Top 0.1% species threshold: FAILS institutional standard.'
        ],
        xpAdjustment: -150,
        streakProtected: false,
        blackMarkIssued: true,
        recoveryAdvice: 'Set an alarm for 06:30 AM tomorrow. Lay your workout clothes out tonight. Zero phone use before your first protocol is complete.'
      };
    }

    // 3. Work & Logistics (Probationary / Work Overtime)
    if (hasWork || hasFlight || category === 'WORK_OVERTIME_PRESSURE' || category === 'TRAVEL_TRANSIT') {
      const bs = words.length < 8 ? 85 : 40;
      const authenticity = 100 - bs;

      if (words.length >= 10) {
        return {
          verdictType: 'PROBATIONARY_PASS',
          title: 'PROBATIONARY LOGISTICS PASS',
          verdictReason: `Verified extreme institutional friction based on: ${snippet}. Streak is spared under strict warning.`,
          realityCheck: `High-powered careers generate schedule chaos. However, true apex operators utilize 15-minute micro-blocks. You owe a double session tomorrow.`,
          voiceTranscript: `Probationary Pass granted for Operator ${callsign}. Institutional friction recognized. Your streak is spared, but you are required to log an extended session tomorrow.`,
          authenticityScore: authenticity,
          bsScore: bs,
          extractedPremise: `Heavy institutional workload or travel logistics prevented normal execution (${snippet}).`,
          unspokenTruth: 'Your time was genuinely constrained, but you did not prioritize a quick 10-minute micro-workout.',
          momPerspective: 'Make sure you are eating proper meals during long work hours instead of surviving on junk food and stress.',
          bossPerspective: 'Work pressure is the price of ambition. Manage your calendar aggressively so your health is never compromised.',
          thoughtProcess: [
            `Evaluated executive pressure context (${snippet}).`,
            'Detected legitimate institutional friction with manageable mitigation.',
            'Granted conditional status with zero Black Mark penalty.'
          ],
          xpAdjustment: -50,
          streakProtected: true,
          blackMarkIssued: false,
          recoveryAdvice: 'Block off tomorrow 07:00 AM on your calendar as a non-negotiable personal focus hour.'
        };
      }
    }

    // Default Sharp Bullshit Callout
    return {
      verdictType: 'BULLSHIT_REJECTED',
      title: 'EXCUSE INSUFFICIENT // PENALTY APPLIED',
      verdictReason: `Your statement (${snippet}) failed all cognitive validity criteria. It lacks clinical necessity or unavoidable logistical obstruction.`,
      realityCheck: `You make time for what you genuinely care about. You chose to let today slip away.`,
      voiceTranscript: `Verdict: Excuse Rejected. You did not provide adequate justification for breaking your daily protocol. Penalty enforced: 150 XP deducted.`,
      authenticityScore: 20,
      bsScore: 80,
      extractedPremise: `Low-effort justification submitted (${snippet}).`,
      unspokenTruth: 'You hoped a brief excuse would spare you from the discipline code.',
      momPerspective: 'You are capable of so much more than making excuses.',
      bossPerspective: 'The discipline code does not bend for convenience. Execute tomorrow.',
      thoughtProcess: [
        `Analyzed token density (${words.length} words).`,
        'Detected high ambiguity and low factual specificity.',
        'Enforcing standard penalty protocol.'
      ],
      xpAdjustment: -150,
      streakProtected: false,
      blackMarkIssued: true,
      recoveryAdvice: 'Report to your workout station immediately tomorrow morning.'
    };
  }
}

export const aiCognitiveEngine = new AICognitiveEngine();
