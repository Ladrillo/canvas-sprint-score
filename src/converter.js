#!/usr/bin/env node
const fs = require('fs')
const csv = require('csv-parser')

const patterns = [
  [/^student$/i, 'student'],
  [/^module 1 project/i, 'module_1'],
  [/^module 2 project/i, 'module_2'],
  [/^module 3 project/i, 'module_3'],
  [/^module 4 project/i, 'module_4'],
  [/^cfu questions final score$/i, 'cfu_questions'],
  [/^sprint assessment final score$/i, 'sprint_assessment'],
  [/^sprint challenge submissions final score$/i, 'sprint_challenge'],
  [/^final score$/i, 'total_score'],
]

const mapHeaders = ({ header }) => {
  const pattern = patterns.find(pat => pat[0].test(header))
  return pattern ? pattern[1] : null
}

const mapValues = ({ value }) => {
  return value || '0'
}

module.exports = async function () {
  const filePath = process.argv[2]

  if (!filePath || !fs.existsSync(filePath)) {
    console.log('Provide a valid path to a CSV file.')
    process.exit(1)
  }

  const minusExtension = filePath.split(/\.csv$/i)[0]
  const filePathJSON = `${minusExtension}.json`
  const filePathCSV = `${minusExtension}-converted.csv`

  const readStream = fs.createReadStream(filePath)
  const writeStreamJSON = fs.createWriteStream(filePathJSON)
  const writeStreamCSV = fs.createWriteStream(filePathCSV)

  let rows = []

  readStream
    .pipe(csv({ mapHeaders, mapValues }))
    .on('data', data => {
      rows.push(data)
    })
    .on('end', () => {
      rows = rows.slice(1).filter(row => row.student !== 'Student, Test')
      writeStreamJSON.write(JSON.stringify(rows))

      let csv = ''

      // add header row
      patterns.forEach(pat => {
        csv += `${pat[1]},`
      })
      csv = csv.slice(0, csv.length - 1) + '\n'

      // add student rows
      rows.forEach(row => {
        patterns.forEach(pat => {
          csv += `${row[pat[1]].replace(',', '')},`
        })
        csv = csv.slice(0, csv.length - 1) + '\n'
      })
      writeStreamCSV.write(csv)
    })
}
