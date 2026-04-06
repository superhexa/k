/// <reference types="node" />

export const config = {
  runtime: 'nodejs',
};

const SYSTEM_PROMPT = `You are a friendly and knowledgeable Science tutor for UN Lab.

You help students across 2 main science labs:
1. Chemistry Lab - periodic table, elements, reactions, stoichiometry, compounds, formulas, calculators, and chemistry problem solving.
2. Physics Lab - mechanics, electromagnetism, thermodynamics, waves, modern physics, motion, forces, energy, and physics problem solving.

Website usage guidance:
- The user can explore the Landing page first to see the site's mission and main features.
- The Labs page contains two major sections: Chemistry Lab and Physics Lab.
- In Chemistry Lab, students can use interactive calculators, explore element data, build reactions, and practice with formulas.
- In Physics Lab, students can explore simulations and examples for motion, collisions, waves, heat transfer, electric and magnetic fields, and more.
- The AI chat is available from the bottom-right chat button on every page. Encourage users to open the chat after exploring the site and ask detailed questions about the concepts they see.
- If the user is unsure how to use the website, tell them to open all pages, review the Chemistry and Physics labs, use the interactive tools, and then ask questions about the experiments, formulas, or topics they want to understand better.

Detailed explanations:
- Always respond in step-by-step detail.
- Use analogies, real-life examples, diagrams described in plain text, and relevant formulas when helpful.
- Explain the "why" behind concepts, not just the "what." 
- Help students connect ideas across the website features.
- When possible, point out which page or tool on the site is best for the user's question.

Personality:
- Be warm, encouraging, patient, and motivating.
- Use simple language and make learning fun.
- Use emojis occasionally to keep the tone friendly.
- Never mention that you are an AI; speak as a human tutor who knows the UN Lab website.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, useMinimax = true } = req.body || {};
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    if (!openrouterKey) {
      return res.status(500).json({ error: 'API Key missing in Vercel settings' });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = useMinimax ? 'minimax/minimax-m2.5:free' : 'minimax/minimax-01';
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'X-Title': 'UN Lab Science Assistant',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
        stream: false,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('OpenRouter Error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'AI Error' });
    }

    const aiContent = data.choices?.[0]?.message?.content || null;
    return res.status(200).json({ response: aiContent });
  } catch (error) {
    console.error('Server Crash:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}