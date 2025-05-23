const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const { acao, valor } = req.body;

  if (!acao || !valor) {
    return res.status(400).json({ error: "Campos 'acao' e 'valor' são obrigatórios." });
  }

  // Monta o payload para o Power Automate
  const payload = {
    acao: acao,
    valor: valor
  };

  const powerAutomateUrl = "https://prod-17.westus.logic.azure.com:443/workflows/4d222071a2c244919cb3687b9e44f1b3/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=kew98TlbFKqMteEso9TFy4M6g3cOz-qQKOL5r9IH7NY";

  try {
    const response = await axios.post(powerAutomateUrl, payload, {
      headers: { "Content-Type": "application/json" }
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao consultar Power Automate",
      detalhes: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor iniciado na porta", PORT));
