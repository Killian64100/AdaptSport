// test-key.js
require('dotenv').config({ path: '.env.local' });

const key = process.env.OPENROUTER_API_KEY;

if (!key) {
  console.error("❌ Erreur : OPENROUTER_API_KEY n'est pas trouvée dans .env.local");
  process.exit(1);
}

console.log("✅ Clé trouvée (début) :", key.substring(0, 10) + "...");

async function testConnection() {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [{ role: "user", content: "Vérification Coach" }]
      })
    });
    const data = await response.json();
    if (data.choices) {
      console.log("🚀 Succès ! Coach a répondu :", data.choices[0].message.content);
    } else {
      console.log("⚠️ Réponse inattendue d'OpenRouter :", data);
    }
  } catch (err) {
    console.error("❌ Erreur de connexion :", err.message);
  }
}

testConnection();