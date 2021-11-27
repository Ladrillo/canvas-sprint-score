"use strict";

var _promises = _interopRequireDefault(require("fs/promises"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fileName = process.argv[2];

if (!fileName) {
  process.stderr.write('\nYou need to provide a .csv file to convert\n\n');
  process.exit(1);
}

const minusExtension = fileName.split(/\.csv$/i)[0];
const nastyCsvUrl = new URL(fileName, import.meta.url);
const convertedCsvUrl = new URL(`${minusExtension}-converted.csv`, import.meta.url);

_promises.default.readFile(nastyCsvUrl).then(data => {
  const lines = data.toString().trim().split('\n').slice(2).filter(line => line.slice(0, 8) !== '"Student');
  const shorterLines = [];
  lines.forEach(line => {
    const split = line.split(',');
    const result = `${split[0]}, ${split[1]}, ${split[split.length - 1]}`;
    shorterLines.push(result);
  });
  return _promises.default.writeFile(convertedCsvUrl, shorterLines.join('\n'));
}).then(() => {
  return _promises.default.readFile(convertedCsvUrl);
}).then(data => {
  process.stdout.write(data.toString());
});