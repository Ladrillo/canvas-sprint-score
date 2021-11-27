#!/usr/bin/env node
const fs = require('fs/promises')
const path = require('path')

const fileName = process.argv[2]

if (!fileName) {
  process.stderr.write('\nYou need to provide a .csv file to convert\n\n')
  process.exit(1)
}

const minusExtension = fileName.split(/\.csv$/i)[0]

const csvPath = path.resolve(process.cwd(), fileName)
const convertedCsvPath = path.resolve(process.cwd(), `${minusExtension}-converted.csv`)

fs.readFile(csvPath)
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
      const result = `${split[0]}, ${split[1]}, ${split[split.length - 1]}`
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
