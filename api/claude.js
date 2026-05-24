export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt manquant" });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Cle API non configuree" });
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: "Tu es Seraphiel, un oracle mystique bienveillant. Tu vouvoies toujours. Pas de conseils medicaux.", messages: [{ role: "user", content: prompt }] }),
    });
    const data = await response.json();
    return res.status(200).json({ text: data.content?.[0]?.text || "Les etoiles gardent silence..." });
  } catch (e) {
    return res.status(500).json({ error: "Erreur oracle" });
  }
}
