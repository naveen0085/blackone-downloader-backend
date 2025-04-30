const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { execFile } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/json", async (req, res) => {
  const videoURL = req.body.url;
  if (!videoURL) {
    return res.status(400).json({ error: "No URL provided" });
  }

  const ytdlpPath = path.join(__dirname, "yt-dlp");

  execFile(
    ytdlpPath,
    ["-g", "-f", "best", videoURL],
    (error, stdout, stderr) => {
      if (error) {
        console.error("yt-dlp error:", stderr);
        return res.status(500).json({ error: "yt-dlp failed", details: stderr });
      }

      const directURL = stdout.trim().split("\n").pop();
      return res.json({ url: directURL });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
