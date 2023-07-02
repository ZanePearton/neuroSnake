// var state.xPos = 10;
// var state.yPos = 10;
// var state.gameSize = 20;
// var state.xAccel = 15;
// var state.yAccel = 15;
// var state.xVel = 0;
// var state.yVel = 0;
// var state.trail=[];
// var state.setTail = 10;
// var state.tail = state.setTail;
// var state.score = 0;
// var state.highScore = 0;
// var state.speedDifficulty = 75;
// var state.moveRecord = [];
// var state.currGen = 0;
// var state.gameRunning = true;
// var state.direction = ['left', 'forward', 'right'];
// var state.xApple = Math.floor(Math.random()*state.gameSize);
// var state.yApple = Math.floor(Math.random()*state.gameSize);
// var state.loopsSinceApple = 0;

var state = {
  xPos: 10,
  yPos: 10,
  gameSize: 20,
  xAccel: 15,
  yAccel: 15,
  xVel: 0,
  yVel: 0,
  trail: [],
  setTail: 10,
  tail: 10,
  score: 0,
  highScore: 0,
  speedDifficulty: 75,
  moveRecord: [],
  currGen: 0,
  gameRunning: true,
  direction: ['left', 'forward', 'right'],
  xApple: Math.floor(Math.random()*20),
  yApple: Math.floor(Math.random()*20),
  loopsSinceApple: 0
}

window.onload=function() {
    canv = document.getElementById("canvas");
    ctx = canv.getContext("2d");
    document.addEventListener("keydown",keyPush);
    gameSpeed = setInterval(game,state.speedDifficulty);
}

function game() {
    state.xPos += state.xVel;
    state.yPos += state.yVel;

    if (state.xVel != 0 || state.yVel != 0) {
      state.gameRunning = true;
    }

    ctx.fillStyle="white";
    ctx.fillRect(0,0,canv.width,canv.height);

    ctx.fillStyle="black";
    for(var i=0;i<state.trail.length;i++) {
      ctx.fillRect(state.trail[i].x*state.gameSize,state.trail[i].y*state.gameSize,state.gameSize-2,state.gameSize-2);
      if ( state.gameRunning) {
        if(state.trail[i].x==state.xPos && state.trail[i].y==state.yPos) {
          console.log(state.xVel + "," + state.yVel);
          resetGame();
          break;
        }
      }
    }
    state.trail.push({ x:state.xPos , y:state.yPos });
    while(state.trail.length>state.tail) {
      state.trail.shift();
    }

    state.moveRecord.push(getPosArr());
    keyPush(makePrediction(getPosArr()));;
    //console.log(predictedInput);

    if(state.xPos<0 || state.xPos > state.gameSize - 1 || state.yPos < 0 || state.yPos > state.gameSize - 1) {
        resetGame();
    }

    if (state.loopsSinceApple >= 75 ) {
      resetGame();
    }
    if(state.xApple == state.xPos && state.yApple == state.yPos) {
        state.loopsSinceApple = 0;
        state.tail++;
        state.score+=5;
        state.xApple = Math.floor(Math.random()*state.gameSize);
        state.yApple = Math.floor(Math.random()*state.gameSize);
    }
    ctx.fillStyle="orange";
    ctx.fillRect(state.xApple*state.gameSize,state.yApple*state.gameSize,state.gameSize-2,state.gameSize-2);
    document.getElementById("state.score").innerHTML = "state.score: " + state.score;
    document.getElementById("genCount").innerHTML = "Current Generation: " + state.currGen;
    //console.log(getPosArr());
    state.loopsSinceApple++;
}
function keyPush(input) {

    if ( input == 'left') {
      //console.log("in loop");
      if (state.yVel == -1) { // If snake is moving up
        state.xVel = -1;
        state.yVel = 0;
      } else if ( state.yVel == 1) { // If snake is moving down
        state.xVel = 1;
        state.yVel = 0;
      } else if ( state.xVel == -1) { // If snake is moving left
        state.xVel = 0;
        state.yVel = 1;
      } else { // If snake is moving right
        state.xVel = 0;
        state.yVel = -1;
      }

    } else if ( input == 'right'){
      if (state.yVel == -1) { // If snake is moving up
        state.xVel = 1;
        state.yVel = 0;
      } else if ( state.yVel == 1) { // If snake is moving down
        state.xVel = -1;
        state.yVel = 0;
      } else if ( state.xVel == -1) { // If snake is moving left
        state.xVel = 0;
        state.yVel = -1;
      } else { // If snake is moving right
        state.xVel = 0;
        state.yVel = 1;
      }
    } else if ( input == 'forward'){
      if ( state.yVel == 0 && state.xVel == 0) {
        state.yVel = -1;
      }
    }
}
function resetGame() {
   state.gameRunning = false;
   if ( state.score > state.highScore) {
     state.highScore = state.score;
     document.getElementById("state.highScore").innerHTML = "Personal Best: " + state.highScore;
   }
   state.tail = state.setTail;
   state.score = 0;
   state.xVel = 0;
   state.yVel = 0;
   state.xPos = 10;
   state.yPos = 10;
   state.currGen++;
   fitModel(state.moveRecord);
   state.loopsSinceApple = 0;
   state.moveRecord = [];
}

