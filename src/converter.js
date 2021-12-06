#!/usr/bin/env node
const fs = require('fs')
const csv = require('csv-parser')

process.setUncaughtExceptionCaptureCallback(error => {
  console.error('Something went wrong processing students.', error)
  process.exit(1)
})

const logValidationError = () => {
  console.error('Provide path to a csv file.')
  console.error(`
    Usage:\n
    npx @ladrillo/total-score@lastest ./foo.csv          # relative path
    npx @ladrillo/total-score@lastest foo.csv            # relative path
    npx @ladrillo/total-score@lastest /Users/foo/foo.csv # absolute path
  `)
  process.exit(1)
}

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
    logValidationError()
  }

  const splitByDot = filePath.split('.')
  const extension = splitByDot[splitByDot.length - 1]

  if (!/csv$/i.test(extension)) {
    logValidationError()
  }

  const minusExtension = filePath.split(/\.csv$/i)[0]
  const filePathJSON = `${minusExtension}-converted.json`
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

      if (!rows.length) {
        console.log('No students were processed. Was the csv in the correct format?')
        process.exit(0)
      }

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

      console.log(`Successfully processed ${rows.length} students.`)
    })
    .on('error', error => {
      console.error('Error processing students.', error)
      process.exit(1)
    })
}
