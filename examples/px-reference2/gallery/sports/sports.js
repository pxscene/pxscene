// TO DO: Use styles for colors and fonts

var scoreboards = { "boards": ["http://www.pxscene.org/examples/px-reference2/gallery/sports/images/gameSpecific/ingame-live_matchup_overview.png",
                               "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/gameSpecific/ingame-live_matchup_strikeout.png",
                               "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/gameSpecific/ingame-live_matchup_pitch_count.png",
                               "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/gameSpecific/ingame-live_matchup_hit_zone.png",
                               "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/gameSpecific/ingame-live_matchup_spray_chart.png",
                               "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/gameSpecific/ingame-live_pitching_history.png",
                               "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/gameSpecific/ingame-away_hitting.png",
                               "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/gameSpecific/ingame-home_hitting.png",
                               "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/gameSpecific/ingame-fantasy_leaders.png"
                             ]};
                             
var bases = ["http://www.pxscene.org/examples/px-reference2/gallery/sports/images/MLB/bases_0.png",
             "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/MLB/bases_1.png",
             "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/MLB/bases_2.png",
             "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/MLB/bases_3.png",
             "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/MLB/bases_0.png",
             "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/MLB/bases_1.png",
             "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/MLB/bases_12.png",
             "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/MLB/bases_13.png",
             "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/MLB/bases_23.png",
             "http://www.pxscene.org/examples/px-reference2/gallery/sports/images/MLB/bases_123.png"
            ];                        
                               
