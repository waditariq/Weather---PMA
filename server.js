const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");
const app = express();
const port = 3000;

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://tariqalt300:AvidOcelot1@cluster0.ri2uz.mongodb.net/weatherApp?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB connection error:", err));

// Define a schema and model for stored queries
const querySchema = new mongoose.Schema({
  location: String,
  start_date: String,
  end_date: String,
  result: String, // Stored as stringified JSON
  created_at: { type: Date, default: Date.now }
});
const Query = mongoose.model("Query", querySchema);

// Parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the public folder
app.use(express.static("public"));

// Helper: Validate date strings in YYYY-MM-DD format
function isValidDate(str) {
  const date = new Date(str);
  return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(str);
}

// POST endpoint: Create a weather query and persist data
app.post("/weather", async (req, res) => {
  const { location, start_date, end_date } = req.body;

  if (!location || !start_date || !end_date) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  if (!isValidDate(start_date) || !isValidDate(end_date)) {
    return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
  }
  if (new Date(start_date) > new Date(end_date)) {
    return res.status(400).json({ error: "Start date must be before or equal to the end date." });
  }

  try {
    // Validate location via Nominatim
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    const nomRes = await axios.get(nominatimUrl, { headers: { 'User-Agent': 'WeatherApp/1.0' } });
    const locData = nomRes.data;
    if (!locData || locData.length === 0) {
      return res.status(400).json({ error: "Location not found." });
    }
    const { lat, lon, display_name } = locData[0];

    // Fetch weather data from Open‑Meteo API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&start_date=${start_date}&end_date=${end_date}&timezone=auto`;
    const weatherRes = await axios.get(weatherUrl);
    if (weatherRes.status !== 200) throw new Error("Error fetching weather data");
    const weatherData = weatherRes.data;

    // Save the query document to MongoDB
    const newQuery = new Query({
      location: display_name,
      start_date,
      end_date,
      result: JSON.stringify(weatherData)
    });
    const savedQuery = await newQuery.save();

    res.json({
      id: savedQuery._id,
      location: savedQuery.location,
      start_date,
      end_date,
      weather: weatherData
    });
  } catch (error) {
    console.error("Full error in POST /weather:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET endpoint: Retrieve all stored weather queries
app.get("/weather", async (req, res) => {
  try {
    const queries = await Query.find().sort({ created_at: -1 });
    res.json(queries);
  } catch (err) {
    console.error("Full error in GET /weather:", err);
    res.status(500).json({ error: "Error retrieving queries." });
  }
});

// PUT endpoint: Update an existing weather query by ID
app.put("/weather/:id", async (req, res) => {
  const { location, start_date, end_date } = req.body;
  const id = req.params.id;

  if (!location || !start_date || !end_date) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  if (!isValidDate(start_date) || !isValidDate(end_date)) {
    return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
  }
  if (new Date(start_date) > new Date(end_date)) {
    return res.status(400).json({ error: "Start date must be before or equal to the end date." });
  }

  try {
    // Validate location via Nominatim
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    const nomRes = await axios.get(nominatimUrl, { headers: { 'User-Agent': 'WeatherApp/1.0' } });
    const locData = nomRes.data;
    if (!locData || locData.length === 0) {
      return res.status(400).json({ error: "Location not found." });
    }
    const { lat, lon, display_name } = locData[0];

    // Fetch updated weather data from Open‑Meteo API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&start_date=${start_date}&end_date=${end_date}&timezone=auto`;
    const weatherRes = await axios.get(weatherUrl);
    if (weatherRes.status !== 200) throw new Error("Error fetching weather data");
    const weatherData = weatherRes.data;

    // Update the document in MongoDB
    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      {
        location: display_name,
        start_date,
        end_date,
        result: JSON.stringify(weatherData)
      },
      { new: true }
    );
    if (!updatedQuery) {
      return res.status(404).json({ error: "Record not found." });
    }
    res.json({
      id: updatedQuery._id,
      location: updatedQuery.location,
      start_date: updatedQuery.start_date,
      end_date: updatedQuery.end_date,
      weather: weatherData
    });
  } catch (error) {
    console.error("Full error in PUT /weather/:id:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE endpoint: Delete a weather query by ID
app.delete("/weather/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedQuery = await Query.findByIdAndDelete(id);
    if (!deletedQuery) {
      return res.status(404).json({ error: "Record not found." });
    }
    res.json({ message: "Record deleted successfully." });
  } catch (error) {
    console.error("Full error in DELETE /weather/:id:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
