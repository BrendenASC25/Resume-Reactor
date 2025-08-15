const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const SAMBANOVA_API_KEY = process.env.SAMBANOVA_API_KEY || 'YOUR_KEY_HERE';
app.get('/', (req, res) => {
  res.send('Resume Reactor API is running.');
});
app.post('/generate', async (req, res) => {
  const { jobDescription } = req.body;
  if (!jobDescription || !jobDescription.trim()) {
    return res.status(400).json({ error: 'jobDescription is required.' });
  }
  try {
    const response = await fetch('https://api.sambanova.systems/demo-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SAMBANOVA_API_KEY}`
      },
      body: JSON.stringify({ prompt: jobDescription })
    });
    if (!response.ok) throw new Error(`SambaNova API error: ${response.statusText}`);
    const data = await response.json();
    res.json({ result: data.output || data.completion || 'No result returned' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
