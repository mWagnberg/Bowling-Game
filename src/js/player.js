'use strict'

class Player {
  constructor (name, scoreArr, totalScoreArr, roundCounter, counter, firstThrow, run) {
    this.name = name
    this.scoreArr = scoreArr
    this.totalScoreArr = totalScoreArr
    this.roundCounter = roundCounter
    this.counter = counter
    this.firstThrow = firstThrow
    this.run = run
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
    return this.totalScoreArr
  }

  addScore (n) {
    this.scoreArr.push(n)
  }

  getRoundCounter () {
    return this.roundCounter
  }

  getCounter () {
    return this.counter
  }

  getFirstThrow () {
    return this.firstThrow
  }

  getRun () {
    return this.run
  }
}

module.exports = Player
