'use strict'

module.exports = {
  throwBowlingBall: throwBowlingBall(),
  secondRound: secondRound()
}

/**
 * This will run when throwing a bowling ball
 * @param {*} n is the amount of possible pins that can be down
 */
function throwBowlingBall (n) {
  let amountOfPins = Math.floor(Math.random() * n)
  console.log('FIRST - ' + amountOfPins)
  return amountOfPins
}

/**
 * This will compute how many pins there are left from the first throw
 * @param {*} n are the amount of pins
 */
function secondRound (n) {
  const maxRandom = 11
  let computation = maxRandom - n
  let secondAmountOfPins = Math.floor(Math.random() * computation)
  console.log('SECOND - ' + secondAmountOfPins)
}

/* let firstThrow = throwBowlingBall(maxRandom)
secondRound(firstThrow) */