/*
* Gets current position of snake as well as current position of the apple
* and returns an array of the relative x and y position
* NOTE: X AND Y ARE RELATIVE, THEY CHANGE BASED ON SNAKE state.direction
* @returns Array
// arr[0]: left of snake
// arr[1]: front of snake
// arr[2]: right of snake
* arr[3] (x) and arr[4] (y) return the following respectively
* -1: apple is negative state.direction (x or y)
* 0: apple is at same position (x or y)
* 1: apple is positive state.direction (x or y)
*/
function getPosArr() {
  var arr = [0,0,0];
  var relApple = [0,0];
  if ( state.yVel == -1 ) { // If snake is moving up

    // GET VALUES FOR RELATIVE APPLE POS
    if ( state.xApple < state.xPos) {
      relApple[0] = -1;
    } else if (state.xApple == state.xPos) {
      relApple[0] = 0;
    } else {
      relApple[0] = 1;
    }

    if ( state.yApple < state.yPos) {
      relApple[1] = 1;
    } else if ( state.yApple == state.yPos) {
      relApple[1] = 0;
    } else {
      relApple[1] = -1;
    }

    // CHECK FOR OBSTACLES
    if ( state.xPos == 0) {
      arr[0] = 1;
    }
    if ( state.yPos == 0) {
      arr[1] = 1;

    }
    if ( state.xPos == state.gameSize - 1) {
      arr[2] = 1;
    }
    for ( var i = 0; i < state.trail.length; i++) {
      // If state.trail cell state.xPos is to the left and state.yPos is equal there is cell left
      if ( state.trail[i].x == state.xPos - 1 && state.trail[i].y == state.yPos) {
        arr[0] = 1;
      }
      // If state.trail cell state.yPos is -1  than x is equal there is cell forward
      if ( state.trail[i].x == state.xPos && state.trail[i].y == state.yPos - 1) {
        arr[1] = 1;
      }
      // If state.xPos is +1 than state.yPos is equal there is cell right
      if ( state.trail[i].x == state.xPos + 1 && state.trail[i].y == state.yPos) {
        arr[2] = 1;
      }
    }

  } else if ( state.yVel == 1) { // If snake is moving down

    // GET VALUES FOR RELATIVE APPLE POS
    if ( state.xApple < state.xPos) {
      relApple[0] = 1;
    } else if (state.xApple == state.xPos) {
      relApple[0] = 0;
    } else {
      relApple[0] = -1;
    }

    if ( state.yApple < state.yPos) {
      relApple[1] = -1;
    } else if ( state.yApple == state.yPos) {
      relApple[1] = 0;
    } else {
      relApple[1] = 1;
    }

    // CHECK FOR OBSTACLES
    if ( state.xPos == state.gameSize - 1) {
      arr[0] = 1;
    }
    if ( state.yPos == state.gameSize - 1) {
      arr[1] = 1;
    }
    if ( state.xPos == 0) {
      arr[2] = 1;
    }
    for ( var i = 0; i < state.trail.length; i++) {
      // If state.trail cell state.xPos is 1 greater and y is equal there is cell left
      if ( state.trail[i].x == state.xPos + 1 && state.trail[i].y == state.yPos) {
        arr[0] = 1;
      }
      // If state.trail cell state.yPos is 1 greater and x is equal there is cell forward
      if ( state.trail[i].x == state.xPos && state.trail[i].y == state.yPos + 1) {
        arr[1] = 1;
      }
      // If state.trail cell state.xPos is to the left and state.yPos is equal there is cell right
      if ( state.trail[i].x == state.xPos - 1 && state.trail[i].y == state.yPos) {
        arr[2] = 1;
      }
    }

  } else if ( state.xVel == -1) { // If snake is moving left

    // GET VALUES FOR RELATIVE APPLE POS
    if ( state.xApple < state.xPos) {
      relApple[1] = -1;
    } else if (state.xApple == state.xPos) {
      relApple[1] = 0;
    } else {
      relApple[1] = 1;
    }

    if ( state.yApple < state.yPos) {
      relApple[0] = 1;
    } else if ( state.yApple == state.yPos) {
      relApple[0] = 0;
    } else {
      relApple[0] = -1;
    }

    // CHECK FOR OBSTACLES
    if ( state.yPos == state.gameSize - 1) {
      arr[0] = 1;
    }
    if ( state.xPos == 0) {
      arr[1] = 1;
    }
    if ( state.yPos == 0) {
      arr[2] = 1;
    }
    for ( var i = 0; i < state.trail.length; i++) {
      // If state.trail cell state.xPos is equal and state.yPos is +1 there is cell left
      if ( state.trail[i].x == state.xPos && state.trail[i].y == state.yPos + 1) {
        arr[0] = 1;
      }
      // If state.trail cell state.xPos is -1 and y is equal there is cell forward
      if ( state.trail[i].x == state.xPos - 1 && state.trail[i].y == state.yPos) {
        arr[1] = 1;
      }
      // If state.trail cell state.yPos is 1 less than and x is equal there is cell right
      if ( state.trail[i].x == state.xPos && state.trail[i].y == state.yPos - 1) {
        arr[2] = 1;
      }
    }
  } else if ( state.xVel == 1){ // If snake is moving right

    // GET VALUES FOR RELATIVE APPLE POS
    if ( state.xApple < state.xPos) {
      relApple[1] = 1;
    } else if (state.xApple == state.xPos) {
      relApple[1] = 0;
    } else {
      relApple[1] = -1;
    }

    if ( state.yApple < state.yPos) {
      relApple[0] = -1;
    } else if ( state.yApple == state.yPos) {
      relApple[0] = 0;
    } else {
      relApple[0] = 1;
    }

    if ( state.yPos == 0) {
      arr[0] = 1;
    }
    if ( state.xPos == state.gameSize - 1) {
      arr[1] = 1;
    }
    if ( state.yPos == state.gameSize - 1) {
      arr[2] = 1;
    }

    // CHECK FOR OBSTACLES
    for ( var i = 0; i < state.trail.length; i++) {
      // If state.trail cell state.xPos is equal and state.yPos is is -1 there is cell left
      if ( state.trail[i].x == state.xPos && state.trail[i].y == state.yPos - 1) {
        arr[0] = 1;
      }
      // If state.trail cell state.xPos is +1 and y is equal there is cell forward
      if ( state.trail[i].x == state.xPos + 1 && state.trail[i].y == state.yPos) {
        arr[1] = 1;
      }
      // If state.trail cell state.yPos is 1 greater and x is equal there is cell right
      if ( state.trail[i].x == state.xPos && state.trail[i].y == state.yPos + 1) {
        arr[2] = 1;
      }
    }
  } else {
    // GET VALUES FOR RELATIVE APPLE POS
    if ( state.xApple < state.xPos) {
      relApple[0] = -1;
    } else if (state.xApple == state.xPos) {
      relApple[0] = 0;
    } else {
      relApple[0] = 1;
    }

    if ( state.yApple < state.yPos) {
      relApple[1] = -1;
    } else if ( state.yApple == state.yPos) {
      relApple[1] = 0;
    } else {
      relApple[1] = 1;
    }
  }

  arr.push(relApple[0]);
  arr.push(relApple[1]);
  //console.log(relApple);
  //console.log("(" + state.xVel + "," + state.yVel + ")");
  return arr;
}
/*
* Takes in data that is input into the model during training and returns the
* expected response from a prediction.
* @params arr describing surroundings
* arr[0]: if 1 something is to the left
* arr[1]: if 1 something is forward
* arr[2]: if 1 something is to the right
* NOTE: X AND Y ARE RELATIVE, THEY CHANGE BASED ON SNAKE state.direction
* NOTE 2: This function is only for training data, this is not for hardcoding snake behavior
* arr[3]: if -1 apple is in negative x state.direction, 0 is at same x state.direction, 1 positive x state.direction
* arr[4]: if -1 apple is in negative y state.direction, 0 is at same y state.direction, 1 positive y state.direction
* @return state.direction to move
* 0: Turn left
* 1: Go forward
* 2: Turn Right
*/
function getExpected(arr) {
  // If there is an object left and forward move right
  if ( arr[0] == 1 && arr[1] == 1) {
    return 2;
  // If there is an object left and right move forward
  } else if (arr[0] == 1 && arr[2] == 1) {
    return 1;
  // If there is an object forward and right move left
  } else if (arr[1] == 1 && arr[2] == 1) {
    return 0;
  // If there is an object left and state.xApple is -1 or 0
  } else if ( arr[0] == 1 && (arr[3] == -1 || arr[3] == 0)) {
    // If state.yApple is -1 go right, else forward
    if (arr[4] == -1) {
      return 2;
    } else {
      return 1;
    }
  // If there is an object left and state.xApple is 1 go right
  } else if (arr[0] == 1 && arr[3] == 1) {
    return 2;
  // If there is an object forward and state.xApple is -1 or 0 go left
  }  else if (arr[1] == 1 && (arr[3] = -1 )|| arr[3] == 0) {
    return 0;
  // If there is an object forward and state.xApple is 1 go right
  } else if (arr[1] == 1 && arr[3] == 1) {
    return 2;
  // If there is an object right and state.xApple is -1 go left
  } else if (arr[2] == 1 && arr[3] == -1) {
    return 0;
  // If there is an object right and state.xApple is 0
  } else if (arr[2] == 1 && arr[3]== 0){
    // If state.yApple is -1 go forward else right
    if (arr[4]== -1){
      return 0;
    } else {
      return 1;
    }
  // If there is an object right and state.xApple is 1
  } else if (arr[2] == 1 && arr[3]== 1) {
    return 1;
    // If there are no objects and state.xApple is -1 go left
  } else if (arr[3] == -1) {
    return 0;
  // If there are no objects and state.xApple is 0
  } else if (arr[3] == 0) {
    // If state.yApple is -1 move left to turn around
    if ( arr[4] == -1) {
      return 0;
    // Else move forward
    } else {
      return 1;
    }
  // If there are no objects and state.xApple is 1 go right
  } else {
    return 2;
  }







  /*
  // If snake has object to left and state.xApple is -1
} else if (arr[0] == 1 && (arr[3] == -1 || arr[3] == 0)) {
    // Move forward if state.yApple is left or forward
    if ( arr[4] == 1 || arr[4] == 0) {
      return 1;
    // Move left if state.yApple is left
    } else {
      return 2;
    }
  // If snake has object to the left and state.xApple is right
  } else if (arr[0] == 1 && arr[3] == 1) {
      // Move right if state.yApple is left or forward
      if ( arr[4] == 1 || arr[4] == 0) {
        return 2;
      } else {
        return 1;
      }
  // If snake has object forward and state.xApple left or foward go left
  } else if (arr[1] == 1 && (arr[3] == -1 || arr[3] == 0)) {
    return 0;
  // If snake has object forward and state.xApple is right go right
  } else if (arr[1] == 1 && arr[3] == 1) {
    return 2;
  // If snake has object right and state.xApple is left
  } else if (arr[2] == 1 && arr[3] == -1) {
    // If state.yApple is left or right move forward
    if ( arr[4] == -1 || arr[4] == 1) {
      return 1;
    // If state.yApple is forward move left
    } else {
      return 0;
    }
  // If snake has object right and state.xApple is forward
  } else if (arr[2] == 1 && arr[3] == 0) {
    // If snake has apple to the left move left
    if (arr[4] == -1) {
      return 0;
    // else move forward
    } else {
      return 1;
    }
  // If snake has no objects around it and state.xApple is left move left
  } else if (arr[3] == -1) {
    return 0;
  // If snake has no objects around it and state.xApple is forward
  } else if (arr[3] == 0) {
    // If state.yApple is negative move left (by convention)
    if ( arr[4] == 1) {
      return 0;
    // Else move forward
    } else {
      return 1;
    }
  // If snake has no objects around it and state.xApple is right move right
  } else {
    return 2;
  }*/
}
