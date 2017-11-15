/*
   pxPong - written by Hugh Fitzpatrick,  Copyright 2005-2017 John Robinson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/



px.import({  scene: 'px:scene.1.js',
              keys: 'px:tools.keys.js'
}).then( function importsAreReady(imports)
{
  module.exports.wantsClearscreen = function() 
  {
    return false; // skip clearscreen by framework... using opaque bg.
  };

  var scene   = imports.scene;
  var keys    = imports.keys;
  var root    = scene.root;

  var fontRes = scene.create({ t: "fontResource", url: "FreeSans.ttf" });

  var bg = scene.create({ t: "rect", parent: root, fillColor: 0x010101FF, x: 0, y: 0, w:  800, h: 600 }); 
 
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var UPDATE_TIMER  = null;
  var WINNING_SCORE = 300;

  var showingWinScreen = false;
  var robotPlayer2     = true;

  var PADDLE_HEIGHT = 120;
  var PADDLE_WIDTH  = 20;

  var ballspeed_x = 10;
  var ballspeed_y = 4;

  var player1Score = 0;
  var player2Score = 0;

  var pts   = 48;
  var inset = 5;

  var container = scene.create({ t: "object", parent: root, x: 0, y: 0, w: 1220, h: 800, interactive: true  });

  var PADDLE1_X = 10; // inset
  var PADDLE2_X = container.w - PADDLE1_X - PADDLE_WIDTH;
  var BALL_W    = 40;
  var BALL_H    = 40;

  var x2 = container.w / 2;
  var y2 = container.h / 2;

  var midLine = scene.create({ t: "object", parent: root, x: x2 - 4, y: 0, w: 8, h: container.h, interactive: false });

  var hh = container.h / 20;

  for (var i =0; i< hh; i++)
  {
    var dash = scene.create({ t: "rect", parent: midLine,  fillColor: 0xFFFFFF30, 
                x: 0, y: (i * 20), w:  8, h: 10, interactive: false });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var ver = "v1.0";
  var val = "\u0398"; //u0398   u2299

  var paddle1 = scene.create({ id: "P1", t: "rect", parent: container,  fillColor: 0xFFFFFFff, x: PADDLE1_X, y: y2, w: PADDLE_WIDTH, h: PADDLE_HEIGHT, interactive: false });
  var paddle2 = scene.create({ id: "P2", t: "rect", parent: container,  fillColor: 0xFFFFFFff, x: container.w - 20 -10, y: y2, w: PADDLE_WIDTH, h: PADDLE_HEIGHT, interactive: false });

  var version = scene.create({ t: "text", parent: container, font: fontRes, text: ver, textColor:0x888888ff,
                                  x: 10, y: 0, pixelSize: 12 } );

  var ball   = scene.create({ t: "textBox", parent: container, font: fontRes, text: val, textColor:0xFFFFFFff,
                                  x: x2, y: y2, w: 20, h: 20 ,pixelSize: pts,
                                  alignHorizontal: scene.alignHorizontal.CENTER, alignVertical: scene.alignVertical.CENTER});

  var score   = scene.create({ t: "textBox", parent: container, font: fontRes, text: "0  :  0", textColor:0x888888ff,
                              x: x2 - 40, y: 42, w: 100, h: 50 ,pixelSize: 36,
                              alignHorizontal: scene.alignHorizontal.CENTER, alignVertical: scene.alignVertical.CENTER});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  Promise.all([container, paddle1, paddle2, ball, score])
  .catch((err) => {
      console.log(">>> Loading Assets ... err = " + err);
  })
  .then((success, failure) => {

    var metrics1 = fontRes.measureText(pts, val);
    BALL_W = metrics1.w + 10; // fudge
    BALL_H = metrics1.h - 8;  // fudge

    ball.w = BALL_W;
    ball.h = BALL_H;
    
    var metrics2 = fontRes.measureText(score.pixelSize, score.text);

    score.w = metrics2.w;
    score.h = metrics2.h;

    score.x = midLine.x + midLine.w / 2 - metrics2.w/2 - 1;

    updateSize( scene.getWidth(), scene.getHeight() );

    container.focus = true;
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  container.on("onKeyDown", function (e)
  {
      robotPlayer2 = false; // human take over

      var dy    = 50;
      var p     = PADDLE_HEIGHT;
      var new_y = paddle2.y;
      var code  = e.keyCode;

      switch (code)
      {
         // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
         case keys.DOWN:  new_y += dy; break;
         case keys.UP:    new_y -= dy; break;
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      }//SWITCH

      // Clamp Paddle2 Onscreen
      if(new_y <= container.y)
      {
          paddle2.y = container.y;
      }
      else
      if(new_y + p > (container.y + container.h) )
      {
          paddle2.y = container.y + container.h - p;
      }
      else
      {
          //paddle2.y = new_y;

          paddle2.animateTo({y: new_y}, dy/100, scene.animation.TWEEN_STOP).catch(() => {});
      }
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  container.on("onMouseMove", function(e)
  {
      var p = PADDLE_HEIGHT;

      // Clamp Paddle1 Onscreen
      if(e.y <= container.y)
      {
        paddle1.y = container.y;
      }
      else
      if(e.y + p > (container.y + container.h) )
      {
        paddle1.y = container.y + container.h - p;
      }
      else
      {
        paddle1.y = e.y;
      }
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function ballReset()
  {
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE)
    {
        showingWinScreen = true;
    }

    // change ball direction
    ballspeed_x = -ballspeed_x;

    // center ball on field
    ball.x = container.w/2;
    ball.y = container.h/2;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function computerMovement()
  {
    var paddle2YCenter = paddle2.y + PADDLE_HEIGHT / 2;
    if(paddle2YCenter < ball.y - 35)
    {
        paddle2.y += 6;
    }
    else if(paddle2YCenter > ball.y + 35)
    {
        paddle2.y -= 6; 
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function hitPaddle(paddle)
  {
    var ball_y = ball.y + ball.h/2;

    // Ball hits Paddle
    if(ball_y > paddle.y && 
       ball_y < paddle.y + PADDLE_HEIGHT)
    {
        ballspeed_x = -ballspeed_x; // bounce

        var      p2 = PADDLE_HEIGHT/2;
        var  deltaY = ball_y - (paddle.y + p2);
        ballspeed_y = deltaY * 0.35;
    }
    else
    {
        (paddle.id === "P1") ?  player1Score++ : player2Score++;
        score.text = "" + player1Score + "  :  " + player2Score;

        ballReset();
    }
  }

  function moveEverything()
  {
    if(showingWinScreen)
    {
        return;
    }

    ball.x += ballspeed_x;

    if(robotPlayer2)
    {
        computerMovement();
    }

    var ball_y = ball.y + ball.h/2;
    var     p2 = PADDLE_HEIGHT/2;

    if(ball.x < PADDLE1_X + PADDLE_WIDTH)
    {
        hitPaddle(paddle1);
    }
    else
    if(ball.x >= PADDLE2_X - PADDLE_WIDTH * 2)
    {
        hitPaddle(paddle2);
    }
    else
    {
        ball.y += ballspeed_y;
        if(ball.y > (container.h - BALL_H) || ball.y < 0)
        {
            ballspeed_y = -ballspeed_y;
        }
        // ballspeed_y = 0; // testing
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function updateSize(w, h)
  {
    bg.w = w;
    bg.h = h;

    container.w = w;
    container.h = h;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  scene.on("onResize", function(e) {  updateSize(e.w,e.h); layout(); });
  scene.on("onClose", function(e)  { clearInterval(UPDATE_TIMER);    });  // cleanup

  var framesPerSecond = 30;

  // calls moveEverything in intervals of 1000 ms
  UPDATE_TIMER = setInterval(function()
                 {
                     moveEverything();
                 },
                 1000/framesPerSecond);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).catch(function importFailed(err){
   console.error("Import failed for pxPong.js: " + err);
});