const fs = require('fs/promises')
const path = require('path')

test('converted CSV matches snapshot', async () => {
  const convertedPath = path.resolve(process.cwd(), './fixtures/original-converted.csv')
  const data = await fs.readFile(convertedPath)
  expect(data.toString()).toMatchSnapshot()
})

test('converted JSON matches snapshot', async () => {
  const convertedPath = path.resolve(process.cwd(), './fixtures/original-converted.json')
  const data = await fs.readFile(convertedPath)
  expect(data.toString()).toMatchSnapshot()
})
