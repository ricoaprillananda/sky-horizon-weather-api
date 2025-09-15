import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import axios from "axios";
import dotenv from "dotenv";
import { getCache, setCache } from "./lib/cache.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;
const DEFAULT_UNITS = process.env.DEFAULT_UNITS || "metric"; // metric/imperial
const DEFAULT_LANG = process.env.DEFAULT_LANG || "en";

if (!API_KEY) {
  console.warn("⚠️  WEATHER_API_KEY is not set. Set it in your .env file.");
}

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "sky-horizon-weather-api" });
});

/**
 * GET /weather?city=Jakarta&units=metric&lang=id
 * Returns: { city, temperature, condition, humidity, wind, country }
 */
app.get("/weather", async (req, res) => {
  try {
    const city = (req.query.city || "").toString().trim();
    const units = (req.query.units || DEFAULT_UNITS).toString();
    const lang = (req.query.lang || DEFAULT_LANG).toString();

    if (!city) {
      return res.status(400).json({ error: "Query param 'city' is required" });
    }
    if (!API_KEY) {
      return res.status(500).json({ error: "Server missing WEATHER_API_KEY" });
    }

    // cache key
    const key = `wx:${city.toLowerCase()}:${units}:${lang}`;
    const cached = getCache(key);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const url = "https://api.openweathermap.org/data/2.5/weather";
    const { data } = await axios.get(url, {
      params: {
        q: city,
        appid: API_KEY,
        units,
        lang
      },
      timeout: 8000
    });

    const out = {
      city: data.name,
      country: data.sys?.country,
      temperature:
        units === "imperial" ? `${data.main.temp}°F` : `${data.main.temp}°C`,
      condition: data.weather?.[0]?.description,
      humidity: `${data.main.humidity}%`,
      wind:
        units === "imperial"
          ? `${data.wind.speed} mph`
          : `${data.wind.speed} m/s`,
      ts: new Date().toISOString()
    };

    // cache 5 minutes
    setCache(key, out, 5 * 60 * 1000);

    res.json(out);
  } catch (err) {
    const status = err.response?.status || 500;
    const msg =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch weather data";
    res.status(status).json({ error: msg });
  }
});

app.listen(PORT, () => {
  console.log(`🌤️  Sky Horizon Weather API running on http://localhost:${PORT}`);
});
