# sky-horizon-weather-api 🌪️🍃
Forecast the skies with precision. A sleek, reliable API that delivers real-time weather insights straight to your apps. Lightweight in design, powerful in reach—your horizon just got clearer.

---

## Features

Real-time weather data fetched from OpenWeatherMap

Configurable units (metric or imperial)

Multi-language support for localized conditions

Simple health check endpoint for monitoring

In-memory caching to reduce redundant API calls

---

## Quickstart

### 1. Clone the repository

``bash
git clone https://github.com/yourusername/sky-horizon-weather-api.git
cd sky-horizon-weather-api
``

### 2. Install dependencies

``bash
npm install
``

### 3. Configure your environment

``bash
cp .env.example .env
``

Edit.env and add your WEATHER_API_KEY from OpenWeatherMap
.

### 4. Start the development server

``bash
npm run dev
``

The API will be available at http://localhost:3000.

----

## Endpoints

## Health Check
``
GET /health
``


## Response:
``http
{
  "status": "ok",
  "service": "sky-horizon-weather-api"
}
``

## Current Weather
``http
GET /weather?city=Jakarta&units=metric&lang=en
``

## Parameters:

> city (string, required): City name to query
> units (string, optional): metric or imperial (default: metric)
> lang (string, optional): Response language (default: en)

## Response:
``json
{
  "city": "Jakarta",
  "country": "ID",
  "temperature": "30°C",
  "condition": "broken clouds",
  "humidity": "70%",
  "wind": "3 m/s",
  "ts": "2025-09-15T00:00:00.000Z"
}
``

---

## Environment Variables

> WEATHER_API_KEY (required): Your OpenWeatherMap API key
> PORT (default: 3000): Port the server runs on
> DEFAULT_UNITS (default: metric): Default unit system

> DEFAULT_LANG (default: en): Default response language

---

## Development Notes

> Built with Node.js, Express, and Axios

> Includes caching layer to optimize API usage

> Designed for extensibility: future endpoints can support forecasts, alerts, or advanced analytics

---

## License

This project is licensed under the MIT License. See the LICENSE
 file for details.
