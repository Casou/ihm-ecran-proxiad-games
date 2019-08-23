const colors = require('./colors');
const fs = require('fs');

const PAD_LENGTH = 50;
const STATUS = {
  OK: `${colors.green}OK${colors.reset}`,
  KO: `${colors.red}KO${colors.reset}`
};


const fileExist = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.F_OK, (err) => {
      if (err) {
        return reject({filePath, status: STATUS.KO, error: err});
      }
      resolve({filePath, status: STATUS.OK});
    })
  });
};

const pad = message => {
  return message.padEnd(PAD_LENGTH, ' ').substr(0, PAD_LENGTH);
};

const _formatMessage = (message, status = STATUS.OK) => {
  return `${pad(message)}\t${status}`;
};

const logResults = (results) => {
  results.sort(sortFiles)
    .forEach(file => console.log(_formatMessage(`- ${file.filePath}`, file.status)));

  if (results.filter(file => file.status !== STATUS.OK).length > 0) {
    console.log(`${colors.yellow}WARNING : Some required files doesn't exists.${colors.reset}`)
  }

  return results;
};

const sortFiles = (a, b) => {
  if (!b || !b.filePath) {
    return 1;
  }
  if (!a || !a.filePath) {
    return -1;
  }
  return a.filePath.localeCompare(b.filePath);
};

const checkFiles = files => {
  console.log(`${colors.bright}Check files${colors.reset}`);
  return Promise.all(files.map(f => fileExist(f).catch(err => err)))
    .then(logResults);
};

module.exports = {
  checkFiles
};