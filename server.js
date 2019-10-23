const express = require('express');
const path = require('path');
const colors = require('./js/server/colors');
const { checkFiles } = require('./js/server/checkFiles');
const PORT = 9999;
const FILES_TO_CHECK = [
  "resources/audio/audio-background.mp3",
  "resources/audio/message.mp3",
  "resources/audio/progress-bar-message.mp3",
  "resources/videos/intro.mp4",
  "resources/videos/final.mp4",
  "resources/videos/never_gonna_give_you_up.mp4",
  "resources/videos/nyan_cat.mp4",
  "resources/videos/prairie.mp4",
  "resources/videos/sax_guy.mp4"
];

console.log(`${colors.magenta}******* Starting server *******${colors.reset}`);

const checkPromise = checkFiles(FILES_TO_CHECK);
checkPromise.then(() => {

  const app = express();
  app.get('/clock', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
  });

  app.get('/regie', (req, res) => {
    res.sendFile(path.join(__dirname + '/admin.html'));
  });

  app.get('/troll', (req, res) => {
    res.sendFile(path.join(__dirname + '/troll.html'));
  });

  app.get('/lock', (req, res) => {
    res.sendFile(path.join(__dirname + '/lock.html'));
  });

  app.use('/js', express.static(__dirname + '/js'));
  app.use('/css', express.static(__dirname + '/css'));
  app.use('/resources', express.static(__dirname + '/resources'));

  app.listen(PORT);

  console.log(`\n\n${colors.magenta}******* Started on port ${PORT} *******${colors.reset}\n`);
  console.log(`http://localhost:${PORT}/clock for the clock`);
  console.log(`http://localhost:${PORT}/regie for the back office`);
  console.log(`http://localhost:${PORT}/lock for the initial riddle lock page`);
});