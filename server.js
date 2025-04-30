const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/json", async (req, res) => {
  const videoURL = req.body.url;
  if (!videoURL) {
    return res.status(400).json({ error: "No URL provided" });
  }

  const ytdlp = spawn('./yt-dlp', [
    '--cookies', 'cookies.txt',
    '-f', 'best',
    '-g',
    videoURL
  ]);

  let output = '';
  let errorOutput = '';

  ytdlp.stdout.on('data', (data) => {
    output += data.toString();
  });

  ytdlp.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  ytdlp.on('close', (code) => {
    if (code === 0) {
      const url = output.trim().split('\n').pop();
      return res.json({ url });
    } else {
      return res.status(500).json({
        error: "yt-dlp failed",
        details: errorOutput
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
