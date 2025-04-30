const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 10000;

app.use(cors());
app.use(express.json());

app.post('/download', (req, res) => {
  const videoUrl = req.body.url;
  if (!videoUrl) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  const outputPath = path.join(__dirname, 'downloads', '%(title)s.%(ext)s');
  const command = `yt-dlp -o "${outputPath}" "${videoUrl}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error downloading video: ${stderr}`);
      return res.status(500).json({ error: 'Failed to download video' });
    }
    console.log(`Video downloaded: ${stdout}`);
    res.status(200).json({ message: 'Download initiated' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
