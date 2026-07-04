const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get("/api/weather", async (req, res) => {
    try {
        const city = req.query.city;
        if (!city) {
            return res.status(400).json({ cod: 400, message: "City is required" });
        }

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_KEY}&units=metric`
        );

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ cod: 500, message: "Server error fetching weather" });
    }
});

app.get("/api/image", async (req, res) => {
    try {
        const city = req.query.city;
        const description = req.query.description || "";

        if (!city) {
            return res.status(400).json({ error: "City is required" });
        }

        const query = `${city} city ${description}`.trim();

        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
            {
                headers: {
                    Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`,
                },
            }
        );

        const data = await response.json();
        const first = data.results && data.results[0];

        if (!response.ok || !first) {
            return res.status(response.status || 404).json({ error: "Image not found" });
        }

        res.json({
            imageUrl: first.urls.regular,
            alt: first.alt_description || city,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error fetching image" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});