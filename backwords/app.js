var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// WebSocket
const WebSocket = require('ws');
const ws = new WebSocket.Server({
  port: 5000
})

// Global variables
var allWordsInLesson = [];

// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
  //Enabling CORS 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});

//Setting up server
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'forwords'
});

connection.connect(function (err) {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

class Player {
  constructor(ID, name, choices, prompt) {
    this.ID = ID;       
    this.name = name;
    this.choices = choices;
    this.prompt = prompt;
  }
  setPromptChoices(choices) {
    this.choices = choices;
    this.prompt = choices[Math.floor(Math.random() * 4)];
    console.log("PlayerChoices ",choices);

  }
}

class Game {
  constructor(lesson, players, numList) {
    this.lesson = lesson;
    this.players = players;
    this.numList
  } 
}
// WebSocket
ws.on('connection', function connection(ws, req) {
  console.log('Connection accepted:', req.connection.remoteAddress.replace(/.*:/, ''));
  ws.on('message', function incoming(message) {
    // Turn every received message into a JSON immediately to access it!
    let receivedMessage = JSON.parse(message);
    var newGame = startGame();
    for (let i = 0; i < newGame.players.length; i++) {
      getChoices(newGame.lesson, newGame.players[i], newGame.numList);
    }
    // console.log("Player ",0,": Choice 0 ",newGame.players[0].choices[0]);
    // for (let i = 0; i < newGame.players.length; i++) {
    //   console.log("Player ",i,": Choice 1 ",newGame.players[i].choices[1]);
    //   console.log("Player ",i,": Choice 2 ",newGame.players[i].choices[2]);
    //   console.log("Player ",i,": Choice 3 ",newGame.players[i].choices[3]);
    //   console.log("Player ",i,": Promp ",newGame.players[i].prompt)
    // }
    // If the client is requesting choices and a prompt
    if (receivedMessage[0].request == 'choicesAndPrompts') {
      let lesson = receivedMessage[0].lesson;
      populateChoicesAndPrompt(ws, lesson);
    }
  });
});

  function startGame() {
    //connection established, assume moving on from Jake's screen.
    p1 = new Player(1, "Jake");
    p2 = new Player(2, "Nikki");
    lesson = 7;
    let players = [p1, p2];
    let choiceNums = [];
    let newGame = new Game(lesson, players, choiceNums);
    return newGame;
  }
  // Can be possibly made a class function of Game.
  // Send choices and prompt to client
  function getChoices(lesson, player, choiceNums) {
    console.log("getChoices() called");
    connection.query('SELECT * FROM word WHERE lesson = ' + lesson + ';', function (error, results) {
      if (error)
        throw error;
      // console.log("results: ", results[0]);
      let minID = results[0].ID;
      let numList = fourWordsPicker(minID, (results.length - 1)); // return an array of 4 unique numbers

      // Get full choices of these choices and put them in an array
      var choices = [];
      // var choices = [results[numList[0]], results[numList[1]], results[numList[2]], results[numList[3]]];
      for (var i = 0; i < results.length; i++) {
        for (var j = 0; j < numList.length; j++) {
          if (results[i].ID == numList[j]) {
            choices.push(results[i])
          }
        }
      }
      player.setPromptChoices(choices);



    });
  }

  function populateChoicesAndPrompt(ws, lesson) {
    connection.query('SELECT * FROM word WHERE lesson = ' + lesson + ';', function (error, results) {
      if (error)
        throw error;
      let minID = results[0].ID;
      let numList = fourWordsPicker(minID, (results.length - 1)); // return an array of 4 unique numbers

      // Get full choices of these choices and put them in an array
      var choices = [];
      for (var i = 0; i < results.length; i++) {
        for (var j = 0; j < numList.length; j++) {
          if (results[i].ID == numList[j]) {
            choices.push(results[i])
          }
        }
      }
      // Add send header of "choicesAndPrompt" at element 0
      // choices.unshift("choicesAndPrompt");

      // Put prompt at the end of the array
      // choices.push(choices[randomInt]);

      // Stringify the choices to send them to the client
      // var choicesAndPrompt = JSON.stringify(choices);
      // Send it to the client
      // ws.send(choicesAndPrompt);

      // Reset all of the arrays
      // choicesAndPrompt = [];
    });
  }

  //Generate a random number between the minimum ID in that lesson and the maximum ID in that lesson
  function randomNumGen(minID, lessonWordsCount) {
    let maxID = minID + lessonWordsCount;
    return Math.floor(Math.random() * (maxID - minID) + minID);
  }

  /* Create a list of 4 unique numbers
   * If a number is already in the list, then generate a unique number
   */
  function fourWordsPicker(minID, lessonWordsCount) {
    let numList = [];
    while (numList.length < 4) {
      let potential = Math.floor(randomNumGen(minID, lessonWordsCount));
      while (numList.includes(potential)) {
        potential = randomNumGen(minID, lessonWordsCount);
      }
      numList.push(potential);
    }
    return numList; // should be 4 random numbers between minID and maxID
  }


  // HTTP

  // Display welcome message 
  app.get('/', function (req, res) {
    res.send("Welcome to forwords");
  });

  // returns the list of lessons
  app.get('/lesson-list', function (req, res) {
    console.log("in /lesson-list route in backend");
    connection.query('SELECT * FROM lesson;', function (error, results, fields) {
      if (error)
        throw error;
      res.json(results);
    });
  })

  // Gets a single word, for multiplayer
  app.get('/word/:lesson/:id', function (req, res) {
    console.log('in /word route in backend');
    var id = req.params.id;
    var lesson = req.params.lesson;
    connection.query('SELECT * FROM word WHERE lesson = ' + lesson + ' WHERE ID = ' + id + ';', function (error, results, fields) {
      if (error)
        throw error;
      res.json(results);
    });
  })

  app.get('/choices/:first/:second/:third/:fourth', function (req, res) {
    console.log('in /choices route in backend');
    var lesson = req.params.lesson;
    var first = req.params.first;
    var second = req.params.second;
    var third = req.params.third;
    var fourth = req.params.fourth;
    connection.query('SELECT * FROM word WHERE ID in (' + first + ',' + second + ',' + third + ',' + fourth + ');', function (error, results, fields) {
      if (error)
        throw error;
      res.json(results);
    });
  })

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({
    extended: false
  }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.sendStatus(err.status || 500);
    res.sendStatus(err.status);
    //  res.render('error');
  });

  module.exports = app;
