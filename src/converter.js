#!/usr/bin/env node
const fs = require('fs/promises')
const path = require('path')

module.exports = function () {
  const fileName = process.argv[2]

  if (!fileName) {
    process.stderr.write('\nProvide a .csv file to convert\n\n')
    process.exit(1)
  }

  const csvPath = path.resolve(process.cwd(), fileName)
  const minusExtension = fileName.split(/\.csv$/i)[0]
  const convertedCsvPath = path.resolve(process.cwd(), `${minusExtension}-converted.csv`)

  return fs.readFile(csvPath)
    .then(data => {
      const lines = data
        .toString()
        .trim()
        .split('\n')
        .slice(2)
        .filter(line => line.slice(0, 8) !== '"Student')

      const shorterLines = []
      lines.forEach(line => {
        const split = line.split(',')
        const result = `${split[0]},${split[1]},${split[split.length - 1]}`
        shorterLines.push(result)
      })
      return fs.writeFile(convertedCsvPath, shorterLines.join('\n'))
    })
    .then(() => {
      return fs.readFile(convertedCsvPath)
    })
    .then((data) => {
      process.stdout.write(data.toString())
    })
    .catch(() => {
      process.stderr.write('\nProvide a VALID .csv file to convert\n\n')
      process.exit(1)
    })
}
