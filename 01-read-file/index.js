const fs = require('fs');
const path = require('path');
const text = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(text);
let data = '';
readStream.on('data', chunk => console.log(data += chunk));
