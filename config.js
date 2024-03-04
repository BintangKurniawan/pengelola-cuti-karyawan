const fs = require('fs');

const configFilePath = 'tsx.json';
function getConfig() {
  try {
    const rawData = fs.readFileSync(configFilePath);
    return JSON.parse(rawData);
  } catch (err) {
    console.error('goblogk', err);
    return null;
  }
}

function saveConfig(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(configFilePath, jsonData);
    return true;
  } catch (err) {
    console.error('knjt', err);
    return false;
  }
}

module.exports = {
  getConfig,
  saveConfig,
};
