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

let btn1Dis = 'enabled'
let btn2Dis = 'disabled'

function setButtonToDisabled (player) {
  if (player.getName() === 'Player 1') {
    btn1Dis = 'disabled'
    btn2Dis = 'enabled'
  } else if (player.getName() === 'Player 2') {
    btn1Dis = 'enabled'
    btn2Dis = 'disabled'
  }
}

function throwBowlingBall (n, player) {
  if (player.counter === 1) {
    let amountOfPins = Math.floor(Math.random() * n)
    // console.log('FIRST - ' + amountOfPins)
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

function secondRound (n) {
  const maxRandom = 11
  let computation = maxRandom - n
  let secondAmountOfPins = Math.floor(Math.random() * computation)
  return secondAmountOfPins
  // console.log('SECOND - ' + secondAmountOfPins)
}

function ifSpare (arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === '/') {
      return true
    }
  }
}

function ifStrike (arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 'X') {
      return true
    }
  }
}

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
  console.log('NEW ROUND - ' + newRound)
  console.log('TOTAL SCORE - ' + player.getTotalSumScore())
  if (roundCounter === 1) {
    total += newRound
  } else {
    if (ifStrike(previousRound)) {
      total += 10 + newRound + parseInt(player.getTotalSumScore())
      player.setTotalScore(total)
      total += newRound
    } else {
      total += newRound + parseInt(player.getTotalSumScore())
    }
  }
  player.setTotalScore(total)
  /* for (let i = 0; i < player.getScores().length; i++) {
    if (player.getScores()[i] === 'X') {
      total += 10 + parseInt(player.getScores()[i + 2]) + parseInt(player.getScores()[i + 3])
      player.setTotalScore(total)
    } else if (player.getScores()[i] === ' ') {
      total += 0
    } else {
      total += parseInt(player.getScores()[i])
    }
  }
  player.setTotalScore(total) */
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
      addToTotalScoreArr(player, player.counter, player.roundCounter)
      player.counter = 0
      setButtonToDisabled(player)
    }
  } else {
    console.log('TOLD YOU!')
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
