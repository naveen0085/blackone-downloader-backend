const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/api/download", async (req, res) => {
    const videoUrl = req.body.url;
    if (!videoUrl) return res.status(400).json({ error: "Missing URL" });

    const id = Math.random().toString(36).substring(2, 10);
    const outputPath = path.resolve(__dirname, `video_${id}.mp4`);

    execFile(
        path.resolve(__dirname, "yt-dlp"),
        ["-f", "mp4", "-o", outputPath, videoUrl],
        (error, stdout, stderr) => {
            if (error) {
                console.error("yt-dlp error:", stderr);
                return res.status(500).json({ error: "Download failed" });
            }

            // Serve video URL
            res.json({ url: `https://yourdomain.com/video_${id}.mp4` });
        }
    );
});

app.use(express.static(path.resolve(__dirname)));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
