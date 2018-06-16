'use strict'

class Player {
  constructor (name, scoreArr, totalScoreArr) {
    this.name = name
    this.scoreArr = scoreArr
    this.totalScoreArr = totalScoreArr
  }

  getName () {
    return this.name
  }

  getScores () {
    return this.scoreArr
  }

  setTotalScore (n) {
    this.totalScoreArr.push(n)
  }

  getTotalScore () {
    // return this.scoreArr[n] + this.scoreArr[n + 1]
    return this.totalScoreArr
  }

  addScore (n) {
    this.scoreArr.push(n)
  }
}

module.exports = Player
