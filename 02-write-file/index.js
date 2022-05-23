const {
    stdin,
    stdout
} = process;
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const info = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const rl = readline.createInterface(stdin, stdout);

rl.write('Hello, what are you tell me?\n')
rl.on('line', (input) => {
    if (input === 'exit') {
        stdout.write('Bye\n');
        process.exit();
    }
    info.write(`${input}\n`);
});

rl.on('close', () => {
    stdout.write('Bye\n');
    process.exit();
});