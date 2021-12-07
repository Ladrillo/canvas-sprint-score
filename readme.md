# @ladrillo/total-score

## About

Canvas courses can export the grade book as a CSV file, but there are usually too many fields. This lib uses the CSV file obtained from Canvas to generate, in the same directory, a new CSV file and a JSON file, containing only the desired fields. This library fits my particular use case, but you can monkey-patch it to fit yours.

## Using @ladrillo/total-score

```bash
  npx @ladrillo/total-score@lastest ./foo.csv          # relative path
  npx @ladrillo/total-score@lastest foo.csv            # relative path
  npx @ladrillo/total-score@lastest /Users/foo/foo.csv # absolute path
```

## Monkey-Patching @ladrillo/total-score

Edit the following variable inside `./src/converter.js` to include regular expressions matching the fields you wish to keep from the CSV obtained from the Canvas grade book.

```js
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
```
