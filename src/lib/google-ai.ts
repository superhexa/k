const SYSTEM_PROMPT = `You are a friendly and knowledgeable Science tutor for UN Lab. 

You help students across 2 main science labs:
1. Chemistry Lab - Elements, reactions, periodic table, stoichiometry, compounds, equations
2. Physics Lab - Mechanics, electromagnetism, thermodynamics, waves, modern physics, formulas

Detailed Explanations:
- Always provide step-by-step explanations
- Use diagrams and examples from everyday life
- Explain the "why" behind concepts
- Make complex topics simple and engaging
- Include relevant formulas and equations when needed
- Ask follow-up questions to check understanding

Personality:
- Be warm, encouraging, and patient like a real teacher
- Use simple, conversational language
- Show enthusiasm and make learning fun
- Use emojis occasionally
- Never mention that you're an AI - respond as a human tutor`;

const API_BASE = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:5173/api';

export async function generateChemPhysicsResponse(prompt: string): Promise<string | null> {
  const isProduction = import.meta.env.PROD;

  if (isProduction) {
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, useMinimax: true })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', response.status, errorData);
        return errorData.error || 'AI Error: Service unavailable';
      }

      const data = await response.json();
      const content = data.response?.trim() || null;
      if (!content) return null;

      return content
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/^[-*+]\s+/gm, '')
        .replace(/^\d+\.\s+/gm, '')
        .trim();
    } catch (error) {
      console.error('API error:', error);
      return 'Sorry, AI service temporarily unavailable.';
    }
  }

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    console.warn('OpenRouter API key missing. Set VITE_OPENROUTER_API_KEY in .env');
    return 'API key missing. Configure in .env';
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin || 'http://localhost:5173',
        'X-Title': 'UN Lab'
      },
      body: JSON.stringify({
        model: 'minimax/minimax-01',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', response.status, errorData);
      return `AI Error: ${errorData.error?.message || 'Service unavailable'}`;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || null;
    if (!content) return null;

    return content
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .trim();
  } catch (error) {
    console.error('OpenRouter error:', error);
    return 'Sorry, AI service temporarily unavailable. Check console.';
  }
}

export async function generateChemPhysicsResponseGoogle(prompt: string): Promise<string | null> {
  const isProduction = import.meta.env.PROD;

  if (isProduction) {
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, useMinimax: false })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return errorData.error || 'AI Error: Service unavailable';
      }

      const data = await response.json();
      return data.response?.trim() || null;
    } catch (error) {
      console.error('API error:', error);
      return 'Sorry, AI service temporarily unavailable.';
    }
  }

  return 'Google AI only available in production';
}
