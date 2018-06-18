'use strict'

let express = require('express')
let path = require('path')
let app = express()
let handlebars = require('express-handlebars')
let bodyParser = require('body-parser')
let Player = require('./player')
// let Controller = require('./controller')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/**
 * Use this to specify a path to static files
 */
app.use(express.static(path.join(__dirname, '../public')))

/**
 * This is for telling main is the default handlebar
 */
app.engine('.handlebars', handlebars({
  defaultLayout: 'main',
  extname: '.handlebars'
}))

app.set('view engine', '.handlebars')

/**
 * This will setup the two players that will play the game
 */
let player1Arr = []
let player1TotalScoreArr = []
let player1 = new Player('Player 1', player1Arr, player1TotalScoreArr, 0, 0, 0, true)

let player2Arr = []
let player2TotalScoreArr = []
let player2 = new Player('Player 2', player2Arr, player2TotalScoreArr, 0, 0, 0, true)

let btn1Dis = 'enabled'
let btn2Dis = 'disabled'

/**
 * This will help for just one player to play at each time
 * @param {*} player is the player belonging to the button
 */
function setButtonToDisabled (player) {
  if (player.getName() === 'Player 1') {
    btn1Dis = 'disabled'
    btn2Dis = 'enabled'
  } else if (player.getName() === 'Player 2') {
    btn1Dis = 'enabled'
    btn2Dis = 'disabled'
  }
}

/**
 * This function simulates a throw with a bowling ball. If the random number will be a strike, a X will be pushed
 * to the array followed by an empty string.
 * @param {*} n is the maximum amount of pins that can be thrown down
 * @param {*} player is the player that throws the ball
 */
function throwBowlingBall (n, player) {
  if (player.counter === 1) {
    let amountOfPins = Math.floor(Math.random() * n)
    if (amountOfPins === 10) {
      player.addScore('X')
      player.addScore(' ')
      player.counter = 0
      setButtonToDisabled(player)
    } else {
      player.addScore(String(amountOfPins))
      return amountOfPins
    }
  } else if (player.counter === 2) {
    if ((parseInt(player.getScores()[player.getScores().length - 1]) + n) === 10) {
      player.addScore('/')
    } else {
      player.addScore(String(n))
    }
  }
}

/**
 * This is for calculate the amount of pins that will be the maximum of pins that can be thrown down in the
 * second throw
 * @param {*} n is the amount of pins that has been thrown down from the first throw
 */
function secondRound (n) {
  const maxRandom = 11
  let computation = maxRandom - n
  let secondAmountOfPins = Math.floor(Math.random() * computation)
  return secondAmountOfPins
}

/**
 * This will check if the round contains a spare
 * @param {*} arr are the two "numbers" that will be checked
 */
function ifSpare (arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === '/') {
      return true
    }
  }
}

/**
 * This will check if the round contains a strike
 * @param {*} arr are the two "numbers" that will be checked
 */
function ifStrike (arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 'X') {
      return true
    }
  }
}

/**
 * This will add the scores to the total summary of a players score. The add to the total score array
 * will depend on if a spare or strike has been done.
 * @param {*} player is the specific player
 * @param {*} counter is the counter of the player; 1 or 2
 * @param {*} roundCounter is the round; 1 - 10
 */
function addToTotalScoreArr (player, counter, roundCounter) {
  let total = 0
  let newRoundArr = [player.getScores()[player.getScores().length - 1], player.getScores()[player.getScores().length - 2]]
  let newRound = 0
  if (ifSpare(newRoundArr)) {
    let compute = 10 - parseInt(player.getScores()[player.getScores().length - 2])
    newRound = parseInt(player.getScores()[player.getScores().length - 2]) + compute + 10
  } else {
    newRound = parseInt(player.getScores()[player.getScores().length - 1]) + parseInt(player.getScores()[player.getScores().length - 2])
  }
  let previousRound = [player.getScores()[player.getScores().length - 3], player.getScores()[player.getScores().length - 4]]
  if (roundCounter === 1) {
    total += newRound
  } else {
    if (ifStrike(previousRound)) {
      if (roundCounter === 2) {
        total += 10 + newRound
        player.setTotalScore(total)
        total += newRound
      } else {
        total += 10 + newRound + parseInt(player.getTotalSumScore())
        player.setTotalScore(total)
        total += newRound
      }
    } else {
      total += newRound + parseInt(player.getTotalSumScore())
    }
  }
  player.setTotalScore(total)
}

/**
 * This will run the game
 * @param {*} player is the player the plays the game
 */
function playerPlay (player) {
  player.counter++

  if (player.run) {
    if (player.counter === 1) {
      player.roundCounter++

      if (player.roundCounter > 10) {
        console.log('GAME OVER')
        player.run = false
      }
      player.firstThrow = throwBowlingBall(11, player)
    } else if (player.counter === 2) {
      let second = secondRound(player.firstThrow)
      throwBowlingBall(second, player)
      addToTotalScoreArr(player, player.counter, player.roundCounter)
      player.counter = 0
      setButtonToDisabled(player)
    }
  } else {
    console.log('THE GAME IS OVER!')
  }
}

/**
 * This is getting a index page
 */
app.get('/', function (request, response) {
  response.render('index', {scoreP1: player1.getScores(), scoreP2: player2.getScores(), totalScoreP2: player2.getTotalScore(), totalScoreP1: player1.getTotalScore(), player1BtnDisabled: btn1Dis, player2BtnDisabled: btn2Dis})
})

/**
 * This will process when clicking the player 1 button
 */
app.post('/throwBallPlayer1', function (request, response) {
  playerPlay(player1)
  response.redirect('/')
})

/**
 * This will process when clicking the player 2 button
 */
app.post('/throwBallPlayer2', function (request, response) {
  playerPlay(player2)
  response.redirect('/')
})

// Specify the port
let port = process.env.port || 8000

/**
 * Start the server
 */
function startServer () {
  app.listen(port, function () {
    console.log('Listens to port: ' + port)
  })
}

module.exports.startServer = startServer
