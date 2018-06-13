'use strict'

class Player {
  constructor (name, scoreArr) {
    this.name = name
    this.scoreArr = scoreArr
  }

  getName () {
    return this.name
  }

  getScores () {
    return this.scoreArr
  }

  addScore (n) {
    this.scoreArr.push(n)
  }
}

module.exports = Player
