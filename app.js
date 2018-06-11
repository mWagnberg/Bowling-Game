'use strict'

let maxRandom = 11

/**
 * This returns a number between 0 and 10
 */
function randomNumber (n) {
  console.log(Math.floor(Math.random() * n))
}

randomNumber(maxRandom)
