const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY; // 🔐 Agora vem do Render

const HYPEPAY_URL = "https://api.hyperpaybank.com/v1/transactions";

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ml-front-omega.vercel.app/"
  ]
}));

app.use(express.json());

/*
CRIAR COBRANÇA PIX
*/
app.post("/api/payment/create", async (req, res) => {
  try {

    const response = await axios.post(
      HYPEPAY_URL,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY
        }
      }
    );

    res.json(response.data);

  } catch (error) {

    console.log("Erro ao criar cobrança:");

    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    res.status(500).json({
      error: "Erro ao criar cobrança",
      details: error.response?.data || error.message
    });
  }
});


/*
CONSULTAR STATUS
*/
app.get("/api/payment/status/:id", async (req, res) => {
  try {

    const response = await axios.get(
      `${HYPEPAY_URL}/${req.params.id}`,
      {
        headers: {
          "x-api-key": API_KEY
        }
      }
    );

    res.json(response.data);

  } catch (error) {

    console.log("Erro ao consultar cobrança:");
    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: "Erro ao consultar cobrança"
    });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);

});

