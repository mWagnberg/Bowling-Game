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
// let player2Arr = []
let player1 = new Player('Player 1', player1Arr, player1TotalScoreArr)
// let player2 = new Player('Player 2', player2Arr)

let roundCounter = 0
let counter = 0
let firstThrow = 0
let run = true

function throwBowlingBall (n) {
  if (counter === 1) {
    let amountOfPins = Math.floor(Math.random() * n)
    // console.log('FIRST - ' + amountOfPins)
    /* if (amountOfPins === 10) {
      player1.addScore(' ')
      player1.addScore('X')
    } */
    player1.addScore(amountOfPins)
    return amountOfPins
  } else if (counter === 2) {
    player1.addScore(n)
  }
}

function secondRound (n) {
  const maxRandom = 11
  let computation = maxRandom - n
  let secondAmountOfPins = Math.floor(Math.random() * computation)
  return secondAmountOfPins
  // console.log('SECOND - ' + secondAmountOfPins)
}

function addToTotalScoreArr () {
  let total = 0
  for (let i = 0; i < player1.getScores().length; i++) {
    total += player1.getScores()[i]
  }
  player1.setTotalScore(total)
}

/**
 * This is getting a index page
 */
app.get('/', function (request, response) {
  response.render('index', {score: player1.getScores(), totalScore: player1.getTotalScore()})
})

app.post('/throwBall', function (request, response) {
  counter++
  console.log('COUNTER - ' + counter)
  if (run) {
    if (counter === 1) {
      roundCounter++
      console.log('ROUND COUNTER - ' + roundCounter)
      if (roundCounter > 10) {
        console.log('GAME OVER')
        response.redirect('/')
        run = false
      }
      firstThrow = throwBowlingBall(11)
      console.log('FIRSTTHROW - ' + firstThrow)
    } else if (counter === 2) {
      let second = secondRound(firstThrow)
      console.log('SECONDTHROW - ' + second)
      throwBowlingBall(second)
      console.log('SCORE - ' + player1.getScores())
      addToTotalScoreArr()
      counter = 0
    }
  } else {
    console.log('TOLD YOU!')
  }

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
