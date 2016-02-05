px.import("px:scene.1.js").then( function ready(scene) {
 
  /** Implementation of a row of images that navigates left and right 
   *  and can blur/focus */
  var ImageRow = function(parent, startX, startY, width, height, urls, parmImageWidth,parmImageHeight)
  { 
    //console.log("parmImageWidth is "+parmImageWidth);
    var numTiles = urls.length;//6;
    console.log("numTiles is "+numTiles);
    // Need a solution that's scalable rather than hard-coded w?
    var container = scene.create({t:"object",parent:parent,h:height, w:width, x:startX, y:startY});
    var tiles = {};  
    var x = container.x;
    var imageWidth = 180;
    if(parmImageWidth !==undefined) imageWidth = parmImageWidth;
    var imageHeight = 240;
    if(parmImageHeight !==undefined) imageHeight = parmImageHeight;
    var imageSeparator = 10;
    var focusRatio = 0.125;
    var focusIndex = 1;
    var scrollPoint = 250; // Point at which tiles begin to animate out of current positions
    // Create the focus lines
    upperLine = scene.create({draw:false,t:"rect",parent:container,h:2, w:imageWidth, x:x, y:startY-2,lineWidth:1,lineColor:0xFFFFFFFF});
    lowerLine = scene.create({draw:false,t:"rect",parent:container,h:2, w:imageWidth, x:x, y:startY+height+2,lineWidth:1,lineColor:0xFFFFFFFF});  
     
    var navDirection = 0; // 1=right; 2= left; 3=wrap?
    
    /**All the logic to animate the row of images for Left navigation */
    var animateLeftArrow = function(c) 
    {
      var tempX;
      if((c.x +imageWidth) > scrollPoint) 
      {
        console.log("greater than scrollPoint");
        tempX = scrollPoint-(imageWidth)-(imageWidth*focusRatio)+imageSeparator;
        // x position has to adjust for scroll and the slight size change when focused.

        //tempX = c.x-((imageWidth+imageSeparator)-(imageWidth*focusRatio));
      }
      else 
      {
        
        tempX = c.x+((imageWidth)-(imageWidth*focusRatio))+imageSeparator;
        console.log("tempX is "+tempX);
        var tmp = (tempX-(focusIndex*(imageWidth+imageSeparator)));
        console.log("calc is "+tmp+" > "+(container.x-(imageWidth*focusRatio)));
        if(tempX-((focusIndex)*(imageWidth+imageSeparator)) > (container.x-(imageWidth*focusRatio)))
        {
          console.log("setting tempX from left hand side");
          tempX = container.x+((focusIndex)*imageWidth+imageSeparator) - (imageWidth*focusRatio);
        }
        
        if( tempX < (container.x-(imageWidth*focusRatio)) )
        {
          tempX = (container.x-(imageWidth*focusRatio));
        }
        for( var m = 0; m < numTiles; m++)
        {
          if( m < focusIndex) 
          {
            tiles[m].animateTo({x:(tempX+(imageWidth*focusRatio))-((focusIndex-m)*(imageWidth+imageSeparator))},
                                0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_END);
          }
          else if(m > focusIndex)
          {
            tiles[m].animateTo({x:(tempX+(imageWidth*focusRatio))+((m-focusIndex)*(imageWidth+imageSeparator))},
                                0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_END);
          }
        }
      }      
      return tempX;
    } // End animateLeftArrow
    
    /** All the logic to animate the row of images for Left navigation */
    var animateRightArrow = function(c)
    {
      var tempX;
      tempX = (c.x-(imageWidth+imageSeparator))-(imageWidth*focusRatio);
      if( (tempX +imageWidth) < scrollPoint) 
      {
        tempX = c.x-(imageWidth*focusRatio)-imageSeparator;
      } 
      else
      {
        // focusIndex image will end at scrollPoint
        console.log("focusIndex is "+focusIndex);
        // Push all images over
        for(var m = 0; m < numTiles; m++) 
        {
          if( m < focusIndex) 
          {
            tiles[m].animateTo({x:scrollPoint-((focusIndex-m)*(imageWidth+imageSeparator))},
                                0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_END);
          }
          else if( m >= focusIndex) 
          {
            if( m == focusIndex) 
            {
              tempX = scrollPoint+((m-focusIndex)*(imageWidth+imageSeparator));
              
            } 
            else
            {
              tiles[m].animateTo({x:scrollPoint+((m-focusIndex)*(imageWidth+imageSeparator))},
                                  0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_END);

            }
          }

        }
      }      
      return tempX;
    } // End animateRightArrow
    
    
    /** Create and Load the imageRows */
    for(var i=0; i < numTiles; i++) 
    {
      console.log("creating image for url:"+urls[i]);
      tiles[i]  = scene.create({t:"image",parent:container, w:imageWidth, h:imageHeight, x:x,
                                url:urls[i]});//"http://edge.ccp-img.xcr.comcast.net/ccp_img/pkr_prod/VMS_POC_Image_Ingest/77/485/ScoobyDooFrankencreepy-Poster_1407946075576_180_240.jpg"});
      x += imageWidth+imageSeparator;


      /** OnBlur: Shrink the image back to size */
      tiles[i].on("onBlur", function(e) 
      {
        console.log("image onBlur");
        e.propagation = false;
        var c = e.target;
        // TODO: When container is losing focus ad items have been scrolled,
        // the OnBlur is animating to non-focused size, but x is slightly off
        c.animateTo({w: imageWidth, h:imageHeight, x:c.x+(imageWidth*focusRatio)-(imageSeparator) , y:c.y+(imageHeight*focusRatio) },
          0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_END);      
      });
      
      /** OnFocus: Blow the image up to indicate focus */
      tiles[i].on("onFocus", function (e) 
      {
        console.log("image onFocus");
        e.propagation = false;
        var c = e.target;
        var tempX;
        // Calculate new coordinates and dimensions
        if( navDirection == 1)  // Scrolling RIGHT!
        {
          tempX = animateRightArrow(c);
        }
        else if( navDirection == 2)  // Scrolling LEFT!
        {
          tempX = animateLeftArrow(c);
        }
        else if( navDirection==0)  // Just getting initial focus to container
        {
          tempX = c.x-(imageWidth*focusRatio);
        }
        // Animate focus lines
        upperLine.animateTo({w: imageWidth * (1+(focusRatio*2)), x:tempX, y:c.y-(imageHeight*focusRatio)-2},
          0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_END);
        lowerLine.animateTo({w: imageWidth * (1+(focusRatio*2)), x:tempX, y:(c.y-(imageHeight*focusRatio))+(imageHeight * (1+(focusRatio*2)))},
          0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_END);
                  
        c.moveToFront();
        c.animateTo({w: imageWidth * (1+(focusRatio*2)), h:imageHeight * (1+(focusRatio*2)), x:tempX, y:c.y-(imageHeight*focusRatio)},
          0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_END);
          
   
     
      });
      
    }
   
    /** Container OnFocus: Pass focus on to the focused image */
    container.on('onFocus', function(e) 
    {
      console.log("container got onFocus");
      //upperLine.draw = true;
      //lowerLine.draw = true;  
      scene.setFocus(tiles[focusIndex]);
      
    });
    container.on('onBlur', function(e) 
    {
      console.log("container got onBlur");
      upperLine.draw = false;
      lowerLine.draw = false;  
      navDirection=0;
      
    }.bind(this));    
    
    /** Container onKeyDown: Navigate and blur/focus across the images */
    container.on("onKeyDown", function(e) 
    {
      if(e.keyCode == 39) // right arrow
      {
        console.log("imageRow got right arrow");
        if( focusIndex >= numTiles-1)
          return;
        // TODO: Stop Propagation is not preventing the imageMenu from 
        // receiving these keys!
        e.stopPropagation(true);// = true;
        focusIndex++;
        //if( focusIndex >= numTiles)
        //{
          //focusIndex = 0;
        //}
        navDirection=1;
        scene.setFocus(tiles[focusIndex]);
      }
      else if(e.keyCode == 37) // left arrow 
      {
        console.log("imageRow got left arrow");
        if( focusIndex == 0)
          return;
        e.stopPropagation(true);// = true;
        focusIndex--;
        //if( focusIndex < 0)
        //{
          //focusIndex = numTiles-1;
        //}
        navDirection=2;
        scene.setFocus(tiles[focusIndex]);      
      }
      else if(e.keyCode == 40) // down arrow
      { 
        console.log("imageRow down arrow");
      } 
      else if(e.keyCode == 38) // up arrow
      { 
         console.log("imageRow up arrow"); 
      }      
    });
    
    /** setFocus on the image at index */
    this.setFocus = function() 
    { 
      console.log("ImageRow setFocus");
      //if( index < 0)
        //index = focusIndex;
      //else if( index >= numTiles)
        //index = numTiles-1;
      //  focusIndex = index;
      upperLine.draw = true;
      lowerLine.draw = true;  
      scene.setFocus(container);
      //scene.setFocus(tiles[focusIndex]);
        
    }
    /** Return the index of the focused image */
    this.getFocusedIndex = function()
    {
      console.log("ImageRow getFocusedIndex");
      return focusIndex;
    }
    
    /** Animate the entire container to given x,y coordinates */
    this.animateTo = function(newX, newY)
    {
      container.animateTo({x:newX,y:newY},0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_END);
    }
    

    
  } // End ImageRow definition
 
 
 
    //var row = new ImageRow(scene.root);
  
  module.exports =  ImageRow;

}).catch(function importFailed(err){
  console.log("Import failed for helloworld_style.js: " + err);
});
