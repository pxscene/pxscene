// scene is provided to the module when it is created
px.import("px:scene.1.js").then( function ready(scene) {

  /*
  scene.create({
    t: "text",                // Element type will be text
    parent: scene.root,       // Parent element
    text: "Hello, World!",    // the text
    x: 100, y: 100,           // position
    textColor:0xff0000ff,     // RGBA - red text
    pixelSize:64              // font height
  });
  */

  var imageList = ["/images/carousel_ex1.png","/images/carousel_ex2.png","/images/carousel_ex3.png"];
  //var imageList = ["/images/TitleOne.jpg","/images/TitleTwo.jpg","/images/TitleThree.jpg"];

  var imageResources = [];

  var imageResource = scene.create({t:"imageResource", url:px.getPackageBaseFilePath()+imageList[0]}); //"/images/TitleOne.jpg"});
  imageResources.push(imageResource);
  imageResource = scene.create({t:"imageResource", url:px.getPackageBaseFilePath()+imageList[1]}); //+"/images/TitleTwo.jpg"});
  imageResources.push(imageResource);
  imageResource = scene.create({t:"imageResource", url:px.getPackageBaseFilePath()+imageList[2]}); //+"/images/TitleThree.jpg"});
  imageResources.push(imageResource);

  imageResources[0].ready.then(function(o) {
    console.log("Image is ready: " +o.w + ", h=" + o.h);
    console.log("   img.w = " + o.w + ", img.h="+o.h);

  });

  var carousel = new ImageCarousel(imageResources);
  carousel.init();

  var timerId = setInterval(function() {
    carousel.animateLeft();
  }, 2000);

  function ImageCarousel(imageResources) {
    var animationSpeed = 0.7;
    var images = pictures;
    var pictures = [];
    var offScreenPicture = null;

    var pictureWidth = 883; //1200;
    var pictureHeight = 354; //300;
    var leftIndex = imageResources.length-1;
    var currentIndex = 0;
    var rightIndex = currentIndex+1;
    var numFullImages = 1;
    var numVisibleImages = 3; // one full, two partial
    var firstFullImageIndex = 2;
    var numRotatingCarouselImages = numVisibleImages + 2;
    var firstFullVisibleResourceIndex = 0;

    var currentResourceSlot = 0;

    var parentWidth = 1280;
    var remainingWidth = parentWidth - pictureWidth;
    var pictureSideGap = 20;
    var picturesPerRow = Math.floor(parentWidth/pictureWidth);
    var parentCenterX = parentWidth/2;
    var centerPictureX = pictureWidth/2;
    var centerPictureLeftX = parentCenterX - centerPictureX;
    var centerIndex = 1;

    var centerCarouselIndex = Math.floor(numRotatingCarouselImages/2);
    var firstImageX = centerPictureLeftX + (0-centerCarouselIndex)*(pictureWidth+pictureSideGap);
    var lastImageX = centerPictureLeftX + ((numRotatingCarouselImages-1)-centerCarouselIndex)*(pictureWidth+pictureSideGap);


    this.init = function() {
      console.log("Middle Carousel Index=" + centerCarouselIndex);

      // create the image objects
      for(var k=0; k < numRotatingCarouselImages; ++k) {
        var picture = scene.create({t:"image", x:-5000, y:35, parent:scene.root});
        pictures.push(picture);
      }

      var numImageSlots = pictures.length;
      var firstImageSlotOffset = -2;
      for(var k = 0; k < numImageSlots; ++k) {
        var imageResourceIndex = offsetResourceIndex(currentResourceSlot, k+firstImageSlotOffset, imageResources.length);
        pictures[k].resource = imageResources[imageResourceIndex];
        console.log("k=" + k + ", value=" + imageResourceIndex + ", resource=" + imageResources[imageResourceIndex]);
        //console.log("  x=" + (-2320 + k*(1200+20)) );
        var x = centerPictureLeftX + (k-centerCarouselIndex)*(pictureWidth+pictureSideGap);
        console.log("  x=" + x );
        pictures[k].x = x; //-twoBack + k*(pictureWidth+20); //(k+firstImageSlotOffset)*(1200 + 80);
      }

    }

    function offsetResourceIndex(index, offset, buffer_size) {
      var value = (((index+offset) % buffer_size) + buffer_size) % buffer_size;

      return value;
    }

    var currentPictureIndex = 0;

    var animationInProgress = false;

    this.handleLeftKey = function() {
      if( animationInProgress ) {
        completeAnimationRight(false);
      }

      carousel.animateRight();
    }

    this.handleRightKey = function() {
      if( animationInProgress ) {
        completeAnimationLeft(false);
      }

      carousel.animateLeft();
    }

    this.animateLeft = function() {
      var promises = [];
      var duration = animationSpeed;

      // move the left-most image to the right side
      //some code goes here

      animationInProgress = true;
      for(var k=0; k < 5; ++k) {
        var pictureIndex = (currentPictureIndex+k) % pictures.length;
        //var deltaX = (1200+20);
        var deltaX = (pictureWidth+pictureSideGap);
        var promise = pictures[k].animateTo({x:pictures[k].x-deltaX},
          duration, scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP|scene.FASTFORWARD, 1);
        promises[k] = promise;
      }

      Promise.all(promises).then(function() {
        console.log("All animations complete");
        completeAnimationLeft(true);
      });
    }

    var completeAnimationLeft = function(isAnimationComplete) {
      if( isAnimationComplete === false ) {
        for(var k=0; k < 5; ++k) {
          //var x = (-2400 + k*(1200+20)) - (1200+20);
          var x = centerPictureLeftX + (k-centerCarouselIndex)*(pictureWidth+pictureSideGap);

          pictures[k].x = x;
        }
      }

      ++currentPictureIndex;
      console.log("   currentPictureIndex="+currentPictureIndex);

      // bump up currentResourceSlot
      currentResourceSlot = offsetResourceIndex(currentResourceSlot, 1, imageResources.length);
      console.log("   currentResourceSlot is now " + currentResourceSlot + " out of " + imageResources.length + " images");

      var temp = pictures[0];
      for(var k=1; k < 5; ++k) {
        pictures[k-1] = pictures[k];
      }
      pictures[4] = temp;

      var lastImageIndex = 4;
      //var deltaX = (1200+20);
      var deltaX = (pictureWidth+pictureSideGap);
      //var imageResourceIndex = offsetResourceIndex(currentResourceSlot, lastResourceIndex+firstImageSlotOffset, imageResources.length);
      var endResourceSlot = offsetResourceIndex(currentResourceSlot, 2, imageResources.length)
      console.log("     endResourceSlot is now " + endResourceSlot);
      pictures[lastImageIndex].resource = imageResources[endResourceSlot];
      console.log("  x=" + (-2320 + lastImageIndex*deltaX) );
      //var newX = -2400 + lastImageIndex*deltaX; //(k+firstImageSlotOffset)*(1200 + 80);
      var newX = firstImageX + lastImageIndex*deltaX; //(k+firstImageSlotOffset)*(1200 + 80);
      console.log("  x=" + newX);
      pictures[lastImageIndex].x = newX;

      animationInProgress = false;
    }

    this.animateRight = function() {
      var promises = [];
      var duration = animationSpeed;

      console.log("Animate right");

      // move the right-most image to the left side
      //some code goes here

      animationInProgress = true;
      for(var k=4; k >= 0; --k) {
        //var pictureIndex = (currentPictureIndex+k) % pictures.length;
        var deltaX = (pictureWidth+pictureSideGap);
        var promise = pictures[k].animateTo({x:pictures[k].x+deltaX},
          duration, scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP|scene.FASTFORWARD , 1);
        promises[k] = promise;
      }

      Promise.all(promises).then(function() {
        console.log("All animations complete");
        completeAnimationRight(true);
      });
    }

    function completeAnimationRight(isAnimationComplete) {
      if( isAnimationComplete === false ) {
        for(var k=0; k < 5; ++k) {
          //pictures[k].x = (-2400 + k*(1200+20)) + (1200+20);
          //var x = (-2400 + k*(1200+20)) + (1200+20);
          var x = centerPictureLeftX + (k-centerCarouselIndex)*(pictureWidth+pictureSideGap);

          pictures[k].x = x;
        }
      }

      --currentPictureIndex;
      console.log("   currentPictureIndex="+currentPictureIndex);

      // bump up currentResourceSlot
      currentResourceSlot = offsetResourceIndex(currentResourceSlot, -1, imageResources.length);
      console.log("   currentResourceSlot is now " + currentResourceSlot + " out of " + imageResources.length + " images");

      var temp = pictures[4];
      for(var k=4; k > 0; --k) {
        pictures[k] = pictures[k-1];
      }
      pictures[0] = temp;

      var firstImageIndex = 0;
      //var imageResourceIndex = oNffsetResourceIndex(currentResourceSlot, lastResourceIndex+firstImageSlotOffset, imageResources.length);
      var endResourceSlot = offsetResourceIndex(currentResourceSlot, -2, imageResources.length)
      console.log("     endResourceSlot is now " + endResourceSlot);
      pictures[firstImageIndex].resource = imageResources[endResourceSlot];
      console.log("  x=" + (-2320 + firstImageIndex*(1200+20)) );
      ///var newX = -2400 + firstImageIndex*(1200+20); //(k+firstImageSlotOffset)*(1200 + 80);
      var deltaX = (pictureWidth+pictureSideGap);
      //var newX = -2400 + lastImageIndex*deltaX; //(k+firstImageSlotOffset)*(1200 + 80);
      var newX = firstImageX + firstImageIndex*deltaX; //(k+firstImageSlotOffset)*(1200 + 80);
      console.log("  x=" + newX);
      pictures[firstImageIndex].x = newX;

      animationInProgress = false;
    }

  }

  scene.root.on("onKeyDown", function(code, flags) {
    //console.log("keydown in scene.root", code, flags);

    console.log("KeyCode=" + code.keyCode);
    switch(code.keyCode) {
      case 37:
        console.log("moveRight - " + carousel);
        if( timerId !== -1 ) {
          clearInterval(timerId);
          timerId = -1;
        }
        carousel.handleLeftKey();
        break;
      case 39:
        console.log("moveLeft - " + carousel);
        if( timerId !== -1 ) {
          clearInterval(timerId);
          timerId = -1;
        }
        carousel.handleRightKey();
        break;
    }
  });


}).catch(function importFailed(err){
    console.error("Import failed for helloworld.js: " + err);
});
