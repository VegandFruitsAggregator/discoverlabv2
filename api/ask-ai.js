export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

  const HF_TOKEN = process.env.HF_TOKEN;

  const response = await fetch(
    'https://router.huggingface.co/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HF_TOKEN}`
      },
      body: JSON.stringify({
        model: 'microsoft/Phi-4-mini-instruct',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      })
    }
  );

  const data = await response.json();

  // Catch API-level errors and return them cleanly
  if (!response.ok) {
    return res.status(500).json({ text: 'AI error: ' + (data?.error?.message || response.statusText) });
  }

  const raw = data?.choices?.[0]?.message?.content || '';
  const clean = raw.replace(/```json|```/g, '').trim();

  res.status(200).json({ text: clean });
}
