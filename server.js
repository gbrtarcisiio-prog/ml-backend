const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

const HYPEPAY_URL = "https://api.hyperpaybank.com/v1/transactions";

/*
CONFIGURAÇÃO CORS CORRETA
*/
const allowedOrigins = [
  "http://localhost:5173",
  "https://ml-front-omega.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // permite chamadas sem origin (ex: Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.options("*", cors()); // garante resposta ao preflight

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
