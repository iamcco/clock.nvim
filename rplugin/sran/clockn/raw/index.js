const fs = require('fs')

const front = fs.readFileSync('./front.text', 'utf-8').toString()

const lines = front.split('\n')

const frontMap = {}
const fronts = []

lines.forEach((line, idx) => {
  const l = []
  for (let i = 0, len = 8; i < len; i += 1) {
    l.push(line[i] || ' ')
  }
  fronts.push(l)
  if ((idx + 1) % 5 === 0) {
    frontMap[Math.floor((idx + 1) / 5)] = fronts.slice(0)
    fronts.length = 0
  }
})

fs.writeFileSync('./fronts.js', JSON.stringify(frontMap))
