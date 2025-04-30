const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.post("/download", (req, res) => {
  const videoUrl = req.body.url;
  console.log(`Processing download for: ${videoUrl}`);

  const outputFile = "video.mp4";
  const command = `yt-dlp -f mp4 -o "${outputFile}" "${videoUrl}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("yt-dlp error:", stderr);
      return res.status(500).send("Download failed.");
    }

    console.log("Download complete. Sending file...");
    res.download(path.join(__dirname, outputFile), (err) => {
      if (err) {
        console.error("File send error:", err);
      }

      // Clean up the file afterward
      fs.unlinkSync(outputFile);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