px.import("px:scene.1.js").then( function ready(scene) {
  var root = scene.root;

  var r = scene.create({t:"rect",x:900,parent:root,y:10,w:350,h:720,fillColor:0x000000FF});

  var font = scene.create({t:"fontResource", url:"http://www.pxscene.org/examples/px-reference2/fonts/DejaVuSans.ttf"});
  var fontNames = scene.create({t:"fontResource", url:"http://www.pxscene.org/examples/px-reference2/fonts/XFINITYSansTT-New-BoldCond.ttf"});
  font.ready.then(function() {
       
  });
  
  var basesImgs = [];
  var maxBases = bases.length;
  // Preload bases images for smoother transitions
  for(var i = 0; i < maxBases; i++) {
    basesImgs[i] = scene.create({t:"imageResource", url:bases[i]});
  }
  
  var baseNum = 0;
  var gameInfo = scene.create({t:"rect",parent:r, fillColor:0x00000000});
  
  // Milwaukee Brewers
  // Sources for image.  Is quarterback link temporary?
  // http://quarterback-ci-restapi-teamcity.xreapps.net/sports_logos/MLB/1424553350259_17761872300_1424561313664_70_70.png
  // http://legacy.myriad-next.comcast.net/select/logo?entityId=8505044000897014119&width=46&height=46&extent=true
  var t1Pic = scene.create({t:"image", parent:gameInfo,w:70,h:70,y:10,cx:35,cy:35,url:"http://www.pxscene.org/examples/px-reference2/gallery/sports/images/gameSpecific/Brewers.png"});
  var t1Name = scene.create({t:"textBox", parent:gameInfo,x:75,y:50,w:80, h:25,text:"MIL", font:fontNames, pixelSize:17,
              alignHorizontal:scene.alignHorizontal.CENTER, textColor:0xd0d0d0ff});
  var t1Line = scene.create({t:"rect", parent:gameInfo,x:78,y:70,w:70,h:2,lineColor:0xffff55ff,lineWidth:1});
  var t1Score = scene.create({t:"textBox",parent:gameInfo,x:75,y:15,w:80, h:25,text:"0", font:font, pixelSize:25,
              alignHorizontal:scene.alignHorizontal.CENTER, textColor:0xd0d0d0ff});

  // Baseball Diamond to reflect runners
  var baseStatus = scene.create({t:"image",parent:gameInfo, x:150, y:20, resource:basesImgs[baseNum]});
  // Inning information
  var topBottomCont = scene.create({t:"object",parent:gameInfo,x:165, y:50 });
  // up arrow is "\u25B4"; down arrow is "\u25BE"
  var arrow = scene.create({t:"text",parent:topBottomCont,fillColor:0xd0d0d0ff,x:1,sx:1.3,h:10,w:10,pixelSize:15,text:"\u25B4",font:font});
  var inning = scene.create({t:"text",parent:topBottomCont,textColor:0xd0d0d0ff,x:-3,text:"8th",y:15});
  
    
  // Chicago Cubs
  // Sources for image.  Is quarterback link temporary?
  // http://quarterback-ci-restapi-teamcity.xreapps.net/sports_logos/MLB/1424553350259_17761872300_1424561313664_70_70.png
  // http://legacy.myriad-next.comcast.net/select/logo?entityId=6363552253441519119&width=70&height=70&extent=true
  var t2Pic = scene.create({t:"image", parent:gameInfo, x:280, w:70,cx:35,cy:35,h:70,y:10,url:"http://www.pxscene.org/examples/px-reference2/gallery/sports/images/gameSpecific/Cubs.png"});
  var t2Name = scene.create({t:"textBox", parent:gameInfo,x:190,y:50,w:80,h:25,text:"CHIC", font:fontNames, pixelSize:17,
              alignHorizontal:scene.alignHorizontal.CENTER, textColor:0xd0d0d0ff});
  var t2Line = scene.create({t:"rect", parent:gameInfo,x:195,y:70,w:70,h:2,lineColor:0x5555ffff,lineWidth:1});
  var t2Score = scene.create({t:"textBox",parent:gameInfo,x:190,y:15,w:80, h:25,text:"0", font:font, pixelSize:25,
              alignHorizontal:scene.alignHorizontal.CENTER, textColor:0xd0d0d0ff}); 
   
  var separator = scene.create({t:"rect",parent:gameInfo,y:105,w:350,lineWidth:1,h:2,lineColor:0xd0d0d050});
             
  var scoreboardCont = scene.create({t:"object",parent:gameInfo,y:110,w:350,h:610,clip:true}); 
  var scoreboardsSize = scoreboards.boards.length;
  var index = -1;
  var oldBoardImage;
  var boardImage;
  
  // Change the bases image as if there were runner activity
  function runner() {
    
    setTimeout(function() {
 
      // If old image had someone on third, pretend to score - 
      // not very realistic, but simple for demo
//      if( bases[baseNum].search(3) !== -1) {
        score();
        // randomly change the top/bottom inning indicator
        if(Math.random() < 0.5) {
          console.log("changing inning indicator");
          if( arrow.text === "\u25BE") 
            arrow.text = "\u25B4";
          else 
            arrow.text = "\u25BE";
        }
          
  //    }
        
      baseNum++;
      if(baseNum >= bases.length)
        baseNum = 0;
 
      baseStatus.animateTo({a:0.5},1.0,scene.animation.TWEEN_LINEAR,scene.animation.LOOP,1).
        then(function(obj) {
          baseStatus.resource = basesImgs[baseNum];
          baseStatus.animateTo({a:1},1.0,scene.animation.TWEEN_LINEAR,scene.animation.LOOP,1)
      });
      
      runner();
    },
    5000);
  }
  function score() {
    var tmp;
    var logo;
    
    if (Math.random() < 0.5) {
      tmp = t1Score;
      logo = t1Pic;
    }
    else {
      tmp = t2Score;
      logo = t2Pic;
    }
      
    var val = Number(tmp.text);
  
    // Animate score digits
    tmp.textColor = 0xffffffff;
    // TO DO:  THIS ref to undefined obj WILL CAUSE CORE DUMP - FIX IT!
    // obj.text = val+1;
    tmp.text= val+1;
    //tmp.animateTo({sx:1.5,sy:1.5},1.2,scene.animation.TWEEN_STOP,scene.animation.LOOP, 1).
      //then(function(obj) { 
        //obj.animateTo({sx:0.7,sy:0.7},1.5,scene.animation.EASE_OUT_ELASTIC,scene.animation.LOOP, 1).
        //then(function(obj) {
          //obj.textColor = 0xd0d0d0ff; 
        //})
      //});
      
    // Animate team logo
    logo.animateTo({r:-25},1.0,scene.animation.TWEEN_STOP,scene.animation.LOOP,1).
    then(function(obj) {
      logo.animateTo({r:360},0.8,scene.animation.EASE_OUT_ELASTIC,scene.animation.LOOP,1).
        then(function(obj) {
          obj.r = 0;
          tmp.textColor = 0xd0d0d0ff;
        });
      });


  }
  
  function rotate(key) {

    if( key === 37) {
      index--;
      if( index < 0) 
        index = scoreboardsSize-1;
    }
    else {
      index++;
      if(index >= scoreboardsSize) 
        index = 0;
    } 
      
    oldBoardImage = boardImage;

    boardImage = scene.create({t:"image", parent:scoreboardCont,x:key==39?400:-400, url:scoreboards.boards[index]});
    boardImage.ready.then(function(pic) {
      if( oldBoardImage !== undefined) {
        oldBoardImage.animateTo({a:0,x:key==39?-400:400},1.0,scene.animation.TWEEN_STOP,scene.animation.OPTION_LOOP, 1).
        then(function() {
          oldBoardImage.remove();
          });
      }
      boardImage.animateTo({x:0},1.0,scene.animation.TWEEN_STOP,scene.animation.OPTION_LOOP, 1);

             
   
    });
 
  }
  
  r.on("onKeyDown", function(e){

  var code = e.keyCode;
  console.log("onKeyDown");
    if( code == 37 || code == 39)  { 
      rotate(code); 
    }
  });
   

    
  r.focus = true;
  rotate(39);
  runner();

  // load scoreboard images for quicker, smoother scrolling
  for( var i = 0; i < scoreboardsSize; i++) {
    var imageRes = scene.create({t:"imageResource",url:scoreboards.boards[i]});
  }  
});

