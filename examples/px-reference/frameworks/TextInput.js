px.import({scene:"px:scene.1.js",keys:'px:tools.keys.js'}).then( function ready(imports) {

  var scene = imports.scene;
  var root = scene.root;
  var keys = imports.keys;

  var TextInput = function(config) {
    var inputConfig = config;
    
    var pts = config.pixelSize;
    var fontRes = config.font;
    if( config.font === undefined) {
      fontRes  = scene.create({t:"fontResource",url:"FreeSans.ttf"});
    }
    var promptText= config.promptText;
    var inputWidth = config.w;
    var inputHeight = config.h;
    if( config.h === undefined) {
      inputHeight = 40;
    }
    var x = config.x;
    var y = config.y;
    var value = config.value;
    
    var promptColor = config.promptColor;
    if( promptColor === undefined) {
      promptColor = 0x869CB2ff;
    }
    var inputColor = config.inputColor;
    if( inputColor === undefined) {
      inputColor = 0x303030ff;
    }

        //var inputRes = scene.create({t:"imageResource",url:"input2.png"});
        var inputRes = scene.create({t:"imageResource",url:"http://pxscene.org/examples/px-reference/gallery/images/input2.png"});
        var inputBg  = scene.create({t:"image9",resource:inputRes,a:0,y:y,insetLeft:10,insetRight:10,insetTop:10,insetBottom:10,parent:config.root});
        var prompt   = scene.create({t:"textBox",text:promptText,parent:config.root,pixelSize:pts,textColor:promptColor,x: x, y: y});
        var textinput = scene.create({t:"text",text:value, font:fontRes, parent:inputBg,pixelSize:pts,textColor:inputColor,x: 10,a:0});
        var cursor = scene.create({t:"rect", w:2, h:inputHeight-(inputHeight/2), fillColor:0xFF0000FF, parent:inputBg,x:10,y:8,a:0});
        var cursor_pos = 0;

        var selection ;//      = scene.create({t:"rect", w:2, h:inputBg.h-15, parent:inputBg, fillColor:0xFCF2A488, x:10,y:30});
        var selection_x     = 0;
        var selection_start = 0;
        var selection_chars = 0; // number of characters selected  (-)ive is LEFT of cursor start position
        var selection_text  = "";
        
      prompt.ready.then(function(o) {
        var dims = fontRes.measureText(pts,prompt.text);
        inputBg.h = inputHeight; 
        inputBg.x = (prompt.x+dims.w+10);
        inputBg.w = inputWidth;
        inputBg.a = 0.9;//scene.create({t:"image9",h:inputHeight,resource:inputRes,a:0.9,x:(prompt.x+dims.w+10),y:y,w:inputWidth,insetLeft:10,insetRight:10,insetTop:10,insetBottom:10,parent:root});
        inputBg.ready.then(function(o) {
           selection = scene.create({t:"rect", w:2, h:inputHeight-(inputHeight/2), parent:inputBg, fillColor:0xFCF2A488, x:10,y:8,a:0});
           cursor.h = inputHeight-(inputHeight/2);//scene.create({t:"rect", w:2, h:inputHeight-(inputHeight/2), fillColor:0xFF0000FF, parent:inputBg,x:10,y:8,a:0});
           textinput.y = ((inputHeight-pts)/10);//scene.create({t:"text",text:value, font:fontRes, parent:inputBg,pixelSize:pts,textColor:0x303030ff,x: 10, y: ((inputHeight-pts)/10)}); //fix this calc!
           textinput.a = 1;
           textinput.ready.then(function(o) {
              cursor_pos = fontRes.measureText(pts,textinput.text).w;

            });
            inputBg.on("onBlur", function (e)
            {
              console.log("inputBg onBlur for "+prompt.text);
              cursor.a = 0;

            });
            inputBg.on("onFocus", function (e)
            {
              console.log("inputBg onFocus for "+prompt.text);
              // Why is cursor not ready second time around????  Old bug that I sent to Jake??
              //cursor.ready.then(function(o) {
                console.log("CURSOR READY");
                updateCursor(cursor_pos);
                cursor.a = 1;
                cursor.animateTo({a:0},0.5,   scene.animation.TWEEN_LINEAR,scene.animation.OPTION_OSCILLATE,scene.animation.COUNT_FOREVER);
              //});

            });

          inputBg.on("onChar", function(e) {
            var code  = e.charCode;
            switch(code)
            {
              case keys.BACKSPACE:
              case keys.LEFT:
                {
                  console.log("BACKSPACE " + textinput.text);
        
                  var text = textinput.text;
                  if( text.length > 0) {
                    text = text.slice(0, -1);
                    textinput.text = text; 
                    cursor_pos -= 1; // removed 1 character
                    updateCursor(cursor_pos);
                  }

                }
                break;

              default:
                console.log("onChar DEFAULT in TextInput for "+prompt.text);
                //if(code >= keys.ZERO && code <= keys.Z) {
                      // insert character
                      textinput.text = textinput.text.slice(0, cursor_pos) + String.fromCharCode(code) + textinput.text.slice(cursor_pos);
                      cursor_pos += 1; // inserted 1 character
                      updateCursor(cursor_pos);
                //  }
                break;
            }
          }); // onChar
          
          inputBg.on("onKeyDown", function(e)
          {
            var code  = e.keyCode;
            var flags = e.flags;

            if (code == keys.ENTER)  
              return;
                
            switch(code)
            {
              case keys.BACKSPACE:
              case keys.LEFT:
                {
                  console.log("BACKSPACE " + textinput.text);
        
                  var text = textinput.text;
                  if( text.length > 0) {
                    text = text.slice(0, -1);
                    textinput.text = text; 
                    cursor_pos -= 1; // removed 1 character
                    updateCursor(cursor_pos);
                  }

                }
                break;
            } // SWITCH

          }); // onKeyDown
           

        });
        

      });




      function updateCursor(pos)
      {
        var       s = textinput.text.slice();
        var    snip = s.slice(0, pos); // measure characters to the left of cursor
        var metrics = fontRes.measureText(pts, snip);

        cursor.x = textinput.x + metrics.w; // offset to cursor


      }

    
    
    
    /*                     */
    /* HERE'S THE RETURN   */
    /*                     */
    return {
      setFocus: function() {
        console.log("SETTTING FOCUS IN TEXTINPUT for "+prompt.text);
        inputBg.focus = true;
        //cursor.ready.then(function(o){
          //updateCursor(cursor_pos);
          //selection_chars = 1;
          //cursor.a = 1;
          //cursor.animateTo({a:0},0.5,   scene.animation.TWEEN_LINEAR,scene.animation.OPTION_OSCILLATE,scene.animation.COUNT_FOREVER);
        //});
      },
      getFocus: function() {
        return inputBg.focus;
      },
      
      getValue: function() {
        return textinput.text;
      },
      
      ready: new Promise(function(resolve, reject) {
        
        Promise.all([prompt.ready,inputBg.ready,fontRes.ready,textinput.ready])//,cursor.ready,selection.ready])
        .then(function() {
          console.log("PROMISE ALL IS READY");
          resolve();
        });
        
      })
    };
    
  }

module.exports = TextInput;

}).catch(function importFailed(err){
    console.error("Import failed for textinput.js: " + err);
});
