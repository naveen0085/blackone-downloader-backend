const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.post("/download", (req, res) => {
  const url = req.body.url;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  console.log("Processing download for:", url);

  res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
  res.setHeader("Content-Type", "video/mp4");

  // Command with cookies support
  const command = `yt-dlp -o - --cookies cookies.txt "${url}"`;

  const process = exec(command, { maxBuffer: 1024 * 1024 * 100 });

  process.stdout.pipe(res);

  process.stderr.on("data", (data) => {
    console.error("yt-dlp error:", data.toString());
  });

  process.on("exit", (code) => {
    console.log(`yt-dlp process exited with code ${code}`);
    if (code !== 0) {
      res.end(); // Stop stream if error
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
