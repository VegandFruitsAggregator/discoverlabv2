export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

  const HF_TOKEN = process.env.HF_TOKEN;

  const response = await fetch(
    'https://api-inference.huggingface.co/models/microsoft/Phi-4-mini-instruct/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HF_TOKEN}`
      },
      body: JSON.stringify({
        model: 'microsoft/Phi-4-mini-instruct',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    }
  );

  const data = await response.json();

  // Chat completions format — same as OpenAI
  const raw = data?.choices?.[0]?.message?.content || '';
  const clean = raw.replace(/```json|```/g, '').trim();

  res.status(200).json({ text: clean });
}
