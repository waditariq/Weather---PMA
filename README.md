This repository contains a weather app built as part of the AI Engineer Intern technical assessment for PM Accelerator. The app retrieves real-time weather information using the Open-Meteo API and maps weather conditions to simple icons. 

Features
User Input:

You can enter a location (city, zip/postal code, GPS coordinates, landmarks, etc.) to retrieve the current weather.

There is an option to use your current location via geolocation.

Weather Information:

Displays current weather details (time, temperature, wind speed).

Provides a 5‑day forecast with minimum and maximum temperatures.

Uses emoji icons to visually represent different weather conditions (visual indicators help the user to visualize the weather).

API Integration:

Fetches current weather and forecast data from Open‑Meteo (free of charge).

Uses the Nominatim API for geocoding and reverse geocoding to convert between location names and coordinates (coord 1 and coord 2).

How It Works
User Location Input:
Users can type in a location or use the “Use My Location” button. The app uses the Nominatim API to translate the location into latitude and longitude coordinates.

Data Retrieval:
Weather data is fetched from the Open‑Meteo API based on the provided coordinates, ensuring real-time and accurate weather information.

Display:

The current weather is displayed clearly with important details.

A dynamically generated 5‑day forecast shows dates, weather icons, and temperature ranges for each day.

Extensibility:
The project is structured for easy expansion. It should be doable to integrate CRUD operations to store user inputs and weather data in a database for the next step.