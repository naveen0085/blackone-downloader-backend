const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

app.post("/download", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  console.log(`Processing download for: ${url}`);

  // Correct yt-dlp command with cookies support
  const command = `yt-dlp -f mp4 -o - --cookies cookies.txt "${url}"`;

  const child = exec(command, { maxBuffer: 1024 * 1024 * 200 }); // 200MB buffer

  res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
  res.setHeader("Content-Type", "video/mp4");

  child.stdout.pipe(res);

  child.stderr.on("data", (data) => {
    console.error("yt-dlp error:", data.toString());
  });

  child.on("exit", (code) => {
    console.log(`yt-dlp process exited with code ${code}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
