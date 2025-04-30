const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.post('/download', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  console.log(`Processing download for: ${url}`);

  const cookiesPath = path.join(__dirname, 'cookies.txt');
  const useCookies = fs.existsSync(cookiesPath);

  const command = useCookies
    ? `yt-dlp --cookies "${cookiesPath}" -f b -o - "${url}"`
    : `yt-dlp -f b -o - "${url}"`;

  const process = exec(command, { maxBuffer: 1024 * 1024 * 100 });

  res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
  res.setHeader('Content-Type', 'video/mp4');

  process.stdout.pipe(res);

  process.stderr.on('data', (data) => {
    console.error(`yt-dlp error: ${data}`);
  });

  process.on('close', (code) => {
    if (code !== 0) {
      console.error(`yt-dlp process exited with code ${code}`);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
