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

let player1Arr = []
let player1TotalScoreArr = []
let player1 = new Player('Player 1', player1Arr, player1TotalScoreArr, 0, 0, 0, true)

let player2Arr = []
let player2TotalScoreArr = []
let player2 = new Player('Player 2', player2Arr, player2TotalScoreArr, 0, 0, 0, true)

/* let roundCounter = 0
let counter = 0
let firstThrow = 0
let run = true */

function throwBowlingBall (n, player) {
  if (player.counter === 1) {
    let amountOfPins = Math.floor(Math.random() * n)
    // console.log('FIRST - ' + amountOfPins)
    /* if (amountOfPins === 10) {
      player1.addScore(' ')
      player1.addScore('X')
    } */
    player.addScore(amountOfPins)
    return amountOfPins
  } else if (player.counter === 2) {
    player.addScore(n)
  }
}

function secondRound (n) {
  const maxRandom = 11
  let computation = maxRandom - n
  let secondAmountOfPins = Math.floor(Math.random() * computation)
  return secondAmountOfPins
  // console.log('SECOND - ' + secondAmountOfPins)
}

function addToTotalScoreArr (player) {
  let total = 0
  for (let i = 0; i < player.getScores().length; i++) {
    total += player.getScores()[i]
  }
  player.setTotalScore(total)
}

function playerPlay (player) {
  player.counter++
  console.log('COUNTER - ' + player.counter)
  if (player.run) {
    if (player.counter === 1) {
      player.roundCounter++
      console.log('ROUND COUNTER - ' + player.roundCounter)
      if (player.roundCounter > 10) {
        console.log('GAME OVER')
        // response.redirect('/')
        player1.run = false
      }
      player.firstThrow = throwBowlingBall(11, player)
      console.log('FIRSTTHROW - ' + player.firstThrow)
    } else if (player.counter === 2) {
      let second = secondRound(player.firstThrow)
      console.log('SECONDTHROW - ' + second)
      throwBowlingBall(second, player)
      console.log('SCORE - ' + player.getScores())
      addToTotalScoreArr(player)
      player.counter = 0
    }
  } else {
    console.log('TOLD YOU!')
  }
}

/**
 * This is getting a index page
 */
app.get('/', function (request, response) {
  response.render('index', {scoreP1: player1.getScores(), scoreP2: player2.getScores(), totalScoreP2: player2.getTotalScore(), totalScoreP1: player1.getTotalScore()})
})

/**
 * This will process when clicking the player 1 button
 */
app.post('/throwBallPlayer1', function (request, response) {
  playerPlay(player1)
  /* player1.counter++
  console.log('COUNTER - ' + player1.counter)
  if (player1.run) {
    if (player1.counter === 1) {
      player1.roundCounter++
      console.log('ROUND COUNTER - ' + player1.roundCounter)
      if (player1.roundCounter > 10) {
        console.log('GAME OVER')
        response.redirect('/')
        player1.run = false
      }
      player1.firstThrow = throwBowlingBall(11, player1)
      console.log('FIRSTTHROW - ' + player1.firstThrow)
    } else if (player1.counter === 2) {
      let second = secondRound(player1.firstThrow)
      console.log('SECONDTHROW - ' + second)
      throwBowlingBall(second, player1)
      console.log('SCORE - ' + player1.getScores())
      addToTotalScoreArr(player1)
      player1.counter = 0
    }
  } else {
    console.log('TOLD YOU!')
  } */

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
