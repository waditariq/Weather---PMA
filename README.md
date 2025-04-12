# Weather App - AI Engineer Intern Assessment

This repository contains a weather app built as part of the AI Engineer Intern technical assessment for PM Accelerator. The app retrieves real-time weather information using the Open-Meteo API and maps weather conditions to simple icons.

## Features

### User Input:
- **Location Entry:**  
  You can enter a location (city, zip/postal code, GPS coordinates, landmarks, etc.) to retrieve the current weather.
- **Geolocation:**  
  There is an option to use your current location via geolocation.

### Weather Information:
- **Current Weather:**  
  Displays current weather details including time, temperature, and wind speed.
- **5‑Day Forecast:**  
  Provides a 5‑day forecast with minimum and maximum temperatures.
- **Visual Indicators:**  
  Uses emoji icons to visually represent different weather conditions, helping users quickly visualize the weather.

### API Integration:
- **Weather Data:**  
  Fetches real-time weather and forecast data from the Open‑Meteo API (free of charge).
- **Geocoding:**  
  Uses the Nominatim API for both geocoding (converting location names to coordinates) and reverse geocoding (converting coordinates to location names).

### CRUD (For Next Steps):
- While this version focuses on data retrieval and display, the project is structured for easy expansion.
- Future steps will integrate full CRUD operations (Create, Read, Update, Delete) to store user inputs and weather data in a database for persistence.

## How It Works

### User Location Input:
- **Manual Entry:**  
  Users can type in a location.
- **Current Location:**  
  Alternatively, users can click “Use My Location” which utilizes the browser's geolocation features.
- **Location Conversion:**  
  The app uses the Nominatim API to translate the input location into latitude and longitude coordinates.

### Data Retrieval:
- **Weather Data:**  
  Based on the obtained coordinates, weather data is fetched from the Open‑Meteo API to ensure real-time and accurate information.

### Display:
- **Current Weather:**  
  The app clearly displays the current weather with essential details.
- **Forecast:**  
  A dynamically generated 5‑day forecast shows the dates, weather icons, and temperature ranges for each day.

## Extensibility
The project is structured for easy expansion:
- **Database Integration:**  
  Although the current version focuses on API integration and display, future iterations will include CRUD operations using either a SQL or NoSQL database.
- **Enhancements:**  
  The modular design allows for enhancements such as additional weather parameters, improved UI components, or data persistence.

