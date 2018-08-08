/** 
 * Test event bubbling:
 * 
 * For onMouseDown, stopPropagation var value is used to set stopPropagation
 * when the onMouseDown for clickMeText is processed.  If working correctly, 
 * output should reflect all onPreMouseDown events, then only log output 
 * for clickMeText onMouseDown, then stop propgating events to all parents.
 * 
 * */


px.import("px:scene.1.js").then( function ready(scene) {

var root = scene.root;

var stopPropagation = false;

var bg = scene.create({t:"rect",fillColor:0xffffffff,w:scene.getWidth(),h:scene.getHeight(),parent:root});

var container = scene.create({t:"rect",parent:bg,x:250, y:150,h:300, w:300,fillColor:0xCC00CCff});

var button = scene.create({t:"rect", parent:container, fillColor:0x000000FF, x:25,y:25, w:150, h:30});
var clickMeText = scene.create({t:"textBox", parent:button, textColor:0xffffffff, text:"click me",
                                w:150, h:30, pixelSize:18,
                                alignHorizontal:scene.alignHorizontal.CENTER,
                                alignVertical:scene.alignVertical.CENTER});
var propagate = scene.create({t:"text",parent:bg,x:50, y:50, textColor:0x000000FF, text:"StopPropagation is "+stopPropagation});
// Get focus on textBox
clickMeText.focus = true;


function setPropagation( event) 
{
  if(stopPropagation === true)
    event.stopPropagation();
  
}

/**********************************************************************/
/** Event Handlers */
/**********************************************************************/
/* OnPreMouseDown */
clickMeText.on("onPreMouseDown", function (e)
{
  console.log("clickMeText onPreMouseDown");

});
button.on("onPreMouseDown", function (e)
{
  console.log("button onPreMouseDown");

});
container.on("onPreMouseDown", function (e)
{
  console.log("container onPreMouseDown");

});
bg.on("onPreMouseDown", function (e)
{
  console.log("bg onPreMouseDown");

});
root.on("onPreMouseDown", function (e)
{
  console.log("root onPreMouseDown");
  // Test that root stopPropagation works - okay!
  //scene.stopPropagation();
});
// TODO: Setting stopPropgation in scene.on has no effect
scene.on("onPreMouseDown", function (e)
{
  console.log("scene onPreMouseDown");
  stopPropagation(e);

});
scene.on("onMouseDown", function (e)
{
  console.log("scene onMouseDown");
  stopPropagation(e);

});
/* OnMouseDown */
clickMeText.on("onMouseDown", function (e)
{
  console.log("clickMeText onMouseDown");
  setPropagation(e);
  // Get focus on textBox
  clickMeText.focus = true;
  // animate
  button.fillColor=0xCCCCCCFF;
  // ToDo textColor animation does not work correctly?
  clickMeText.textColor=0xFF0000FF;
  clickMeText.animateTo({pixelSize:25},.3,scene.animation.TWEEN_LINEAR, scene.animation.OPTION_OSCILLATE,2).
    then(function(){
      button.fillColor=0x000000FF;
      //clickMeText.animateTo({pixelSize:18,textColor:0xFFFFFFFF},.3); 
      clickMeText.textColor=0xFFFFFFFF;
    });  

    
});
button.on("onMouseDown", function (e)
{
  console.log("button onMouseDown");

});
container.on("onMouseDown", function (e)
{
  console.log("container onMouseDown");

});
bg.on("onMouseDown", function (e)
{
  console.log("bg onMouseDown");

});
root.on("onMouseDown", function (e)
{
  console.log("root onMouseDown");

});


/* onPreFocus */
clickMeText.on("onPreFocus", function (e)
{
  console.log("clickMeText onPreFocus");


});
button.on("onPreFocus", function (e)
{
  console.log("button onPreFocus");

});
container.on("onPreFocus", function (e)
{
  console.log("container onPreFocus");

});
bg.on("onPreFocus", function (e)
{
  console.log("bg onPreFocus");

});
root.on("onPreFocus", function (e)
{
  console.log("root onPreFocus");

});


/* OnFocus */
clickMeText.on("onFocus", function (e)
{
  console.log("clickMeText onFocus");

  setPropagation(e);

});
button.on("onFocus", function (e)
{
  console.log("button onFocus");

});
container.on("onFocus", function (e)
{
  console.log("container onFocus");

});
bg.on("onFocus", function (e)
{
  console.log("bg onFocus");

});
root.on("onFocus", function (e)
{
  console.log("root onFocus");

});
scene.on("onFocus", function (e)
{
  console.log("scene onFocus");

});

/* OnPreBlur */
clickMeText.on("onPreBlur", function (e)
{
  console.log("clickMeText onPreBlur");

});
button.on("onPreBlur", function (e)
{
  console.log("button onPreBlur");

});
container.on("onPreBlur", function (e)
{
  console.log("container onPreBlur");

});
bg.on("onPreBlur", function (e)
{
  console.log("bg onPreBlur");

});
root.on("onPreBlur", function (e)
{
  console.log("root onPreBlur");

});


/* OnBlur */
clickMeText.on("onBlur", function (e)
{
  console.log("clickMeText onBlur");
  
  setPropagation(e);

});
button.on("onBlur", function (e)
{
  console.log("button onBlur");

});
container.on("onBlur", function (e)
{
  console.log("container onBlur");

});
bg.on("onBlur", function (e)
{
  console.log("bg onBlur");

});
root.on("onBlur", function (e)
{
  console.log("root onBlur");

});

scene.on("onBlur", function (e)
{
  console.log("scene onBlur");

});


}).catch( function importFailed(err){
  console.error("Import failed for eventBubbleTest.js: " + err)
});
